import {defineStore} from 'pinia';
import {ref, computed, nextTick} from 'vue';
import {usePkpTab} from '@/frontend/composables/usePkpTab';

export const usePkpOpenReviewStore = defineStore('pkpOpenReview', () => {
	// State
	const openReviewData = ref(null);
	const submissionSummary = ref(null);
	const urlParamChecked = ref(false);
	const expandedRoundIds = ref([]);
	const expandedReviewIds = ref([]);

	/**
	 * Map reviewerRecommendationTypeId to CSS class and icon names
	 * Uses constants from pkp.const.reviewerRecommendationType (set via setConstants in ArticleHandler)
	 * - cssClass (snake_case): for `data-recommendation` CSS selectors
	 * - iconName (PascalCase): for PkpIcon component
	 */
	const recommendationTypeMap = {
		[pkp.const.reviewerRecommendationType.APPROVED]: {
			cssClass: 'approved',
			iconName: 'ReviewApproved',
		},
		[pkp.const.reviewerRecommendationType.NOT_APPROVED]: {
			cssClass: 'not_approved',
			iconName: 'ReviewNotApproved',
		},
		[pkp.const.reviewerRecommendationType.REVISIONS_REQUESTED]: {
			cssClass: 'revisions_requested',
			iconName: 'ReviewRevisionsRequested',
		},
		[pkp.const.reviewerRecommendationType.WITH_COMMENTS]: {
			cssClass: 'with_comments',
			iconName: 'ReviewComments',
		},
	};

	/**
	 * Get recommendation type info (cssClass and iconName) for a given type ID
	 * @param {number} typeId - The reviewerRecommendationTypeId
	 * @returns {Object|null} Object with cssClass and iconName, or null if not found
	 */
	function getRecommendationTypeInfo(typeId) {
		return recommendationTypeMap[typeId] || null;
	}

	/**
	 * Find a review by its ID across all review rounds
	 * @param {number|string} reviewId - The review ID to find
	 * @returns {Object|null} Object with { review, round } or null if not found
	 */
	function findReviewById(reviewId) {
		const targetId = parseInt(reviewId, 10);
		if (isNaN(targetId)) return null;

		for (const round of reviewRounds.value) {
			for (const review of round.reviews || []) {
				if (review.id === targetId) {
					return {review, round};
				}
			}
		}
		return null;
	}

	/**
	 * Initialize the store with publications peer reviews data
	 * @param {Object} props - Configuration object
	 * @param {Array} props.publicationsPeerReviews - Array of publications, each with reviewRounds
	 * @param {Object} props.submissionPeerReviewSummary - Summary of peer reviews at submission level
	 */
	function initialize({publicationsPeerReviews, submissionPeerReviewSummary}) {
		// Store submission-level summary, filtering out recommendations with null type
		submissionSummary.value = {
			...submissionPeerReviewSummary,
			reviewerRecommendations: (
				submissionPeerReviewSummary?.reviewerRecommendations ?? []
			).filter((rec) => !!rec.recommendationTypeId),
		};

		// Flatten review rounds from all publications
		const allReviewRounds = (publicationsPeerReviews || []).flatMap(
			(pub) => pub.reviewRounds || [],
		);

		// Enrich reviews with recommendation type CSS class and round info
		for (const round of allReviewRounds) {
			for (const review of round.reviews || []) {
				// Add recommendation CSS class and icon based on reviewerRecommendationTypeId
				if (review.reviewerRecommendationTypeId) {
					const typeInfo =
						recommendationTypeMap[review.reviewerRecommendationTypeId];
					review.reviewerRecommendationTypeCss = typeInfo?.cssClass || null;
					review.reviewerRecommendationTypeIcon = typeInfo?.iconName || null;
				}
				// Copy round info needed for "By Reviewer" view (avoids circular reference)
				review.round = {
					roundId: round.roundId,
					displayText: round.displayText,
					date: round.date,
				};
			}
		}

		openReviewData.value = {reviewRounds: allReviewRounds};

		// Check URL for reviewId parameter (only once)
		if (!urlParamChecked.value && typeof window !== 'undefined') {
			urlParamChecked.value = true;
			const urlParams = new URLSearchParams(window.location.search);
			const reviewId = urlParams.get('reviewId');
			if (reviewId) {
				const result = findReviewById(reviewId);
				if (result) {
					// Expand the round containing the review and the review itself
					expandedRoundIds.value = [result.round.roundId];
					expandedReviewIds.value = [result.review.id];
					// Switch to peer-review-record tab
					viewFullRecord();
					return;
				}
			}
		}

		// Default: expand first round
		if (allReviewRounds.length > 0) {
			expandedRoundIds.value = [allReviewRounds[0].roundId];
		}
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

				// Add review (round reference is already attached in initialize)
				reviewerMap.get(reviewerId).reviews.push(review);
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
	 * @returns {Array} Array of {typeCss, count, label} objects
	 */
	function getRoundSummary(round) {
		const counts = {};
		const labels = {};

		for (const review of round.reviews || []) {
			if (review.reviewerRecommendationTypeId) {
				const typeId = review.reviewerRecommendationTypeId;
				counts[typeId] = (counts[typeId] || 0) + 1;
				// Store label from server (use first encountered label for each type)
				if (!labels[typeId] && review.reviewerRecommendationTypeLabel) {
					labels[typeId] = review.reviewerRecommendationTypeLabel;
				}
			}
		}

		return Object.entries(counts).map(([typeId, count]) => {
			const typeInfo = recommendationTypeMap[typeId];
			return {
				typeCss: typeInfo?.cssClass || null,
				typeIcon: typeInfo?.iconName || null,
				count,
				label: labels[typeId] || typeId,
			};
		});
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
	 * Expand a round accordion
	 * @param {number|string} roundId - The round ID to expand
	 */
	function expandRound(roundId) {
		if (!expandedRoundIds.value.includes(roundId)) {
			expandedRoundIds.value.push(roundId);
		}
	}

	/**
	 * Expand a review accordion
	 * @param {number|string} reviewId - The review ID to expand
	 */
	function expandReview(reviewId) {
		if (!expandedReviewIds.value.includes(reviewId)) {
			expandedReviewIds.value.push(reviewId);
		}
	}

	/**
	 * Scroll a review element into view
	 * @param {number|string} reviewId - The review ID to scroll to
	 */
	function scrollToReview(reviewId) {
		const element = document.querySelector(`[data-review-id="${reviewId}"]`);
		if (element) {
			element.scrollIntoView({behavior: 'smooth', block: 'center'});
		}
	}

	/**
	 * Handle viewing the full peer review record
	 * Switches to the peer-review-record tab
	 */
	function viewFullRecord() {
		const {setTab} = usePkpTab('tab');
		setTab('peer-review-record');
	}

	/**
	 * Scroll to review specified in URL parameter
	 * Called by PkpOpenReview component after mount
	 */
	async function scrollToReviewFromUrl() {
		if (typeof window === 'undefined') return;

		const urlParams = new URLSearchParams(window.location.search);
		const reviewId = urlParams.get('reviewId');
		if (reviewId) {
			// Wait for accordion expansion animation to complete
			await nextTick();
			scrollToReview(reviewId);
		}
	}

	return {
		// State
		openReviewData,
		submissionSummary,
		reviewRounds,
		reviewerGroups,
		expandedRoundIds,
		expandedReviewIds,

		// Actions
		initialize,
		getRoundSummary,
		getReviewCount,
		getRecommendationTypeInfo,
		findReviewById,
		expandRound,
		expandReview,
		scrollToReview,
		viewFullRecord,
		scrollToReviewFromUrl,
	};
});
