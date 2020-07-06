<template>
	<div class="previewFilters">
		<filter-autosuggest
			:autosuggestProps="users"
			component="field-select-users"
			param="stageIds"
			:value="[]"
			title="Assigned to Editors"
			@add-filter="addFilter"
			@remove-filter="removeFilter"
		/>
		<filter-autosuggest
			:autosuggestProps="issues"
			component="field-select-issues"
			param="stageIds"
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
				name: 'userIds',
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
			assignedTo: {
				stageIds: []
			},
			assignedIssues: {
				stageIds: []
			}
		};
	},
	methods: {
		addFilter(fieldName, param, val) {
			if (fieldName === 'userIds') {
				if (!this.assignedTo[param].includes(val)) {
					this.assignedTo[param].push(val);
				}
			} else {
				if (!this.assignedIssues[param].includes(val)) {
					this.assignedIssues[param].push(val);
				}
			}
		},
		removeFilter(fieldName, param, val) {
			if (fieldName === 'userIds') {
				if (this.assignedTo[param].includes(val)) {
					this.assignedTo[param] = this.assignedTo[param].filter(
						item => item !== val
					);
				}
			} else {
				if (this.assignedIssues[param].includes(val)) {
					this.assignedIssues[param] = this.assignedIssues[param].filter(
						item => item !== val
					);
				}
			}
		}
	}
};
</script>
