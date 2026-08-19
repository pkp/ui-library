import {computed, ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';

import {isReviewConfirmed, useReviewDetailsForm} from './useReviewDetailsForm';

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

	const isConfirming = ref(false);

	// Review assignment api
	const {apiUrl: reviewAssignmentApiUrl} = useUrl(
		`submissions/${encodeURIComponent(submission.id)}/reviewAssignments/${reviewAssignment.id}`,
	);

	const {
		fetch: fetchReviewAssignment,
		data: reviewAssignmentData,
		isSuccess: isReviewAssignmentLoaded,
		isLoading: isLoadingAssignment,
	} = useFetch(reviewAssignmentApiUrl);

	// Consider api or when editor calls "Confirm"
	const {apiUrl: considerApiUrl} = useUrl(
		`submissions/${encodeURIComponent(submission.id)}/reviewAssignments/${reviewAssignment.id}/consider`,
	);

	const {fetch: sendConfirmation} = useFetch(considerApiUrl, {
		method: 'PUT',
		body: {considered: pkp.const.REVIEW_ASSIGNMENT_CONSIDERED},
		// A 409 means it was confirmed elsewhere while this modal was open
		onError: (e) => e.status === 409,
	});

	// Marks the review as "Viewed"
	const {
		fetch: sendViewed,
		data: viewedReviewAssignment,
		isSuccess: isViewedRecorded,
	} = useFetch(considerApiUrl, {
		method: 'PUT',
		body: {considered: pkp.const.REVIEW_ASSIGNMENT_VIEWED},
		// Failing to record the view should not interrupt reading the review
		onError: () => true,
	});

	const {
		form,
		set,
		refreshFormData,
		loadReviewContent,
		isLoadingReview,
		reviewAssignmentRef,
	} = useReviewDetailsForm(
		{
			submission,
			submissionStageId,
			reviewRoundId,
			reviewAssignment,
			recommendations,
		},
		{inDisplayMode: true, isLoadingAssignment},
	);

	const isConfirmed = computed(() =>
		isReviewConfirmed(reviewAssignmentRef.value),
	);

	const modifiedByMessage = computed(() => {
		const fullName = reviewAssignmentRef.value?.lastModifiedBy?.userFullName;

		return fullName
			? t('editor.review.reviewLastModifiedBy', {username: fullName})
			: null;
	});

	async function loadReviewAssignment() {
		await fetchReviewAssignment();

		if (isReviewAssignmentLoaded.value) {
			refreshFormData(reviewAssignmentData.value);
		}
	}

	async function reloadReview() {
		await Promise.all([loadReviewAssignment(), loadReviewContent()]);
		onDataChangedFn();
	}

	// Records that an editor has seen the review, as "Review Viewed" in the table
	async function markViewedIfNew() {
		// Nothing is viewed until the reviewer submits, or the status is already "Review Viewed"
		if (
			!reviewAssignmentRef.value?.dateCompleted ||
			reviewAssignmentRef.value.considered !== pkp.const.REVIEW_ASSIGNMENT_NEW
		) {
			return;
		}

		await sendViewed();

		if (isViewedRecorded.value) {
			refreshFormData(viewedReviewAssignment.value);
			onDataChangedFn();
		}
	}

	// Editor confirms the review, this updates the status to "Complete"
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
					label: t('editor.review.confirmReview.button'),
					isPrimary: true,
					callback: async (close) => {
						close();

						isConfirming.value = true;
						try {
							await sendConfirmation();
							await reloadReview();
						} finally {
							isConfirming.value = false;
						}
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
						openSideModal(ReviewDetailsEditModal, {
							submission,
							submissionStageId,
							reviewRoundId,
							reviewAssignment: reviewAssignmentRef.value,
							recommendations,
							onSavedFn: reloadReview,
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

	// Automatically load review assignment, the useReviewDetailsForm directly loads the review content (comments/review form)
	loadReviewAssignment().then(markViewedIfNew);

	return {
		form,
		set,
		isLoadingReview,
		isConfirming,
		isConfirmed,
		confirm,
		editReview,
		modifiedByMessage,
	};
}
