import {inject, ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';

import {useReviewContent} from './useReviewContent';
import {isReviewConfirmed} from './reviewAssignment';
import {useReviewDetailsForm} from './useReviewDetailsForm';

/**
 * Drives the Modify Review modal: its form, its data and its save.
 */
export function useReviewDetailsEdit({
	submission,
	submissionStageId,
	reviewRoundId,
	reviewAssignment,
	recommendations = [],
	onSavedFn = () => {},
}) {
	const {t} = useLocalize();
	const {openDialog} = useModal();
	// Modals mount outside the workflow page, so the file manager needs its own provider
	useDataChangedProvider();
	const closeModal = inject('closeModal');

	const reviewAssignmentRef = ref(reviewAssignment);

	const {
		reviewContent,
		isLoadingReviewContent,
		loadReviewContent,
		saveReviewContent,
		downloadReview,
	} = useReviewContent({submission, reviewAssignment});

	const {form, set, setInitialState, getReviewPayload} = useReviewDetailsForm(
		{
			submission,
			submissionStageId,
			reviewRoundId,
			reviewAssignment: reviewAssignmentRef,
			reviewContent,
			recommendations,
			isLoadingReview: isLoadingReviewContent,
			onSubmit: handleFormSubmission,
			onDownload: downloadReview,
		},
		{inDisplayMode: false},
	);

	function confirmWithDialog({title, message, confirmLabel}) {
		return new Promise((resolve) => {
			openDialog({
				title,
				message,
				modalStyle: 'primary',
				actions: [
					{
						label: confirmLabel,
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
		// When a review has already been confirmed and OPR, saving changes should confirm before sending the request
		if (
			isReviewConfirmed(reviewAssignmentRef.value) &&
			reviewAssignmentRef.value?.isReviewPubliclyVisible
		) {
			const proceed = await confirmWithDialog({
				title: t('editor.review.saveChanges.title'),
				message: t('editor.review.saveChanges.message'),
				confirmLabel: t('common.saveChanges'),
			});
			if (!proceed) {
				return {};
			}
		}

		const result = await saveReviewContent(getReviewPayload(formData));

		if (result.isSuccess) {
			setInitialState();
			await onSavedFn();

			closeModal();
		}

		return result;
	}

	loadReviewContent();

	return {
		form,
		set,
		isLoadingReview: isLoadingReviewContent,
	};
}
