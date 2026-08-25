import {computed, ref} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';

// True once an editor has confirmed the review
export function isReviewConfirmed(reviewAssignment) {
	if (reviewAssignment?.considered === undefined) {
		return !!reviewAssignment?.dateConsidered;
	}

	return [
		pkp.const.REVIEW_ASSIGNMENT_CONSIDERED,
		pkp.const.REVIEW_ASSIGNMENT_RECONSIDERED,
	].includes(reviewAssignment.considered);
}

/** The review assignment, and the decisions an editor records against it. */
export function useReviewAssignment({
	submission,
	reviewAssignment: _reviewAssignment,
}) {
	const reviewAssignment = ref(_reviewAssignment);

	const {apiUrl: reviewAssignmentApiUrl} = useUrl(
		`submissions/${encodeURIComponent(submission.id)}/reviewAssignments/${_reviewAssignment.id}`,
	);

	const {
		fetch: fetchReviewAssignment,
		data: reviewAssignmentData,
		isSuccess: isReviewAssignmentLoaded,
		isLoading: isLoadingAssignment,
	} = useFetch(reviewAssignmentApiUrl);

	// Consider api or when editor calls "Confirm"
	const {apiUrl: considerApiUrl} = useUrl(
		`submissions/${encodeURIComponent(submission.id)}/reviewAssignments/${_reviewAssignment.id}/consider`,
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

	const isConfirmed = computed(() => isReviewConfirmed(reviewAssignment.value));

	async function loadReviewAssignment() {
		await fetchReviewAssignment();

		if (isReviewAssignmentLoaded.value) {
			reviewAssignment.value = reviewAssignmentData.value;
		}
	}

	// Editor confirms the review, this updates the status to "Complete"
	async function confirmReview() {
		await sendConfirmation();

		return isConfirmationSaved.value;
	}

	// Records that an editor has seen the review, as "Review Viewed" in the table
	async function markViewedIfNew() {
		// Nothing is viewed until the reviewer submits, or the status is already "Review Viewed"
		if (
			!reviewAssignment.value?.dateCompleted ||
			reviewAssignment.value.considered !== pkp.const.REVIEW_ASSIGNMENT_NEW
		) {
			return false;
		}

		await sendViewed();

		if (!isViewedRecorded.value) {
			return false;
		}

		reviewAssignment.value = viewedReviewAssignment.value;

		return true;
	}

	async function saveRating(quality) {
		rating.value = quality;

		await sendRating();
		const isSaved = isRatingSaved.value;

		await loadReviewAssignment();

		return isSaved;
	}

	return {
		reviewAssignment,
		isLoadingAssignment,
		isConfirmed,
		isConfirming,
		isSavingRating,
		loadReviewAssignment,
		confirmReview,
		markViewedIfNew,
		saveRating,
	};
}
