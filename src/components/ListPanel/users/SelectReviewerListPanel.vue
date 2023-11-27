<template>
	<div>
		<slot>
			<list-panel
				class="listPanel--selectReviewer"
				:is-sidebar-visible="isSidebarVisible"
				:items="currentReviewers"
			>
				<template #header>
					<pkp-header>
						<h2>
							{{ title }}
						</h2>
						<spinner v-if="isLoading" />
						<template #actions>
							<search
								:search-phrase="searchPhrase"
								@search-phrase-changed="setSearchPhrase"
							/>
							<pkp-button
								:is-active="isSidebarVisible"
								@click="isSidebarVisible = !isSidebarVisible"
							>
								<icon icon="filter" :inline="true" />
								{{ t('common.filter') }}
							</pkp-button>
						</template>
					</pkp-header>
				</template>
				<template #sidebar>
					<pkp-header :is-one-line="false">
						<h2>
							<icon icon="filter" :inline="true" />
							{{ t('common.filter') }}
						</h2>
					</pkp-header>
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
						<spinner />
						{{ t('common.loading') }}
					</template>
					<template v-else>
						{{ emptyLabel }}
					</template>
				</template>

				<template #item="{item}">
					<select-reviewer-list-item
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
					<pagination
						v-if="lastPage > 1"
						:current-page="currentPage"
						:is-loading="isLoading"
						:last-page="lastPage"
						@set-page="setPage"
					/>
				</template>
			</list-panel>
		</slot>
	</div>
</template>

<script>
import FilterSlider from '@/components/Filter/FilterSlider.vue';
import FilterSliderMultirange from '@/components/Filter/FilterSliderMultirange.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PkpHeader from '@/components/Header/Header.vue';
import Search from '@/components/Search/Search.vue';
import SelectReviewerListItem from '@/components/ListPanel/users/SelectReviewerListItem.vue';
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
	},
	mixins: [fetch],
	props: {
		activeReviewsCountLabel: {
			type: String,
			required: true,
		},
		activeReviewsLabel: {
			type: String,
			required: true,
		},
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
		averageCompletionLabel: {
			type: String,
			required: true,
		},
		biographyLabel: {
			type: String,
			required: true,
		},
		cancelledReviewsLabel: {
			type: String,
			required: true,
		},
		completedReviewsLabel: {
			type: String,
			required: true,
		},
		currentlyAssigned: {
			type: Array,
			default() {
				return [];
			},
		},
		currentlyAssignedLabel: {
			type: String,
			required: true,
		},
		daySinceLastAssignmentLabel: {
			type: String,
			required: true,
		},
		daysSinceLastAssignmentLabel: {
			type: String,
			required: true,
		},
		daysSinceLastAssignmentDescriptionLabel: {
			type: String,
			required: true,
		},
		declinedReviewsLabel: {
			type: String,
			required: true,
		},
		emptyLabel: {
			type: String,
			required: true,
		},
		filters: {
			type: Array,
			default() {
				return [];
			},
		},
		gossipLabel: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		items: {
			type: Array,
			default() {
				return [];
			},
		},
		itemsMax: {
			type: Number,
			default() {
				return 0;
			},
		},
		lastRoundReviewers: {
			type: Array,
			default() {
				return [];
			},
		},
		neverAssignedLabel: {
			type: String,
			required: true,
		},
		reassignLabel: {
			type: String,
			required: true,
		},
		reassignWithNameLabel: {
			type: String,
			required: true,
		},
		reviewerRatingLabel: {
			type: String,
			required: true,
		},
		reviewerSameInstitutionLabel: {
			type: String,
			required: true,
		},
		reviewInterestsLabel: {
			type: String,
			required: true,
		},
		selectorName: {
			type: String,
			required: true,
		},
		selectReviewerLabel: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		warnOnAssignment: {
			type: Array,
			default() {
				return [];
			},
		},
		warnOnAssignmentLabel: {
			type: String,
			required: true,
		},
		warnOnAssignmentUnlockLabel: {
			type: String,
			required: true,
		},
	},
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
	},
};
</script>
