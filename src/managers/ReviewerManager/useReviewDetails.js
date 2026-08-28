import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useApp} from '@/composables/useApp';
import {useNotify} from '@/composables/useNotify';
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';

import {useReviewAssignment} from './useReviewAssignment';
import {useReviewContent} from './useReviewContent';
import {useReviewDetailsForm} from './useReviewDetailsForm';

import ReviewDetailsEditModal from './ReviewDetailsEditModal.vue';

/** Drives the Review Details modal: its form, its data and its buttons. */
export function useReviewDetails({
	submission,
	submissionStageId,
	reviewRoundId,
	reviewAssignment,
	recommendations = [],
	onDataChangedFn = () => {},
}) {
	const {t} = useLocalize();
	const {openDialog, openSideModal} = useModal();
	const {isOJS} = useApp();
	const {notify} = useNotify();
	// Modals mount outside the workflow page, so the file manager needs its own provider
	const {triggerDataChange} = useDataChangedProvider();

	const {
		reviewAssignment: reviewAssignmentRef,
		isLoadingAssignment,
		isConfirmed,
		isConfirming,
		isSavingRating,
		loadReviewAssignment,
		confirmReview,
		markViewedIfNew,
		saveRating,
	} = useReviewAssignment({submission, reviewAssignment});

	const {
		reviewContent,
		isLoadingReviewContent,
		loadReviewContent,
		downloadReview,
	} = useReviewContent({submission, reviewAssignment});

	const isLoadingReview = computed(
		() => isLoadingAssignment.value || isLoadingReviewContent.value,
	);

	const {form, set, hasUnansweredRequiredFields} = useReviewDetailsForm(
		{
			submission,
			submissionStageId,
			reviewRoundId,
			reviewAssignment: reviewAssignmentRef,
			reviewContent,
			recommendations,
			isLoadingReview,
			isSavingRating,
			onDownload: downloadReview,
			onRatingChange: rateReviewer,
		},
		{inDisplayMode: true},
	);

	// Validate if the review is complete enough to be confirmed, and if not, show a message explaining why
	const confirmBlockedMessage = computed(() => {
		if (isLoadingReview.value || isConfirmed.value) {
			return null;
		}

		const isMissingRecommendation =
			isOJS() && !reviewAssignmentRef.value?.reviewerRecommendationId;

		if (isMissingRecommendation) {
			return t('editor.review.confirmReview.missingRecommendation');
		}

		return hasUnansweredRequiredFields.value
			? t('editor.review.confirmReview.incomplete')
			: null;
	});

	const modifiedByMessage = computed(() => {
		const fullName = reviewAssignmentRef.value?.lastModifiedBy?.userFullName;

		return fullName
			? t('editor.review.reviewLastModifiedBy', {username: fullName})
			: null;
	});

	async function rateReviewer(quality) {
		if (await saveRating(quality)) {
			notify(t('editor.review.reviewerRating.saved'), 'success');
		}
	}

	// triggerDataChange reloads the file manager, onDataChangedFn the reviewers table
	async function reloadReview() {
		await Promise.all([
			loadReviewAssignment(),
			loadReviewContent(),
			triggerDataChange(),
		]);
		onDataChangedFn();
	}

	function confirm() {
		const confirmMessage = reviewAssignmentRef.value?.isReviewPubliclyVisible
			? `${t('editor.review.confirmReview.message.publiclyVisible')} ${t('editor.review.confirmReview.message')}`
			: t('editor.review.confirmReview.message');

		openDialog({
			title: t('editor.review.confirmReview.title'),
			message: confirmMessage,
			modalStyle: 'primary',
			actions: [
				{
					label: t('editor.review.markAsComplete'),
					isPrimary: true,
					callback: async (close) => {
						close();

						if (await confirmReview()) {
							notify(t('editor.review.confirmReview.success'), 'success');
						}

						await reloadReview();
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

	// Confirms, then opens Modify Review over the Review Details modal
	function editReview() {
		openDialog({
			title: t('editor.review.modifyReview.confirmTitle'),
			message: t('editor.review.modifyReview.confirmMessage', {
				reviewerName: reviewAssignmentRef.value.reviewerFullName,
			}),
			modalStyle: 'primary',
			actions: [
				{
					label: t('editor.review.modifyReview'),
					isPrimary: true,
					callback: (close) => {
						close();
						openSideModal(
							ReviewDetailsEditModal,
							{
								submission,
								submissionStageId,
								reviewRoundId,
								reviewAssignment: reviewAssignmentRef.value,
								recommendations,
								onSavedFn: reloadReview,
							},
							{onClose: triggerDataChange},
						);
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

	loadReviewContent();
	loadReviewAssignment().then(async () => {
		if (await markViewedIfNew()) {
			onDataChangedFn();
		}
	});

	return {
		form,
		set,
		isLoadingReview,
		isConfirming,
		isConfirmed,
		confirmBlockedMessage,
		confirm,
		editReview,
		modifiedByMessage,
	};
}
