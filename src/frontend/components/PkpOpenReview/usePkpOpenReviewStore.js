import {defineStore} from 'pinia';
import {ref, computed, nextTick} from 'vue';
import {usePkpTab} from '@/frontend/composables/usePkpTab';

export const ReviewState = Object.freeze({
	COMPLETED: 'completed',
	IN_PROGRESS: 'inProgress',
	NOT_AVAILABLE: 'notAvailable',
});

export const usePkpOpenReviewStore = defineStore('pkpOpenReview', () => {
	// State
	const reviewRounds = ref([]);
	const submissionSummary = ref(null);
	const initialized = ref(false);
	const expandedContentIds = ref([]); // Unified state for author response and review IDs
	const headingLevel = ref(3);
	const summaryHeadingLevel = ref(2);

	const reviewState = computed(() => {
		const status = submissionSummary.value?.reviewStatus;
		if (!status) return ReviewState.NOT_AVAILABLE;
		if (status.dateCompleted) return ReviewState.COMPLETED;
		if (status.dateInProgress) return ReviewState.IN_PROGRESS;
		return ReviewState.NOT_AVAILABLE;
	});

	const hasRecommendations = computed(
		() => submissionSummary.value?.reviewerRecommendations?.length > 0,
	);

	// Review rounds ordered newest-first for the "By Record" view.
	// `reviewRounds` itself stays chronological so roundNumber, findReviewById
	// and the deep-link logic are unaffected.
	const reviewRoundsDisplay = computed(() => [...reviewRounds.value].reverse());

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
		summaryHeadingLevel: summaryLevel,
	}) {
		// The store is shared between PkpOpenReviewSummary (article tab) and
		// PkpOpenReview (peer-review-record tab), both of which call initialize()
		// during setup. Only run the setup once so the URL-selected expansion
		// state isn't clobbered by the second call.
		if (initialized.value) {
			return;
		}
		initialized.value = true;

		if (level != null) {
			headingLevel.value = level;
		}
		if (summaryLevel != null) {
			summaryHeadingLevel.value = summaryLevel;
		}
		// Store submission-level summary, filtering out recommendations with null type
		submissionSummary.value = {
			...submissionPeerReviewSummary,
			reviewerRecommendations: (
				submissionPeerReviewSummary?.reviewerRecommendations ?? []
			).filter((rec) => !!rec.recommendationTypeId && rec.count > 0),
		};

		// Flatten review rounds from all publications, enriching reviews with
		// recommendation type CSS class and round info. Each round receives a
		// global sequential roundNumber (1 = oldest) across all versions' rounds.
		let roundNumber = 0;
		const allReviewRounds = (publicationsPeerReviews || []).flatMap((pub) =>
			(pub.reviewRounds || []).map((round) => {
				roundNumber += 1;
				// Round info copied onto each review for the "By Reviewer" view
				// (avoids a circular reference back to the round).
				const roundInfo = {
					roundId: round.roundId,
					displayText: round.displayText,
					versionString: round.versionString,
					date: round.date,
					roundNumber,
				};
				return {
					...round,
					roundNumber,
					reviews: (round.reviews || []).map((review) => {
						// Add recommendation key and icon based on reviewerRecommendationTypeId
						const typeInfo = review.reviewerRecommendationTypeId
							? recommendationTypeMap[review.reviewerRecommendationTypeId]
							: null;
						return {
							...review,
							reviewerRecommendationTypeKey: typeInfo?.key || null,
							reviewerRecommendationTypeIcon: typeInfo?.iconName || null,
							round: roundInfo,
						};
					}),
				};
			}),
		);

		reviewRounds.value = allReviewRounds;

		// Check URL for reviewId parameter
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const reviewId = urlParams.get('reviewId');
			if (reviewId) {
				const result = findReviewById(reviewId);
				if (result) {
					// Expand the review and switch to the peer-review-record tab
					setExpandedContent([String(result.review.id)]);
					viewFullRecord();
				}
			}
		}
	}

	/**
	 * Get reviews grouped by reviewer for the "by reviewer" view
	 */
	const reviewerGroups = computed(() => {
		const reviewerMap = new Map();

		// Iterate newest round first so each reviewer's reviews are latest-first
		for (const round of reviewRoundsDisplay.value) {
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
	 * Scroll a review element into view
	 * @param {number|string} reviewId - The review ID to scroll to
	 */
	function scrollToReview(reviewId) {
		const element = document.querySelector(`[data-review-id="${reviewId}"]`);
		if (element) {
			element.scrollIntoView({behavior: 'smooth', block: 'start'});
		}
	}

	/**
	 * Set the expanded accordion content (reviews + author response).
	 * Single mutation path for expandedContentIds, used both as the
	 * accordion's v-model handler and for programmatic expansion.
	 * @param {Array<string>} ids - The full list of open content IDs
	 */
	function setExpandedContent(ids) {
		expandedContentIds.value = ids;
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
		summaryHeadingLevel,
		submissionSummary,
		reviewState,
		hasRecommendations,
		reviewRounds,
		reviewRoundsDisplay,
		reviewerGroups,
		expandedContentIds,

		// Actions
		initialize,
		getRecommendationTypeInfo,
		setExpandedContent,
		viewFullRecord,
		scrollToReviewFromUrl,
	};
});
