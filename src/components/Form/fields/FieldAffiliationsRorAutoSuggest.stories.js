import {http, HttpResponse} from 'msw';
import FieldAffiliationsRorAutoSuggest from './FieldAffiliationsRorAutoSuggest.vue';
import FieldAffiliationsMock from '@/components/Form/mocks/field-affiliations';

export default {
	title: 'Forms/FieldAffiliationsRorAutoSuggest',
	component: FieldAffiliationsRorAutoSuggest,
	render: (args) => ({
		components: {FieldAffiliationsRorAutoSuggest},
		setup() {
			return {args};
		},
		template: '<FieldAffiliationsRorAutoSuggest v-bind="args" />',
	}),
	parameters: {
		msw: {
			handlers: [
				http.get('https://api.ror.org/v2/organizations', async () => {
					return HttpResponse.json(FieldAffiliationsMock.organizations);
				}),
			],
		},
		docs: {
			story: {
				height: '500px',
			},
		},
	},
};

export const Default = {
	args: {...FieldAffiliationsMock},
};
