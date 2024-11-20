import {http, HttpResponse} from 'msw';
import FieldRorAutosuggest from './FieldRorAutosuggest.vue';
import InstitutionsMock from '@/mocks/institutions.json';

export default {
	title: 'Components/FieldRorAutosuggest',
	component: FieldRorAutosuggest,
	render: (args) => ({
		components: {FieldRorAutosuggest},
		setup() {
			return {args};
		},
		template: '<FieldRorAutosuggest v-bind="args" />',
	}),
	parameters: {
		msw: {
			handlers: [
				http.get('https://api.ror.org/v2/organizations', async () => {
					return HttpResponse.json(InstitutionsMock);
				}),
			],
		},
		docs: {
			story: {
				height: '300px',
			},
		},
	},
};

export const Default = {
	render: (args) => ({
		components: {FieldRorAutosuggest},
		setup() {
			return {args};
		},
		template: '<FieldRorAutosuggest v-bind="args" />',
	}),
	args: {},
};
