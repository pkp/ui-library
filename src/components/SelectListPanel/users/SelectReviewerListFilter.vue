<template>
	<div class="pkpListPanel__filter pkpListPanel__filter--selectReviewer" :class="{'-isVisible': isVisible}" :aria-hidden="!isVisible">
		<div class="pkpListPanel__filterHeader pkpListPanel__filterHeader--selectReviewer" tabindex="0">
			<icon icon="filter" :inline="true" />
			{{ i18n.filter }}
		</div>
		<div class="pkpListPanel__filterOptions pkpListPanel__filterOptions--submissions">
			<select-reviewer-list-filter-slider
				filterId="reviewerRating"
				:filterValue="filterByRating"
				:isFilterActive="isFilterActive('reviewerRating')"
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
				filterId="reviewsCompleted"
				:filterValue="filterByCompleted"
				:isFilterActive="isFilterActive('reviewsCompleted')"
				:label="i18n.completedReviews"
				:min="0"
				:max="20"
				:formatter="__('moreThan', {'value': '{value}'})"
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
				filterId="reviewsActive"
				:filterValue="filterByActive"
				:isFilterActive="isFilterActive('reviewsActive')"
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
				:formatter="__('lessThan', {'value': '{value}'})"
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
		SelectReviewerListFilterSlider
	},
	props: {
		isVisible: Boolean,
		activeFilters: Object,
		filterByRating: {
			type: Number,
			default: 3
		},
		filterByCompleted: {
			type: Number,
			default: 10
		},
		filterByDaysSinceLastAssignment: {
			type: Array,
			default: function() {
				return [0, 365];
			}
		},
		filterByActive: {
			type: Array,
			default: function() {
				return [0, 20];
			}
		},
		filterByAverageCompletion: {
			type: Number,
			default: 75
		},
		i18n: Object
	},
	methods: {
		/**
		 * Check if a filter is currently active
		 *
		 * Overrides ListPanelFilter::isFilterActive so that no values are required.
		 *
		 * @return boolean
		 */
		isFilterActive: function(type) {
			return this.activeFilters[type] !== undefined;
		},

		/**
		 * Add a filter
		 *
		 * Overrides ListPanelFilter::filterBy so that vals are not stored as
		 * arrays.
		 */
		filterBy: function(type, val) {
			if (Array.isArray(val)) {
				val = val.join('-');
			}
			let filters = Object.assign({}, this.activeFilters);
			filters[type] = val;
			this.filterList(filters);
		},

		/**
		 * Remove a filter
		 *
		 * Overrides ListPanelFilter::clearFilter so that no values are required.
		 */
		clearFilter: function(type) {
			const filters = Object.assign({}, this.activeFilters);
			if (filters[type]) {
				delete filters[type];
			}
			this.filterList(filters);
		}
	}
};
</script>
