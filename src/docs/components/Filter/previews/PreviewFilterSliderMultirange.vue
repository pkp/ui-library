<template>
	<div class="previewFilters">
		<filter-slider-multirange
			:is-filter-active="isFilterActive('daysSinceLastReview')"
			param="daysSinceLastReview"
			title="Days since last review"
			:value="daysSinceLastReview"
			:max="365"
			:min="1"
			value-label="{$min}-{$max}"
			more-than-label="More than"
			less-than-label="Less than"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<filter-slider-multirange
			:is-filter-active="isFilterActive('activeReviewsCurrentlyAssigned')"
			param="activeReviewsCurrentlyAssigned"
			title="Days since last review"
			:value="activeReviewsCurrentlyAssigned"
			:max="20"
			:min="1"
			value-label="{$min}-{$max}"
			more-than-label="More than"
			less-than-label="Less than"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
	</div>
</template>

<script>
import FilterSliderMultirange from '@/components/Filter/FilterSliderMultirange.vue';

export default {
	components: {
		FilterSliderMultirange,
	},
	data() {
		return {
			activeFilters: {},
			daysSinceLastReview: [30, 120],
			activeReviewsCurrentlyAssigned: [1, 20],
		};
	},
	methods: {
		isFilterActive(param) {
			return Object.keys(this.activeFilters).includes(param);
		},
		addFilter(param, val) {
			let activeFilters = {...this.activeFilters};
			activeFilters[param] = val;
			this.activeFilters = activeFilters;
		},
		removeFilter(param) {
			let activeFilters = {...this.activeFilters};
			delete activeFilters[param];
			this.activeFilters = activeFilters;
		},
	},
};
</script>
