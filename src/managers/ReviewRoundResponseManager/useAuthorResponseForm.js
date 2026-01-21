import {computed, ref} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';
import {useCurrentUser} from '@/composables/useCurrentUser';
export function useAuthorResponseForm({
	submission,
	stageId,
	reviewRound,
	authorOptions,
}) {
	const {t} = useLocalize();

	const {
		form,
		initEmptyForm,
		addFieldRichTextArea,
		addFieldOptions,
		addPage,
		addGroup,
		set,
		setValues,
		setCanSubmit,
	} = useForm({});

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

	initEmptyForm('ReviewRoundAuthorResponse', {
		showErrorFooter: false,
		method: reviewRound.authorResponse ? 'PUT' : 'POST',
		action: apiUrl,
	});

	addPage('default', {
		submitButton: {
			label: isEditor.value
				? t('common.save')
				: t('submission.reviewRound.authorReviewResponse.submit'),
		},
		cancelButton: {label: t('common.cancel')},
	});

	addGroup('default');

	addFieldRichTextArea('authorResponse', {
		toolbar: 'bold italic underline bullist',
		plugins: ['lists'],
		groupId: 'default',
		size: 'large',
		value: defaultMultilingualValues,
		isRequired: true,
		isMultilingual: true,
		label: t('submission.reviewRound.authorResponse'),
		onChange: (name, attr, val) => {
			hasFormResponseValue.value = !!val;
		},
	});

	addFieldOptions('associatedAuthorIds', 'checkbox', {
		options: authorOptions.map((a) => ({value: a.id, label: a.fullName})),
		value: [],
		label: t('submission.authors'),
		description: t('submission.reviewRound.associatedAuthors.description'),
		isRequired: true,
		onChange: (name, attr, val) => {
			hasFormAuthorsValue.value = !!val.length;
		},
	});

	if (reviewRound.authorResponse) {
		setValues({
			authorResponse: reviewRound.authorResponse.response,
			associatedAuthorIds:
				reviewRound.authorResponse.associatedAuthors.map((a) => a.id),
		});
	}

	setCanSubmit(canUserSubmitForm);
	return {
		form,
		set,
	};
}
