import {ref} from 'vue';
import FilterSliderMultirange from './FilterSliderMultirange.vue';

export default {
	title: 'Components/Filter/SliderMultirange',
	component: FilterSliderMultirange,
};

export const SliderMultirange = {
	render: (args) => ({
		components: {FilterSliderMultirange},
		setup() {
			const activeFilters = ref({});
			const daysSinceLastReview = ref([30, 120]);
			const activeReviewsCurrentlyAssigned = ref([1, 20]);

			function isFilterActive(param) {
				return Object.keys(activeFilters.value).includes(param);
			}
			function addFilter(param, val) {
				let updatedActiveFilters = {...activeFilters.value};
				updatedActiveFilters[param] = val;
				activeFilters.value = updatedActiveFilters;
			}
			function removeFilter(param) {
				let updatedActiveFilters = {...activeFilters.value};
				delete updatedActiveFilters[param];
				activeFilters.value = updatedActiveFilters;
			}

			return {
				daysSinceLastReview,
				activeReviewsCurrentlyAssigned,
				isFilterActive,
				addFilter,
				removeFilter,
			};
		},
		template: `
			<FilterSliderMultirange
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
			<FilterSliderMultirange
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
		`,
	}),

	args: {},
};
