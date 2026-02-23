import {defineStore} from 'pinia';
import {ref, computed, nextTick} from 'vue';
import {usePkpTab} from '@/frontend/composables/usePkpTab';

export const usePkpOpenReviewStore = defineStore('pkpOpenReview', () => {
	// State
	const openReviewData = ref(null);
	const submissionSummary = ref(null);
	const urlParamChecked = ref(false);
	const expandedRoundIds = ref([]);
	const expandedContentIds = ref([]); // Unified state for author response and review IDs
	const headingLevel = ref(3);

	/**
	 * Map reviewerRecommendationTypeId to key and icon names
	 * Uses constants from pkp.const.reviewerRecommendationType (set via setConstants in ArticleHandler)
	 * - key (snake_case): for `data-recommendation` CSS selectors
	 * - iconName (PascalCase): for PkpIcon component
	 */
	const recommendationTypeMap = {
		[pkp.const.reviewerRecommendationType.APPROVED]: {
			key: 'approved',
			iconName: 'ReviewApproved',
		},
		[pkp.const.reviewerRecommendationType.NOT_APPROVED]: {
			key: 'notApproved',
			iconName: 'ReviewNotApproved',
		},
		[pkp.const.reviewerRecommendationType.REVISIONS_REQUESTED]: {
			key: 'revisionsRequested',
			iconName: 'ReviewRevisionsRequested',
		},
		[pkp.const.reviewerRecommendationType.WITH_COMMENTS]: {
			key: 'withComments',
			iconName: 'ReviewComments',
		},
	};

	/**
	 * Get recommendation type info (key and iconName) for a given type ID
	 * @param {number} typeId - The reviewerRecommendationTypeId
	 * @returns {Object|null} Object with key and iconName, or null if not found
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
	function initialize({
		publicationsPeerReviews,
		submissionPeerReviewSummary,
		headingLevel: level,
	}) {
		if (level != null) {
			headingLevel.value = level;
		}
		// Store submission-level summary, filtering out recommendations with null type
		submissionSummary.value = {
			...submissionPeerReviewSummary,
			reviewerRecommendations: (
				submissionPeerReviewSummary?.reviewerRecommendations ?? []
			).filter((rec) => !!rec.recommendationTypeId && rec.count > 0),
		};

		// Flatten review rounds from all publications
		const allReviewRounds = (publicationsPeerReviews || []).flatMap(
			(pub) => pub.reviewRounds || [],
		);

		// Enrich reviews with recommendation type CSS class and round info
		for (const round of allReviewRounds) {
			for (const review of round.reviews || []) {
				// Add recommendation key and icon based on reviewerRecommendationTypeId
				if (review.reviewerRecommendationTypeId) {
					const typeInfo =
						recommendationTypeMap[review.reviewerRecommendationTypeId];
					review.reviewerRecommendationTypeKey = typeInfo?.key || null;
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
					expandedContentIds.value = [result.review.id];
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
	 * @returns {Array} Array of {typeKey, count, label} objects
	 */
	function getRoundSummary(round) {
		const reviews = round.reviews || [];

		return Object.entries(recommendationTypeMap)
			.map(([typeId, typeInfo]) => {
				const matching = reviews.filter(
					(r) => String(r.reviewerRecommendationTypeId) === typeId,
				);
				if (matching.length === 0) return null;

				return {
					typeKey: typeInfo.key,
					typeIcon: typeInfo.iconName,
					count: matching.length,
					label: matching[0].reviewerRecommendationTypeLabel || typeId,
				};
			})
			.filter(Boolean);
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
	 * Expand a content item (review or author response)
	 * @param {number|string} contentId - The content ID to expand
	 */
	function expandContent(contentId) {
		if (!expandedContentIds.value.includes(contentId)) {
			expandedContentIds.value.push(contentId);
		}
	}

	/**
	 * Expand a review accordion (alias for expandContent for backwards compatibility)
	 * @param {number|string} reviewId - The review ID to expand
	 */
	function expandReview(reviewId) {
		expandContent(reviewId);
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
		headingLevel,
		openReviewData,
		submissionSummary,
		reviewRounds,
		reviewerGroups,
		expandedRoundIds,
		expandedContentIds,

		// Actions
		initialize,
		getRoundSummary,
		getReviewCount,
		getRecommendationTypeInfo,
		findReviewById,
		expandRound,
		expandContent,
		expandReview,
		scrollToReview,
		viewFullRecord,
		scrollToReviewFromUrl,
	};
});
