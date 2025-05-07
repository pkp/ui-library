import {http, HttpResponse} from 'msw';
import FieldControlledVocab from './FieldControlledVocab.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldBaseAutosuggest from '../mocks/field-autosuggest';

import KeywordsMock from '@/mocks/keywords.json';

export default {
	title: 'Forms/FieldControlledVocab',
	component: FieldControlledVocab,
	render: (args) => ({
		components: {FieldControlledVocab},
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
			<FieldControlledVocab v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {
		...FieldBaseMock,
		...FieldBaseAutosuggest,
		label: 'Keywords',
		/*selected: [
			{value: 'keyword1', name: 'keyword1'},
			{value: 'keyword2', name: 'keyword2'},
		],

		//value: ['keyword1', 'keyword2'],
		value: ['keyword1', 'keyword2'],*/

		// multi
		value: {en: ['keyword1', 'keyword2']},
		selected: {
			en: [
				{value: 'keyword1', label: 'keyword1'},
				{value: 'keyword2', label: 'keyword2'},
			],
		},
		isMultilingual: true,
		localeKey: 'en',

		apiUrl:
			'https://mock/index.php/publicknowledge/api/v1/vocabs?vocab=submissionKeyword&locale=en',
		/*selected: [
			{
				value: 1,
				label: 'Articles',
			},
		],*/
	},
	parameters: {
		docs: {
			story: {
				height: '300px',
			},
		},
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/vocabs?vocab=submissionKeyword&locale=en',
					async () => {
						return HttpResponse.json(KeywordsMock);
					},
				),
			],
		},
	},
};

export const WithVocabulary = {
	parameters: {
		msw: {
			handlers: [
				http.get(
					'https://mock/index.php/publicknowledge/api/v1/vocabs?vocab=submissionKeyword&locale=en',
					async (req, res, ctx) => {
						return HttpResponse.json([
							{
								identifier: '1.2',
								name: 'Computer and information sciences',
								source: 'Frascati',
							},
							{
								identifier: '1.3',
								name: 'Physical sciences',
								source: 'Frascati',
							},
						]);
					},
				),
			],
		},
	},
	args: {
		...Base.args,
		vocabularies: [
			{
				addButtonLabel: 'Add Frascati Keywords',
				items: [
					{
						identifier: '1',
						name: 'Natural Sciences',
						source: 'Frascati',
						items: [
							{identifier: '1.1', name: 'Mathematics', source: 'Frascati'},
							{
								identifier: '1.2',
								name: 'Computer and information sciences',
								source: 'Frascati',
							},
							{
								identifier: '1.3',
								name: 'Physical sciences',
								source: 'Frascati',
							},
							{
								identifier: '1.4',
								name: 'Chemical sciences',
								source: 'Frascati',
							},
							{
								identifier: '1.5',
								name: 'Earth and related environmental sciences',
								source: 'Frascati',
							},
							{
								identifier: '1.6',
								name: 'Biological sciences',
								source: 'Frascati',
							},
							{
								identifier: '1.7',
								name: 'Other natural sciences',
								source: 'Frascati',
							},
						],
					},
					{
						identifier: '2',
						name: 'Engineering and Technology',
						source: 'Frascati',
						items: [
							{
								identifier: '2.1',
								name: 'Civil engineering',
								source: 'Frascati',
							},
							{
								identifier: '2.2',
								name: 'Electrical engineering, electronic engineering, information engineering',
								source: 'Frascati',
							},
							{
								identifier: '2.3',
								name: 'Mechanical engineering',
								source: 'Frascati',
							},
							{
								identifier: '2.4',
								name: 'Chemical engineering',
								source: 'Frascati',
							},
							{
								identifier: '2.5',
								name: 'Materials engineering',
								source: 'Frascati',
							},
							{
								identifier: '2.6',
								name: 'Medical engineering',
								source: 'Frascati',
							},
							{
								identifier: '2.7',
								name: 'Environmental engineering',
								source: 'Frascati',
							},
							{
								identifier: '2.8',
								name: 'Environmental biotechnology',
								source: 'Frascati',
							},
							{
								identifier: '2.9',
								name: 'Industrial Biotechnology',
								source: 'Frascati',
							},
							{
								identifier: '2.10',
								name: 'Nano-technology',
								source: 'Frascati',
							},
							{
								identifier: '2.11',
								name: 'Other engineering and technologies',
								source: 'Frascati',
							},
						],
					},
					{
						identifier: '3',
						name: 'Medical and Health Sciences',
						source: 'Frascati',
						items: [
							{identifier: '3.1', name: 'Basic medicine', source: 'Frascati'},
							{
								identifier: '3.2',
								name: 'Clinical medicine',
								source: 'Frascati',
							},
							{identifier: '3.3', name: 'Health sciences', source: 'Frascati'},
							{
								identifier: '3.4',
								name: 'Health biotechnology',
								source: 'Frascati',
							},
							{
								identifier: '3.5',
								name: 'Other medical sciences',
								source: 'Frascati',
							},
						],
					},
					{
						identifier: '4',
						name: 'Agricultural Sciences',
						source: 'Frascati',
						items: [
							{
								identifier: '4.1',
								name: 'Agriculture, forestry, and fisheries',
								source: 'Frascati',
							},
							{
								identifier: '4.2',
								name: 'Animal and dairy science',
								source: 'Frascati',
							},
							{
								identifier: '4.3',
								name: 'Veterinary science',
								source: 'Frascati',
							},
							{
								identifier: '4.4',
								name: 'Agricultural biotechnology',
								source: 'Frascati',
							},
							{
								identifier: '4.5',
								name: 'Other agricultural sciences',
								source: 'Frascati',
							},
						],
					},
					{
						identifier: '5',
						name: 'Social Sciences',
						source: 'Frascati',
						items: [
							{identifier: '5.1', name: 'Psychology', source: 'Frascati'},
							{
								identifier: '5.2',
								name: 'Economics and business',
								source: 'Frascati',
							},
							{
								identifier: '5.3',
								name: 'Educational sciences',
								source: 'Frascati',
							},
							{identifier: '5.3', name: 'Sociology', source: 'Frascati'},
							{identifier: '5.4', name: 'Law', source: 'Frascati'},
							{
								identifier: '5.6',
								name: 'Political Science',
								source: 'Frascati',
							},
							{
								identifier: '5.7',
								name: 'Social and economic geography',
								source: 'Frascati',
							},
							{
								identifier: '5.8',
								name: 'Media and communications',
								source: 'Frascati',
							},
							{
								identifier: '5.9',
								name: 'Other social sciences',
								source: 'Frascati',
							},
						],
					},
					{
						identifier: '6',
						name: 'Humanities',
						source: 'Frascati',
						items: [
							{
								identifier: '6.1',
								name: 'History and archaeology',
								source: 'Frascati',
							},
							{
								identifier: '6.2',
								name: 'Languages and literature',
								source: 'Frascati',
							},
							{
								identifier: '6.3',
								name: 'Philosophy, ethics and religion',
								source: 'Frascati',
							},
							{
								identifier: '6.4',
								name: 'Art (arts, history of arts, performing arts, music)',
								source: 'Frascati',
							},
							{
								identifier: '6.5',
								name: 'Other humanities',
								source: 'Frascati',
							},
						],
					},
				],
			},
		],
	},
};
