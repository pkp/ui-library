<template>
	<div>
		<slot>
			<ListPanel
				v-if="suggestions.length > 0"
				class="listPanel--selectReviewer reviewer-sugestions-list"
				:items="suggestions"
			>
				<template #header>
					<PkpHeader>
						<h2>
							{{ suggestionTitle ?? title }}
						</h2>
						<Spinner v-if="isLoading" />
					</PkpHeader>
				</template>

				<template v-if="isLoading" #itemsEmpty>
					<template v-if="isLoading">
						<Spinner />
						{{ t('common.loading') }}
					</template>
					<template v-else>
						{{ emptyLabel }}
					</template>
				</template>

				<template #item="{item}">
					<SelectReviewerSuggestionListItem
						v-if="!item.approvedAt"
						:key="item.id"
						:item="item"
						:submission-id="getParams.submissionId"
						:stage-id="getParams.reviewStage"
						:review-round-id="getParams.reviewRoundId"
						:select-reviewer-label="selectReviewerLabel"
						:currently-assigned="
							currentlyAssigned.includes(item.existingUserId)
						"
						:currently-assigned-label="currentlyAssignedLabel"
						@update:suggestions="updateReviewerSuggestionList"
					/>
				</template>
			</ListPanel>

			<ListPanel
				class="listPanel--selectReviewer"
				:is-sidebar-visible="isSidebarVisible"
				:items="currentReviewers"
			>
				<template #header>
					<PkpHeader>
						<h2>
							{{ title }}
						</h2>
						<Spinner v-if="isLoading" />
						<template #actions>
							<Search
								:search-phrase="searchPhrase"
								@search-phrase-changed="setSearchPhrase"
							/>
							<PkpButton
								:is-active="isSidebarVisible"
								@click="isSidebarVisible = !isSidebarVisible"
							>
								<Icon icon="Filter" class="h-4 w-4" :inline="true" />
								{{ t('common.filter') }}
							</PkpButton>
						</template>
					</PkpHeader>
				</template>
				<template #sidebar>
					<PkpHeader :is-one-line="false">
						<h2 class="flex items-center">
							<Icon icon="Filter" class="me-1 h-4 w-4" :inline="true" />
							{{ t('common.filter') }}
						</h2>
					</PkpHeader>
					<component
						:is="filter.filterType || 'filter-slider'"
						v-for="filter in filters"
						:key="filter.param"
						v-bind="filter"
						:is-filter-active="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@update-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</template>

				<template v-if="isLoading" #itemsEmpty>
					<template v-if="isLoading">
						<Spinner />
						{{ t('common.loading') }}
					</template>
					<template v-else>
						{{ emptyLabel }}
					</template>
				</template>

				<template #item="{item}">
					<SelectReviewerListItem
						:key="item.id"
						:active-reviews-count-label="activeReviewsCountLabel"
						:active-reviews-label="activeReviewsLabel"
						:assigned-to-last-round="lastRoundReviewerIds.includes(item.id)"
						:assigned-to-last-round-label="assignedToLastRoundLabel"
						:author-affiliations="authorAffiliations"
						:average-completion-label="averageCompletionLabel"
						:biography-label="biographyLabel"
						:cancelled-reviews-label="cancelledReviewsLabel"
						:completed-reviews-label="completedReviewsLabel"
						:currently-assigned="currentlyAssigned.includes(item.id)"
						:currently-assigned-label="currentlyAssignedLabel"
						:day-since-last-assignment-label="daySinceLastAssignmentLabel"
						:days-since-last-assignment-label="daysSinceLastAssignmentLabel"
						:days-since-last-assignment-description-label="
							daysSinceLastAssignmentDescriptionLabel
						"
						:declined-reviews-label="declinedReviewsLabel"
						:gossip-label="gossipLabel"
						:item="item"
						:never-assigned-label="neverAssignedLabel"
						:reassign-label="reassignLabel"
						:reassign-with-name-label="reassignWithNameLabel"
						:reviewer-same-institution-label="reviewerSameInstitutionLabel"
						:reviewer-rating-label="reviewerRatingLabel"
						:review-interests-label="reviewInterestsLabel"
						:select-reviewer-label="selectReviewerLabel"
						:selector-name="selectorName"
						:warn-on-assignment="warnOnAssignment.includes(item.id)"
						:warn-on-assignment-label="warnOnAssignmentLabel"
						:warn-on-assignment-unlock-label="warnOnAssignmentUnlockLabel"
					/>
				</template>

				<template #footer>
					<Pagination
						v-if="lastPage > 1"
						:current-page="currentPage"
						:is-loading="isLoading"
						:last-page="lastPage"
						@set-page="setPage"
					/>
				</template>
			</ListPanel>
		</slot>
	</div>
</template>

<script>
import Spinner from '@/components/Spinner/Spinner.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';

import FilterSlider from '@/components/Filter/FilterSlider.vue';
import FilterSliderMultirange from '@/components/Filter/FilterSliderMultirange.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Search from '@/components/Search/Search.vue';
import SelectReviewerListItem from '@/components/ListPanel/users/SelectReviewerListItem.vue';
import SelectReviewerSuggestionListItem from '@/components/ListPanel/users/SelectReviewerSuggestionListItem.vue';
import fetch from '@/mixins/fetch';

export default {
	components: {
		FilterSlider,
		FilterSliderMultirange,
		ListPanel,
		Pagination,
		PkpHeader,
		Search,
		SelectReviewerListItem,
		SelectReviewerSuggestionListItem,
		Icon,
		Spinner,
		PkpButton,
	},
	mixins: [fetch],
	props: {
		/** A localized string for the [Badge](../?path=/docs/basic-components-badge--docs) showing the number of active reviews. */
		activeReviewsCountLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the active reviews row in the expanded table. */
		activeReviewsLabel: {
			type: String,
			required: true,
		},
		/** A localized string that says this reviewer was assigned in the last review round. See `lastRoundReviewers` */
		assignedToLastRoundLabel: {
			type: String,
			required: true,
		},
		authorAffiliations: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A localized string for the average days to complete a review row in the expanded table. */
		averageCompletionLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the biography section. */
		biographyLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the canceled reviews row in the expanded table. */
		cancelledReviewsLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the completed reviews row in the expanded table. */
		completedReviewsLabel: {
			type: String,
			required: true,
		},
		/** An array of user ids of reviewers who are already assigned to this review round. */
		currentlyAssigned: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A localized string that says this reviewer is already assigned to this review round. */
		currentlyAssignedLabel: {
			type: String,
			required: true,
		},
		/** A localized string to use when it has only been one day since the reviewer's last assignment. */
		daySinceLastAssignmentLabel: {
			type: String,
			required: true,
		},
		/** A localized string to use when it has been 2 or more days since the reviewer's last assignment. Example: `{$number} days ago` */
		daysSinceLastAssignmentLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the days since last assignment row in the expanded table */
		daysSinceLastAssignmentDescriptionLabel: {
			type: String,
			required: true,
		},
		/** A localized string for the declined reviews row in the expanded table. */
		declinedReviewsLabel: {
			type: String,
			required: true,
		},
		/** A localized string to display when there are no reviewers to show in the list. */
		emptyLabel: {
			type: String,
			required: true,
		},
		/** An array [Filter](../?path=/docs/components-filter-base--docs)s. */
		filters: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A localized string for the gossip section. */
		gossipLabel: {
			type: String,
			required: true,
		},
		/** A unique id for this component. */
		id: {
			type: String,
			required: true,
		},
		/** An array of reviewers. */
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		/**  A count of all reviewers in the journal, press or preprint server. */
		itemsMax: {
			type: Number,
			default() {
				return 0;
			},
		},
		/**  An array of reviewers that were assigned in the last review round. */
		lastRoundReviewers: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A localized string to use when the reviewer has never been given a review assignment. */
		neverAssignedLabel: {
			type: String,
			required: true,
		},
		/** A localized string to use for the button to reassign a reviewer who was assigned to the last review round. */
		reassignLabel: {
			type: String,
			required: true,
		},
		/** A localized string to use in an accessible label for the button to reassign a reviewer who was assigned to the last review round. Example: `Reassign {$name}` */
		reassignWithNameLabel: {
			type: String,
			required: true,
		},
		/**  A localized string to use in an accessible label for the reviewer rating.  */
		reviewerRatingLabel: {
			type: String,
			required: true,
		},
		reviewerSameInstitutionLabel: {
			type: String,
			required: true,
		},
		/** A localized string to use for the reviewer interests section. */
		reviewInterestsLabel: {
			type: String,
			required: true,
		},
		selectorName: {
			type: String,
			required: true,
		},
		/** A localized string to use for the button to select a reviewer. */
		selectReviewerLabel: {
			type: String,
			required: true,
		},
		/** The title of the list panel. */
		title: {
			type: String,
			required: true,
		},
		/** An array of user ids for reviewers that may not be able to conduct an anonymous review, because they have access to the submission details through another stage assignment. */
		warnOnAssignment: {
			type: Array,
			default() {
				return [];
			},
		},
		/** A localized string that describes why this user may be unable to conduct an anonymous review. */
		warnOnAssignmentLabel: {
			type: String,
			required: true,
		},
		/**  A localized string for the button to unlock a reviewer who may be unable to conduct an anonymous review. */
		warnOnAssignmentUnlockLabel: {
			type: String,
			required: true,
		},
		/** The list panel title of reviewer suggestion list */
		suggestionTitle: {
			type: String,
			required: false,
			default: null,
		},
		/** An array of reviewer suggestion if there are any */
		suggestions: {
			type: Array,
			default() {
				return [];
			},
		},
		/** The API Url to obtain reviewer suggestion for this submission */
		reviewerSuggestionsApiUrl: {
			type: String,
			required: false,
			default: null,
		},
	},
	emits: [
		/**  Emitted when a prop should be changed. Payload: `(id, newProps)`  */
		'set',
	],
	data() {
		return {
			isLoading: false,
			isSidebarVisible: false,
		};
	},
	computed: {
		/**
		 * The current reviewers merged with any preset reviewers
		 */
		currentReviewers() {
			if (Object.keys(this.activeFilters).length) {
				return this.items;
			}
			return [
				...this.lastRoundReviewers,
				...this.items.filter(
					(reviewer) => !this.lastRoundReviewerIds.includes(reviewer.id),
				),
			];
		},

		/**
		 * The user IDs of reviewers from the last round
		 */
		lastRoundReviewerIds() {
			return this.lastRoundReviewers.map((reviewer) => reviewer.id);
		},
	},
	watch: {
		/**
		 * Update list whenever a filter is applied
		 */
		activeFilters(newVal, oldVal) {
			this.offset = 0;
			if (newVal && Object.keys(newVal).length) {
				this.isSidebarVisible = true;
			}
		},
	},
	methods: {
		/**
		 * Add a filter to the activeFilters object
		 *
		 * @param {String} param The query param
		 * @param {Number|Array} value The value of the filter
		 */
		addFilter(param, value) {
			let newFilters = {...this.activeFilters};
			newFilters[param] = value;
			this.activeFilters = newFilters;
		},

		/**
		 * Is this filter currently active?
		 *
		 * @param {String} param The query param
		 * @param {Number|Array} value The value of the filter
		 * @return {Boolean}
		 */
		isFilterActive(param, value) {
			return Object.prototype.hasOwnProperty.call(this.activeFilters, param);
		},

		/**
		 * Remove a filter from the activeFilters object
		 *
		 * @param {String} param The query param
		 * @param {Number|Array} value The value of the filter
		 */
		removeFilter(param, value) {
			if (Object.prototype.hasOwnProperty.call(this.activeFilters, param)) {
				let newFilters = {...this.activeFilters};
				delete newFilters[param];
				this.activeFilters = newFilters;
			}
		},

		/**
		 * Update the list of items
		 *
		 * @param {Array} items
		 * @param {Number} itemsMax
		 */
		setItems(items, itemsMax) {
			this.$emit('set', this.id, {
				items,
				itemsMax,
			});
		},

		/**
		 * Update the list of reviewer suggestions list
		 *
		 * @param {Number} reviewerSuggestionId
		 */
		updateReviewerSuggestionList(reviewerSuggestionId) {
			this.isLoading = true;
			$.ajax({
				url: this.reviewerSuggestionsApiUrl + '/' + reviewerSuggestionId,
				type: 'GET',
				context: this,
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				data: {
					include_reviewer_data: true,
				},
				error: this.ajaxErrorCallback,
				success(r) {
					if (r.approvedAt) {
						this.suggestions.forEach((reviewerSuggestion) => {
							if (reviewerSuggestion.id == reviewerSuggestionId) {
								reviewerSuggestion.approvedAt = r.approvedAt;
							}
						});

						if (r.reviewer) {
							let reviewers = this.items.map((i) => i);
							reviewers.push(r.reviewer);
							this.setItems(reviewers, this.itemsMax + 1);
							this.currentlyAssigned.push(r.reviewer.id);
						}
					}
				},
				complete(r) {
					this.isLoading = false;
				},
			});
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.reviewer-sugestions-list {
	margin-bottom: 4rem;
}
</style>
