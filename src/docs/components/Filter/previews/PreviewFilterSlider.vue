<template>
	<div class="previewFilters">
		<pkp-filter-slider
			:isFilterActive="isFilterActive('activeReviews')"
			param="activeReviews"
			title="Active Reviews"
			:isVisible="true"
			:value="2"
			:max="25"
			:min="0"
			formatter="{value} or more"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<pkp-filter-slider
			:isFilterActive="isFilterActive('completedReviews')"
			param="completedReviews"
			title="Completed Reviews"
			:isVisible="true"
			:value="2"
			:max="100"
			:min="0"
			formatter="{value} or more"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<pkp-filter-slider
			:isFilterActive="isFilterActive('daysSinceLastReview')"
			param="daysSinceLastReview"
			title="Days since last review"
			:isVisible="true"
			:value="daysSinceLastReview"
			:max="365"
			:min="1"
			formatter="{value} or more"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<pkp-filter-slider
			:isFilterActive="isFilterActive('rating')"
			param="rating"
			title="Reviewer Rating"
			:isVisible="true"
			:value="3"
			:max="5"
			:min="1"
			:useStars="true"
			starLabel="Reviewer rating: {$rating}"
			@add-filter="addFilter"
			@update-filter="addFilter"
			@remove-filter="removeFilter"
		/>
	</div>
</template>

<script>
import PkpFilterSlider from '@/components/Filter/FilterSlider.vue';
import {props} from '../config';

export default {
	components: {
		PkpFilterSlider
	},
	data() {
		return {
			activeFilters: {},
			daysSinceLastReview: [1, 365],
			i18n: {...props.i18n}
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
		}
	}
};
</script>
