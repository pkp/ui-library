import FieldOrcid from '@/components/Form/fields/FieldOrcid.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldOrcidMock from '../mocks/field-orcid';
import {http, HttpResponse} from 'msw';

export default {
	title: 'Forms/FieldOrcid',
	component: FieldOrcid,
	render: (args) => ({
		components: {FieldOrcid},
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
		template: `
			<FieldOrcid v-bind="args" @change="change" />
		`,
	}),
	parameters: {
		msw: {
			handlers: [
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/orcid/requestAuthorVerification/1',
					async () => {
						return HttpResponse.json();
					},
				),
				http.post(
					'https://mock/index.php/publicknowledge/api/v1/orcid/deleteForAuthor/1',
					async () => {
						return HttpResponse.json();
					},
				),
			],
		},
	},
};

export const Base = {
	args: {...FieldBaseMock, ...FieldOrcidMock},
};

export const WithOrcid = {
	args: {
		...FieldBaseMock,
		...FieldOrcidMock,
		orcid: 'https://sandbox.orcid.org/0009-0009-3222-5777',
		orcidDisplayValue: 'https://sandbox.orcid.org/0009-0009-3222-5777',
		isVerified: true,
	},
};

export const WithUnverifiedOrcid = {
	args: {
		...FieldBaseMock,
		...FieldOrcidMock,
		orcid: 'https://sandbox.orcid.org/0009-0009-3222-5777',
		orcidDisplayValue:
			'https://sandbox.orcid.org/0009-0009-3222-5777 (unauthenticated)',
	},
};
