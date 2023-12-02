import {ref} from 'vue';
import {rest} from 'msw';
import FilterAutosuggest from './FilterAutosuggest.vue';
import fieldBase from '@/docs/components/Form/helpers/field-base';
import fieldBaseAutosuggest from '@/docs/components/Form/helpers/field-autosuggest';
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
				rest.get(
					'https://mock/index.php/publicknowledge/api/v1/users',
					async (req, res, ctx) => {
						return res(ctx.json(UsernamesMock));
					},
				),
				rest.get(
					'https://mock/index.php/publicknowledge/api/v1/issues',
					async (req, res, ctx) => {
						return res(ctx.json(IssuesMock));
					},
				),
			],
		},
	},
};
