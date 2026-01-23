import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import {usePkpModal} from '@/frontend/composables/usePkpModal';
import PkpOpenReviewModal from './PkpOpenReviewModal.vue';
import {usePkpTab} from '@/frontend/composables/usePkpTab';

export const usePkpOpenReviewStore = defineStore('pkpOpenReview', () => {
	// State
	const openReviewData = ref(null);
	const submissionSummary = ref(null);
	const currentReviewContext = ref({reviews: [], currentIndex: 0});

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
	 * Get the currently displayed review in the modal
	 */
	const currentReview = computed(() => {
		const ctx = currentReviewContext.value;
		return ctx.reviews[ctx.currentIndex] || null;
	});

	/**
	 * Check if there's a previous review to navigate to
	 */
	const hasPrev = computed(() => currentReviewContext.value.currentIndex > 0);

	/**
	 * Check if there's a next review to navigate to
	 */
	const hasNext = computed(() => {
		const ctx = currentReviewContext.value;
		return ctx.currentIndex < ctx.reviews.length - 1;
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
	 * Handle opening/reading a review
	 * @param {Object} review - The review object
	 * @param {Array} contextReviews - Array of reviews for navigation context
	 */
	function openReview(review, contextReviews) {
		const index = contextReviews.findIndex((r) => r.id === review.id);
		currentReviewContext.value = {
			reviews: contextReviews,
			currentIndex: index >= 0 ? index : 0,
		};

		const {openDialog} = usePkpModal();
		openDialog({
			bodyComponent: PkpOpenReviewModal,
			bodyProps: {},
			showCloseButton: true,
		});
	}

	/**
	 * Navigate to the previous review in the current context
	 */
	function navigatePrev() {
		if (hasPrev.value) {
			currentReviewContext.value.currentIndex--;
		}
	}

	/**
	 * Navigate to the next review in the current context
	 */
	function navigateNext() {
		if (hasNext.value) {
			currentReviewContext.value.currentIndex++;
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

	return {
		// State
		openReviewData,
		submissionSummary,
		reviewRounds,
		reviewerGroups,
		currentReview,
		hasPrev,
		hasNext,

		// Actions
		initialize,
		getRoundSummary,
		getReviewCount,
		getRecommendationTypeInfo,
		openReview,
		navigatePrev,
		navigateNext,
		viewFullRecord,
	};
});
