<template>
	<div class="previewFilters">
		<filter-autosuggest
			:autosuggestProps="users"
			component="field-select-users"
			param="assignedTo"
			:value="[]"
			title="Assigned to Editors"
			@add-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<filter-autosuggest
			:autosuggestProps="issues"
			component="field-select-issues"
			param="issueIds"
			:value="[]"
			title="Assigned to Issues"
			@add-filter="addFilter"
			@remove-filter="removeFilter"
		/>
	</div>
</template>

<script>
import FilterAutosuggest from '@/components/Filter/FilterAutosuggest.vue';
import fieldBase from '../../Form/helpers/field-base';
import fieldBaseAutosuggest from '../../Form/helpers/field-autosuggest';

export default {
	components: {
		FilterAutosuggest
	},
	data() {
		return {
			users: {
				...fieldBase,
				...fieldBaseAutosuggest,
				name: 'assignedTo',
				label: 'Assigned to Editors',
				selectedLabel: 'Assigned',
				apiUrl: '/usernames.json'
			},
			issues: {
				...fieldBase,
				...fieldBaseAutosuggest,
				name: 'issueIds',
				label: 'Assigned to Issues',
				selectedLabel: 'Assigned',
				apiUrl: '/issues.json'
			},
			activeFilters: {
				assignedTo: [],
				issueIds: []
			}
		};
	},
	methods: {
		addFilter(param, newVal) {
			this.activeFilters[param] = newVal;
		},
		removeFilter(param) {
			this.activeFilters[param] = [];
		}
	}
};
</script>
