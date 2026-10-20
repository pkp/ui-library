import {ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useNotify} from '@/composables/useNotify';
import {useAuthorResponseForm} from './useAuthorResponseForm';

import AuthorResponseFormModal from './AuthorResponseFormModal.vue';

/**
 * Drives the read-only author response modal and its Modify and Mark as Complete actions.
 */
export function useAuthorResponseView({
	submission,
	stageId,
	reviewRound,
	authorOptions,
}) {
	const {t} = useLocalize();
	const {openDialog, openSideModal, closeSideModal} = useModal();
	const {notify} = useNotify();

	// Replaced after each modification, so the next Modify starts from the saved response
	const authorResponse = ref(reviewRound.authorResponse);

	const {form, set, setAuthorResponseValues, isAuthor, isEditor} =
		useAuthorResponseForm(
			{submission, stageId, reviewRound, authorOptions},
			{inDisplayMode: true},
		);

	function onModified(updatedResponse) {
		authorResponse.value = updatedResponse;
		setAuthorResponseValues(updatedResponse);
		closeSideModal(AuthorResponseFormModal);
		notify(t('common.changesSaved'), 'success');
	}

	function modifyResponse() {
		openDialog({
			title: t('submission.reviewRound.authorResponse.modify.confirmTitle'),
			message: t(
				'submission.reviewRound.authorResponse.modify.confirmMessage',
				{
					userFullName: authorResponse.value.submittedByUser.fullName,
				},
			),
			modalStyle: 'primary',
			actions: [
				{
					label: t(
						'submission.reviewRound.authorResponse.modifyAuthorResponse',
					),
					isPrimary: true,
					callback: (close) => {
						close();
						openSideModal(AuthorResponseFormModal, {
							submission,
							stageId,
							reviewRound: {
								...reviewRound,
								authorResponse: authorResponse.value,
							},
							authorOptions,
							onSuccessFn: onModified,
						});
					},
				},
				{
					label: t('common.cancel'),
					isWarnable: true,
					callback: (close) => close(),
				},
			],
		});
	}

	function markAsComplete() {
		openDialog({
			title: t('submission.reviewRound.authorResponse.markAsComplete.title'),
			message: t(
				'submission.reviewRound.authorResponse.markAsComplete.message',
			),
			modalStyle: 'primary',
			actions: [
				{
					label: t('editor.review.markAsComplete'),
					isPrimary: true,
					callback: (close) => {
						// TODO: send the request once the author response has a complete endpoint
						close();
					},
				},
				{
					label: t('common.cancel'),
					isWarnable: true,
					callback: (close) => close(),
				},
			],
		});
	}

	return {form, set, isAuthor, isEditor, modifyResponse, markAsComplete};
}
