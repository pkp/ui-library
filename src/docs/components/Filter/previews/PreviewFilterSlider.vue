<template>
	<div class="previewFilters">
		<pkp-filter-slider
			:is-filter-active="isFilterActive('activeReviews')"
			param="activeReviews"
			title="Active Reviews"
			:is-visible="true"
			:value="2"
			:max="25"
			:min="0"
			formatter="{value} or more"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<pkp-filter-slider
			:is-filter-active="isFilterActive('completedReviews')"
			param="completedReviews"
			title="Completed Reviews"
			:is-visible="true"
			:value="2"
			:max="100"
			:min="0"
			formatter="{value} or more"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<pkp-filter-slider
			:is-filter-active="isFilterActive('daysSinceLastReview')"
			param="daysSinceLastReview"
			title="Days since last review"
			:is-visible="true"
			:value="daysSinceLastReview"
			:max="365"
			:min="1"
			formatter="{value} or more"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<pkp-filter-slider
			:is-filter-active="isFilterActive('rating')"
			param="rating"
			title="Reviewer Rating"
			:is-visible="true"
			:value="3"
			:max="5"
			:min="1"
			:use-stars="true"
			star-label="Reviewer rating: {$rating}"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
	</div>
</template>

<script>
import PkpFilterSlider from '@/components/Filter/FilterSlider.vue';

export default {
	components: {
		PkpFilterSlider,
	},
	data() {
		return {
			activeFilters: {},
			daysSinceLastReview: 30,
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
