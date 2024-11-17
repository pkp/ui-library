import FieldAffiliations from './FieldAffiliations.vue';
import FieldAffiliationsMock from '@/components/Form/mocks/field-affiliations';
import {http, HttpResponse} from "msw";

const args = {...FieldAffiliationsMock};

export default {
	title: 'Forms/FieldAffiliations',
	component: FieldAffiliations,
	args: {},
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/rors/?searchPhrase=Simon+Fraser+University',
					async () => {
						return HttpResponse.json(args.apiResponse);
					},
				),
			],
		},
	},
	render: (args) => ({
		components: {FieldAffiliations},
		setup() {
			return {args}
		},
		template: `
			<FieldAffiliations v-bind="args"/>`
	}),
	decorators: [
		() => ({
			template: '<div style="height: 600px"><story/></div>',
		}),
	],
};

export const Base = {
	args: {...FieldAffiliationsMock},
};
