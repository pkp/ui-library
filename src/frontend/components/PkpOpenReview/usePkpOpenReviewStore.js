import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export const usePkpOpenReviewStore = defineStore('pkpOpenReview', () => {
	// State
	const openReviewData = ref(null);

	/**
	 * Initialize the store with open review data
	 * @param {Object} props - Configuration object
	 * @param {Object} props.openReviewData - The open review data containing reviewRounds
	 */
	function initialize({openReviewData: _openReviewData}) {
		openReviewData.value = _openReviewData;
	}

	/**
	 * Get all review rounds
	 */
	const reviewRounds = computed(() => {
		return openReviewData.value?.reviewRounds || [];
	});

	/**
	 * Get reviews grouped by reviewer for the "by reviewer" view
	 */
	const reviewerGroups = computed(() => {
		const reviewerMap = new Map();

		for (const round of reviewRounds.value) {
			for (const review of round.reviews || []) {
				const reviewerId = review.reviewerId;

				if (!reviewerMap.has(reviewerId)) {
					reviewerMap.set(reviewerId, {
						reviewerId: reviewerId,
						reviewerFullName: review.reviewerFullName,
						reviewerAffiliation: review.reviewerAffiliation,
						reviews: [],
					});
				}

				// Add review with round context
				reviewerMap.get(reviewerId).reviews.push({
					...review,
					roundDisplayText: round.displayText,
					roundDate: round.date,
					roundId: round.roundId,
				});
			}
		}

		// Sort by reviewer name and return as array
		return Array.from(reviewerMap.values()).sort((a, b) =>
			a.reviewerFullName.localeCompare(b.reviewerFullName),
		);
	});

	/**
	 * Get summary counts for each recommendation type in a round
	 * @param {Object} round - The round object
	 * @returns {Array} Array of {recommendation, count, label} objects
	 */
	function getRoundSummary(round) {
		const recommendationLabels = {
			approved: 'Approved',
			revisions_requested: 'Revisions Requested',
			not_approved: 'Not Approved',
			comments: 'Comments',
		};

		const counts = {
			approved: 0,
			revisions_requested: 0,
			not_approved: 0,
			comments: 0,
		};

		for (const review of round.reviews || []) {
			if (
				review.recommendation &&
				counts[review.recommendation] !== undefined
			) {
				counts[review.recommendation]++;
			}
		}

		// Return only non-zero counts as array for easy iteration
		return Object.entries(counts)
			.filter(([, count]) => count > 0)
			.map(([recommendation, count]) => ({
				recommendation,
				count,
				label: recommendationLabels[recommendation],
			}));
	}

	/**
	 * Get review count for a round or reviewer group
	 * @param {Object} item - Round or reviewer group object
	 * @returns {number} Number of reviews
	 */
	function getReviewCount(item) {
		return item.reviews?.length || 0;
	}

	/**
	 * Handle opening/reading a review
	 * @param {Object} review - The review object
	 */
	function openReview(review) {
		// TODO: Implement review opening logic (modal, navigation, etc.)
		console.log('Opening review:', review);
	}

	return {
		// State
		openReviewData,
		reviewRounds,
		reviewerGroups,

		// Actions
		initialize,
		getRoundSummary,
		getReviewCount,
		openReview,
	};
});
