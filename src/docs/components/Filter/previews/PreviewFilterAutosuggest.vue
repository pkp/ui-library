<template>
	<div class="previewFilters">
		This is a
		<filter-autosuggest
			:autosuggestProps="autosuggestProps"
			param="stageIds"
			:value="[]"
			title="Select Users"
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
			assignedTo: {
				stageIds: []
			}
		};
	},
	methods: {
		addFilter(param, val) {
			if (!this.assignedTo[param].includes(val)) {
				this.assignedTo[param].push(val);
			}
		},
		removeFilter(param, val) {
			if (this.assignedTo[param].includes(val)) {
				this.assignedTo[param] = this.assignedTo[param].filter(
					item => item !== val
				);
			}
		}
	}
};
</script>
