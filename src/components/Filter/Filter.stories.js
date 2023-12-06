import {ref} from 'vue';
import Filter from './Filter.vue';

export default {
	title: 'Components/Filter/Base',
	component: Filter,
};

export const Base = {
	render: (args) => ({
		components: {Filter},
		setup() {
			const activeFilters = ref({stageIds: []});

			function isFilterActive(param, val) {
				return activeFilters.value[param].includes(val);
			}

			function addFilter(param, val) {
				if (!activeFilters.value[param].includes(val)) {
					activeFilters.value[param].push(val);
				}
			}

			function removeFilter(param, val) {
				if (activeFilters.value[param].includes(val)) {
					activeFilters.value[param] = activeFilters.value[param].filter(
						(item) => item !== val,
					);
				}
			}

			return {isFilterActive, addFilter, removeFilter};
		},
		template: `
			<Filter
				:is-filter-active="isFilterActive('stageIds', 1)"
				param="stageIds"
				title="Submission"
				:value="1"
				@add-filter="addFilter"
				@remove-filter="removeFilter"
			/>
			<Filter
				:is-filter-active="isFilterActive('stageIds', 2)"
				param="stageIds"
				title="Review"
				:value="2"
				@add-filter="addFilter"
				@remove-filter="removeFilter"
			/>
			<Filter
				:is-filter-active="isFilterActive('stageIds', 3)"
				param="stageIds"
				title="Copyeding"
				:value="3"
				@add-filter="addFilter"
				@remove-filter="removeFilter"
			/>
			<Filter
				:is-filter-active="isFilterActive('stageIds', 4)"
				param="stageIds"
				title="Production"
				:value="4"
				@add-filter="addFilter"
				@remove-filter="removeFilter"
			/>
		`,
	}),

	args: {},
};
