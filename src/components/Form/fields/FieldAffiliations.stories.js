import {http, HttpResponse} from 'msw';
import FieldAffiliations from './FieldAffiliations.vue';
import FieldAffiliationsMock from '@/components/Form/mocks/field-affiliations';

export default {
	title: 'Forms/FieldAffiliations',
	component: FieldAffiliations,
	render: (args) => ({
		components: {FieldAffiliations},
		setup() {
			function change(name, prop, newValue, localeKey) {
				if (localeKey) {
					args[prop][localeKey] = newValue;
				} else {
					args[prop] = newValue;
				}
			}

			return {args, change};
		},
		template: '<FieldAffiliations v-bind="args" @change="change"/>',
	}),
	parameters: {
		msw: {
			handlers: [
				http.get('https://api.ror.org/v2/organizations', async () => {
					return HttpResponse.json(FieldAffiliationsMock.organizations);
				}),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/rors/',
					async () => {
						return HttpResponse.json();
					},
				),
			],
		},
		docs: {
			story: {
				height: '500px',
			},
		},
	},
};

export const Base = {
	args: {...FieldAffiliationsMock},
};
