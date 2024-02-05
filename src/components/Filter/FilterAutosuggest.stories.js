import {ref} from 'vue';
import {http, HttpResponse} from 'msw';
import FilterAutosuggest from './FilterAutosuggest.vue';
import fieldBase from '@/components/Form/mocks/field-base';
import fieldBaseAutosuggest from '@/components/Form/mocks/field-autosuggest';
import UsernamesMock from '@/mocks/usernames.json';
import IssuesMock from '@/mocks/issues.json';

export default {
	title: 'Components/Filter/Autosuggest',
	component: FilterAutosuggest,
};

export const Autosuggest = {
	render: (args) => ({
		components: {FilterAutosuggest},
		setup() {
			const activeFilters = ref({
				assignedTo: [],
				issueIds: [],
			});

			const users = ref({
				...fieldBase,
				...fieldBaseAutosuggest,
				name: 'assignedTo',
				label: 'Assigned to Editors',
				selectedLabel: 'Assigned',
				apiUrl: 'https://mock/index.php/publicknowledge/api/v1/users',
			});

			const issues = ref({
				...fieldBase,
				...fieldBaseAutosuggest,
				name: 'issueIds',
				label: 'Assigned to Issues',
				selectedLabel: 'Assigned',
				apiUrl: 'https://mock/index.php/publicknowledge/api/v1/issues',
			});

			function addFilter(param, val) {
				activeFilters.value[param] = val;
			}
			function removeFilter(param) {
				activeFilters.value[param] = [];
			}

			return {
				users,
				issues,
				addFilter,
				removeFilter,
			};
		},
		template: `
			<FilterAutosuggest
				:autosuggest-props="users"
				component="field-select-users"
				param="assignedTo"
				:value="[]"
				title="Assigned to Editors"
				@add-filter="addFilter"
				@remove-filter="removeFilter"
			/>
			<FilterAutosuggest
				:autosuggest-props="issues"
				component="field-select-issues"
				param="issueIds"
				:value="[]"
				title="Assigned to Issues"
				@add-filter="addFilter"
				@remove-filter="removeFilter"
			/>
		`,
	}),

	args: {},
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/users',
					async () => {
						return HttpResponse.json(UsernamesMock);
					},
				),
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/issues',
					async () => {
						return HttpResponse.json(IssuesMock);
					},
				),
			],
		},
	},
};
