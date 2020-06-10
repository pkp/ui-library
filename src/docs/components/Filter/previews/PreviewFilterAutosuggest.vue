<template>
	<div class="previewFilters">
		<filter-autosuggest
			:autosuggestProps="autosuggestProps"
			param="assignedTo"
			:value="[]"
			title="Assigned To Editors"
			@add-filter="addFilter"
			@remove-filter="removeFilter"
		/>
	</div>
</template>

<script>
import FilterAutosuggest from '@/components/Filter/FilterAutosuggest.vue';
import fieldBase from '../../Form/helpers/field-base';
import fieldBaseAutosuggest from '../../Form/helpers/field-autosuggest-users';

export default {
	extends: fieldBaseAutosuggest,
	components: {
		FilterAutosuggest
	},
	data() {
		return {
			autosuggestProps: {
				...fieldBase,
				...fieldBaseAutosuggest,
				apiUrl: '/usernames.json',
				name: 'editorIds',
				label: 'Assigned To Editors',
				selectedLabel: 'Assigned'
			},
			activeFilters: {
				assignedTo: []
			}
		};
	},
	methods: {
		addFilter(param, newVal) {
			this.activeFilters[param] = newVal;
		},
		removeFilter(param, newVal) {
			this.activeFilters[param] = [];
		}
	}
};
</script>
