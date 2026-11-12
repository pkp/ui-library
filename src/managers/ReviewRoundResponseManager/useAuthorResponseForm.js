import {computed, ref} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';
import {useCurrentUser} from '@/composables/useCurrentUser';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useFormChanged} from '@/composables/useFormChanged';

import AuthorResponseInfo from './AuthorResponseInfo.vue';

export function useAuthorResponseForm(
	{submission, stageId, reviewRound, authorOptions},
	{inDisplayMode = false} = {},
) {
	const {t} = useLocalize();
	const {openDialog} = useModal();

	const {
		form,
		initEmptyForm,
		addFieldRichTextArea,
		addFieldOptions,
		addFieldComponent,
		getField,
		addPage,
		addGroup,
		set,
		setValues,
		setCanSubmit,
	} = useForm({}, {customSubmit: handleFormSubmission});

	const {getSupportedFormLocales} = useApp();
	const supportedFormLocales = Object.keys(getSupportedFormLocales());
	const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

	const defaultMultilingualValues = supportedFormLocales.reduce((val, l) => {
		val[l] = '';
		return val;
	}, {});

	const hasFormResponseValue = ref(!!reviewRound.authorResponse);
	const hasFormAuthorsValue = ref(
		!!reviewRound.authorResponse?.associatedAuthors.length,
	);

	/**
	 * Indicates if the current user is an author in the submission's stage
	 */
	const isAuthor = computed(() =>
		hasCurrentUserAtLeastOneAssignedRoleInStage(submission, stageId, [
			pkp.const.ROLE_ID_AUTHOR,
		]),
	);

	const isEditor = computed(() =>
		hasCurrentUserAtLeastOneAssignedRoleInStage(submission, stageId, [
			pkp.const.ROLE_ID_SUB_EDITOR,
			pkp.const.ROLE_ID_MANAGER,
			pkp.const.ROLE_ID_SITE_ADMIN,
		]),
	);

	const canUserSubmitForm = computed(() => {
		const hasFormData = hasFormResponseValue.value && hasFormAuthorsValue.value;

		// If user is author then they can submit ONLY if a response was not previously submitted
		if (isAuthor.value && !reviewRound.authorResponse && hasFormData) {
			return true;
		}

		// If user is editor, manager, or admin, then they can edit and submit the form.
		if (isEditor.value && !!reviewRound.authorResponse && hasFormData) {
			return true;
		}

		return false;
	});

	const {apiUrl} = useUrl(
		reviewRound.authorResponse
			? `reviews/${submission.id}/${reviewRound.id}/authorResponse/${reviewRound.authorResponse.id}`
			: `reviews/${submission.id}/${reviewRound.id}/authorResponse`,
	);

	initEmptyForm(
		inDisplayMode
			? 'ReviewRoundAuthorResponseDisplay'
			: 'ReviewRoundAuthorResponse',
		{
			showErrorFooter: false,
			method: reviewRound.authorResponse ? 'PUT' : 'POST',
			action: apiUrl,
		},
	);

	addPage(
		'default',
		inDisplayMode
			? {}
			: {
					submitButton: {
						label: isEditor.value
							? t('common.saveChanges')
							: t('submission.reviewRound.authorReviewResponse.submit'),
					},
					cancelButton: {label: t('common.cancel')},
				},
	);

	if (reviewRound.authorResponse && isEditor.value) {
		addGroup('responseInfo');
		addFieldComponent('responseInfo', {
			component: AuthorResponseInfo,
			componentProps: {
				authorResponse: reviewRound.authorResponse,
				inDisplayMode,
			},
			groupId: 'responseInfo',
		});
	}

	addGroup('default');

	addFieldRichTextArea('authorResponse', {
		toolbar: 'bold italic underline bullist',
		plugins: ['lists'],
		groupId: 'default',
		size: 'large',
		value: defaultMultilingualValues,
		isRequired: !inDisplayMode,
		isMultilingual: true,
		label: t('submission.reviewRound.authorResponse'),
		onChange: (name, attr, val) => {
			hasFormResponseValue.value = !!val;
		},
	});

	addFieldOptions('associatedAuthorIds', 'checkbox', {
		// Display mode only lists the associated authors, so it does not wait on the publication's authors
		options: toAuthorOptions(
			inDisplayMode
				? reviewRound.authorResponse?.associatedAuthors
				: authorOptions,
		),
		value: [],
		label: t('submission.authors'),
		description: t('submission.reviewRound.associatedAuthors.description'),
		isRequired: !inDisplayMode,
		onChange: (name, attr, val) => {
			hasFormAuthorsValue.value = !!val.length;
		},
	});

	function toAuthorOptions(authors) {
		return (authors || []).map((a) => ({value: a.id, label: a.fullName}));
	}

	function setAuthorResponseValues(authorResponse) {
		if (inDisplayMode) {
			getField('associatedAuthorIds').options = toAuthorOptions(
				authorResponse.associatedAuthors,
			);
		}
		// Copied, as the form writes into its value and the response object is shared with the view modal
		setValues({
			authorResponse: {...authorResponse.response},
			associatedAuthorIds: authorResponse.associatedAuthors.map((a) => a.id),
		});
	}

	if (reviewRound.authorResponse) {
		setAuthorResponseValues(reviewRound.authorResponse);
	}

	const {setInitialState} = useFormChanged(form, [], {
		warnOnClose: !inDisplayMode,
	});

	function confirmSaveToPublicResponse() {
		return new Promise((resolve) => {
			openDialog({
				title: t('submission.reviewRound.authorResponse.saveChanges.title'),
				message: t('submission.reviewRound.authorResponse.saveChanges.message'),
				modalStyle: 'primary',
				actions: [
					{
						label: t('common.saveChanges'),
						isPrimary: true,
						callback: (close) => {
							resolve(true);
							close();
						},
					},
					{
						label: t('common.cancel'),
						isWarnable: true,
						callback: (close) => {
							resolve(false);
							close();
						},
					},
				],
				close: () => resolve(false),
			});
		});
	}

	async function handleFormSubmission(formData) {
		// A public response changes on the article page as soon as it is saved, so confirm first; cancelling keeps the form open unsaved
		if (
			reviewRound.authorResponse?.isPublic &&
			!(await confirmSaveToPublicResponse())
		) {
			return {};
		}

		const {fetch, data, validationError} = useFetch(apiUrl, {
			method: reviewRound.authorResponse ? 'PUT' : 'POST',
			body: formData,
			expectValidationError: true,
		});
		await fetch();

		if (!validationError.value && data.value) {
			setInitialState();
		}

		return {data: data.value, validationError: validationError.value};
	}

	setCanSubmit(canUserSubmitForm);
	return {
		form,
		set,
		setAuthorResponseValues,
		isAuthor,
		isEditor,
	};
}
