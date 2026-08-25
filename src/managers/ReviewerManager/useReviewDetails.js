import {computed, ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useApp} from '@/composables/useApp';
import {useNotify} from '@/composables/useNotify';
import {useFetch} from '@/composables/useFetch';
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';

import {useReviewContent} from './useReviewContent';
import {isReviewConfirmed} from './reviewAssignment';
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

	const reviewAssignmentRef = ref(reviewAssignment);

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

	const {
		fetch: sendConfirmation,
		isSuccess: isConfirmationSaved,
		isLoading: isConfirming,
	} = useFetch(considerApiUrl, {
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

	// The editor's rating of the reviewer
	const rating = ref(null);

	const {
		fetch: sendRating,
		isSuccess: isRatingSaved,
		isLoading: isSavingRating,
	} = useFetch(reviewAssignmentApiUrl, {
		method: 'PUT',
		body: computed(() => ({quality: rating.value})),
	});

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
			onRatingChange: saveRating,
		},
		{inDisplayMode: true},
	);

	const isConfirmed = computed(() =>
		isReviewConfirmed(reviewAssignmentRef.value),
	);

	// Validate if the review is complete enough to be confirmed, and if not, show a message explaining why
	const confirmBlockedMessage = computed(() => {
		if (isLoadingReview.value || isConfirmed.value) {
			return null;
		}

		const isMissingRecommendation =
			isOJS() && !reviewAssignmentRef.value?.reviewerRecommendationId;

		return isMissingRecommendation || hasUnansweredRequiredFields.value
			? t('editor.review.confirmReview.incomplete')
			: null;
	});

	const modifiedByMessage = computed(() => {
		const fullName = reviewAssignmentRef.value?.lastModifiedBy?.userFullName;

		return fullName
			? t('editor.review.reviewLastModifiedBy', {username: fullName})
			: null;
	});

	async function loadReviewAssignment() {
		await fetchReviewAssignment();

		if (isReviewAssignmentLoaded.value) {
			reviewAssignmentRef.value = reviewAssignmentData.value;
		}
	}

	async function saveRating(quality) {
		rating.value = quality;

		await sendRating();

		if (isRatingSaved.value) {
			notify(t('editor.review.reviewerRating.saved'), 'success');
		}

		await loadReviewAssignment();
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
			reviewAssignmentRef.value = viewedReviewAssignment.value;
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

						await sendConfirmation();

						if (isConfirmationSaved.value) {
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
	loadReviewAssignment().then(markViewedIfNew);

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
