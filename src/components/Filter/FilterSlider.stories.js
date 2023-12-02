import {ref} from 'vue';
import FilterSlider from './FilterSlider.vue';

export default {
	title: 'Components/Filter/Slider',
	component: FilterSlider,
};

export const Slider = {
	render: (args) => ({
		components: {FilterSlider},
		setup() {
			const activeFilters = ref({});
			const daysSinceLastReview = ref(30);

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

			return {daysSinceLastReview, isFilterActive, addFilter, removeFilter};
		},
		template: `
			<FilterSlider
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
			<FilterSlider
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
			<FilterSlider
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
			<FilterSlider
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
		`,
	}),

	args: {},
};
