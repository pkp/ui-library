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
		setCanSubmit,
	} = useForm();

	const {getSupportedFormLocales} = useApp();
	const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

	const hasFormResponseValue = ref(!!reviewRound.authorResponse);
	const hasFormAuthorsValue = ref(
		!!reviewRound.authorResponse?.associatedAuthors.length,
	);

	const canUserSubmitForm = computed(() => {
		const hasFormData = hasFormResponseValue.value && hasFormAuthorsValue.value;

		// If user is author then they can submit ONLY if a response was not previously submitted
		if (
			hasCurrentUserAtLeastOneAssignedRoleInStage(submission, stageId, [
				pkp.const.ROLE_ID_AUTHOR,
			]) &&
			!reviewRound.authorResponse &&
			hasFormData
		) {
			return true;
		}

		// If user is editor, manager, or admin, then they can edit and submit the form.
		if (
			hasCurrentUserAtLeastOneAssignedRoleInStage(submission, stageId, [
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SITE_ADMIN,
			]) &&
			!!reviewRound.authorResponse &&
			hasFormData
		) {
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
		locales: getSupportedFormLocales(),
	});

	addGroup('default');
	addPage('default', {
		submitButton: {
			label: t('submission.reviewRound.authorReviewResponse.submit'),
		},
		cancelButton: {label: t('common.cancel')},
	});

	const defaultAuthorResponseTextValue = getSupportedFormLocales();
	Object.keys(defaultAuthorResponseTextValue).forEach((key) => {
		defaultAuthorResponseTextValue[key] = '';
	});

	addFieldRichTextArea('authorResponse', {
		toolbar: 'bold italic underline bullist',
		plugins: ['lists'],
		groupId: 'default',
		size: 'large',
		value:
			reviewRound.authorResponse?.response || defaultAuthorResponseTextValue,
		isRequired: true,
		isMultilingual: true,
		label: t('submission.reviewRound.authorResponse'),
		onChange: (name, attr, val) => {
			hasFormResponseValue.value = !!val;
		},
	});

	addFieldOptions('associatedAuthorIds', 'checkbox', {
		options: authorOptions.map((a) => ({value: a.id, label: a.fullName})),
		value: reviewRound.authorResponse?.associatedAuthors.map((a) => a.id) || [],
		label: 'Authors',
		description: t('submission.reviewRound.authorReviewResponse.submit'),
		isRequired: true,
		onChange: (name, attr, val) => {
			hasFormAuthorsValue.value = !!val.length;
		},
	});

	setCanSubmit(canUserSubmitForm);
	return {
		form,
		set,
	};
}
