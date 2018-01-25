<template>
	<div class="pkpListPanel__filter pkpListPanel__filter--selectReviewer" :class="{'-isVisible': isVisible}" :aria-hidden="!isVisible">
		<div class="pkpListPanel__filterHeader pkpListPanel__filterHeader--selectReviewer" tabindex="0">
			<icon icon="filter" :inline="true" />
			{{ i18n.filter }}
		</div>
		<div class="pkpListPanel__filterOptions pkpListPanel__filterOptions--submissions">
			<select-reviewer-list-filter-slider
				filterId="rating"
				:filterValue="filterByRating"
				:isFilterActive="isFilterActive('rating')"
				:label="i18n.filterRating"
				:min="1"
				:max="5"
				:isVisible="isVisible"
				:useStars="true"
				starLabel="reviewerRating"
				:i18n="i18n"
				@filterBy="filterBy"
				@clearFilter="clearFilter"
			/>
			<select-reviewer-list-filter-slider
				filterId="completed"
				:filterValue="filterByCompleted"
				:isFilterActive="isFilterActive('completed')"
				:label="i18n.completedReviews"
				:min="0"
				:max="50"
				:isVisible="isVisible"
				:i18n="i18n"
				@filterBy="filterBy"
				@clearFilter="clearFilter"
			/>
			<select-reviewer-list-filter-slider
				filterId="daysSinceLastAssignment"
				:filterValue="filterByDaysSinceLastAssignment"
				:isFilterActive="isFilterActive('daysSinceLastAssignment')"
				:label="i18n.daysSinceLastAssignmentDescription"
				:min="0"
				:max="365"
				:isVisible="isVisible"
				:i18n="i18n"
				@filterBy="filterBy"
				@clearFilter="clearFilter"
			/>
			<select-reviewer-list-filter-slider
				filterId="active"
				:filterValue="filterByActive"
				:isFilterActive="isFilterActive('active')"
				:label="i18n.activeReviewsDescription"
				:min="0"
				:max="20"
				:isVisible="isVisible"
				:i18n="i18n"
				@filterBy="filterBy"
				@clearFilter="clearFilter"
			/>
			<select-reviewer-list-filter-slider
				filterId="averageCompletion"
				:filterValue="filterByAverageCompletion"
				:isFilterActive="isFilterActive('averageCompletion')"
				:label="i18n.averageCompletion"
				:min="0"
				:max="150"
				:isVisible="isVisible"
				:i18n="i18n"
				@filterBy="filterBy"
				@clearFilter="clearFilter"
			/>
		</div>
	</div>
</template>

<script>
import ListPanelFilter from '@/components/ListPanel/ListPanelFilter.vue';
import SelectReviewerListFilterSlider from '@/components/SelectListPanel/users/SelectReviewerListFilterSlider.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	extends: ListPanelFilter,
	name: 'SelectReviewerListFilter',
	components: {
		Icon,
		SelectReviewerListFilterSlider,
	},
	props: {
		isVisible: Boolean,
		activeFilters: Object,
		filterByRating: {
			type: Number,
			default: 3,
		},
		filterByCompleted: {
			type: Array,
			default: function () {
				return [0, 50];
			},
		},
		filterByDaysSinceLastAssignment: {
			type: Array,
			default: function () {
				return [0, 365];
			},
		},
		filterByActive: {
			type: Array,
			default: function () {
				return [0, 20];
			},
		},
		filterByAverageCompletion: {
			type: Array,
			default: function () {
				return [0, 150];
			},
		},
		i18n: Object,
	},
	methods: {
		/**
		 * Check if a filter is currently active
		 *
		 * Overrides ListPanelFilter::isFilterActive so that no values are required.
		 *
		 * @return boolean
		 */
		isFilterActive: function (type) {
			return this.activeFilters[type] !== undefined;
		},

		/**
		 * Add a filter
		 *
		 * Overrides ListPanelFilter::filterBy so that vals are not stored as
		 * arrays.
		 */
		filterBy: function (type, val) {
			let filters = Object.assign({}, this.activeFilters);
			filters[type] = val;
			this.filterList(filters);
		},

		/**
		 * Remove a filter
		 *
		 * Overrides ListPanelFilter::clearFilter so that no values are required.
		 */
		clearFilter: function (type) {
			const filters = Object.assign({}, this.activeFilters);
			if (filters[type]) {
				delete filters[type];
			}
			this.filterList(filters);
		},
	},
};
</script>
