<template>
	<div>
		<slot>
			<list-panel
				class="listPanel--selectReviewer"
				:isSidebarVisible="isSidebarVisible"
				:items="currentReviewers"
			>
				<pkp-header slot="header">
					<h2>
						{{ title }}
					</h2>
					<spinner v-if="isLoading" />
					<template slot="actions">
						<search
							:searchPhrase="searchPhrase"
							@search-phrase-changed="setSearchPhrase"
						/>
						<pkp-button
							:isActive="isSidebarVisible"
							@click="isSidebarVisible = !isSidebarVisible"
						>
							<icon icon="filter" :inline="true" />
							{{ __('common.filter') }}
						</pkp-button>
					</template>
				</pkp-header>

				<template slot="sidebar">
					<pkp-header :isOneLine="false">
						<h2>
							<icon icon="filter" :inline="true" />
							{{ __('common.filter') }}
						</h2>
					</pkp-header>
					<component
						v-for="filter in filters"
						:key="filter.param"
						:is="filter.filterType || 'filter-slider'"
						v-bind="filter"
						:isFilterActive="isFilterActive(filter.param, filter.value)"
						@add-filter="addFilter"
						@update-filter="addFilter"
						@remove-filter="removeFilter"
					/>
				</template>

				<template v-if="isLoading" slot="itemsEmpty">
					<template v-if="isLoading">
						<spinner />
						{{ __('common.loading') }}
					</template>
					<template v-else>
						{{ emptyLabel }}
					</template>
				</template>

				<template v-slot:item="{item}">
					<select-reviewer-list-item
						:activeReviewsCountLabel="activeReviewsCountLabel"
						:activeReviewsLabel="activeReviewsLabel"
						:assignedToLastRound="lastRoundReviewerIds.includes(item.id)"
						:assignedToLastRoundLabel="assignedToLastRoundLabel"
						:averageCompletionLabel="averageCompletionLabel"
						:biographyLabel="biographyLabel"
						:cancelledReviewsLabel="cancelledReviewsLabel"
						:completedReviewsLabel="completedReviewsLabel"
						:currentlyAssigned="currentlyAssigned.includes(item.id)"
						:currentlyAssignedLabel="currentlyAssignedLabel"
						:daySinceLastAssignmentLabel="daySinceLastAssignmentLabel"
						:daysSinceLastAssignmentLabel="daysSinceLastAssignmentLabel"
						:daysSinceLastAssignmentDescriptionLabel="
							daysSinceLastAssignmentDescriptionLabel
						"
						:declinedReviewsLabel="declinedReviewsLabel"
						:gossipLabel="gossipLabel"
						:key="item.id"
						:item="item"
						:neverAssignedLabel="neverAssignedLabel"
						:reassignLabel="reassignLabel"
						:reassignWithNameLabel="reassignWithNameLabel"
						:reviewerRatingLabel="reviewerRatingLabel"
						:reviewInterestsLabel="reviewInterestsLabel"
						:selectReviewerLabel="selectReviewerLabel"
						:selectorName="selectorName"
						:warnOnAssignment="warnOnAssignment.includes(item.id)"
						:warnOnAssignmentLabel="warnOnAssignmentLabel"
						:warnOnAssignmentUnlockLabel="warnOnAssignmentUnlockLabel"
					/>
				</template>

				<template slot="footer">
					<pagination
						v-if="lastPage > 1"
						:currentPage="currentPage"
						:isLoading="isLoading"
						:lastPage="lastPage"
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
		SelectReviewerListItem
	},
	mixins: [fetch],
	props: {
		activeReviewsCountLabel: {
			type: String,
			required: true
		},
		activeReviewsLabel: {
			type: String,
			required: true
		},
		assignedToLastRoundLabel: {
			type: String,
			required: true
		},
		averageCompletionLabel: {
			type: String,
			required: true
		},
		biographyLabel: {
			type: String,
			required: true
		},
		cancelledReviewsLabel: {
			type: String,
			required: true
		},
		completedReviewsLabel: {
			type: String,
			required: true
		},
		currentlyAssigned: {
			type: Array,
			default() {
				return [];
			}
		},
		currentlyAssignedLabel: {
			type: String,
			required: true
		},
		daySinceLastAssignmentLabel: {
			type: String,
			required: true
		},
		daysSinceLastAssignmentLabel: {
			type: String,
			required: true
		},
		daysSinceLastAssignmentDescriptionLabel: {
			type: String,
			required: true
		},
		declinedReviewsLabel: {
			type: String,
			required: true
		},
		emptyLabel: {
			type: String,
			required: true
		},
		filters: {
			type: Array,
			default() {
				return [];
			}
		},
		gossipLabel: {
			type: String,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		items: {
			type: Array,
			default() {
				return [];
			}
		},
		itemsMax: {
			type: Number,
			default() {
				return 0;
			}
		},
		lastRoundReviewers: {
			type: Array,
			default() {
				return [];
			}
		},
		neverAssignedLabel: {
			type: String,
			required: true
		},
		reassignLabel: {
			type: String,
			required: true
		},
		reassignWithNameLabel: {
			type: String,
			required: true
		},
		reviewerRatingLabel: {
			type: String,
			required: true
		},
		reviewInterestsLabel: {
			type: String,
			required: true
		},
		selectorName: {
			type: String,
			required: true
		},
		selectReviewerLabel: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		warnOnAssignment: {
			type: Array,
			default() {
				return [];
			}
		},
		warnOnAssignmentLabel: {
			type: String,
			required: true
		},
		warnOnAssignmentUnlockLabel: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isLoading: false,
			isSidebarVisible: false
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
					reviewer => !this.lastRoundReviewerIds.includes(reviewer.id)
				)
			];
		},

		/**
		 * The user IDs of reviewers from the last round
		 */
		lastRoundReviewerIds() {
			return this.lastRoundReviewers.map(reviewer => reviewer.id);
		}
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
			return this.activeFilters.hasOwnProperty(param);
		},

		/**
		 * Remove a filter from the activeFilters object
		 *
		 * @param {String} param The query param
		 * @param {Number|Array} value The value of the filter
		 */
		removeFilter(param, value) {
			if (this.activeFilters.hasOwnProperty(param)) {
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
				itemsMax
			});
		}
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
		}
	}
};
</script>
