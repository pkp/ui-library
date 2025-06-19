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
			{value: 'keyword1', label: 'keyword1'},
			{value: 'keyword2', label: 'keyword2'},
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
				locale: 'en',
				addButtonLabel: 'Add Frascati Keywords',
				title: 'Add Keywords from Frascati Taxonomy',
				items: [
					{
						label: 'Natural Sciences',
						value: {
							identifier: '1',
							name: 'Natural Sciences',
							source: 'Frascati',
						},
						items: [
							{
								label: 'Mathematics',
								value: {
									identifier: '1.1',
									name: 'Mathematics',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Computer and information sciences',
								value: {
									identifier: '1.2',
									name: 'Computer and information sciences',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Physical sciences',
								value: {
									identifier: '1.3',
									name: 'Physical sciences',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Chemical sciences',
								value: {
									identifier: '1.4',
									name: 'Chemical sciences',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Earth and related environmental sciences',
								value: {
									identifier: '1.5',
									name: 'Earth and related environmental sciences',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Biological sciences',
								value: {
									identifier: '1.6',
									name: 'Biological sciences',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Other natural sciences',
								value: {
									identifier: '1.7',
									name: 'Other natural sciences',
									source: 'Frascati',
								},
								selectable: true,
							},
						],
					},
					{
						label: 'Engineering and Technology',
						value: {
							identifier: '2',
							name: 'Engineering and Technology',
							source: 'Frascati',
						},
						items: [
							{
								label: 'Civil engineering',
								value: {
									identifier: '2.1',
									name: 'Civil engineering',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label:
									'Electrical engineering, electronic engineering, information engineering',
								value: {
									identifier: '2.2',
									name: 'Electrical engineering, electronic engineering, information engineering',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Mechanical engineering',
								value: {
									identifier: '2.3',
									name: 'Mechanical engineering',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Chemical engineering',
								value: {
									identifier: '2.4',
									name: 'Chemical engineering',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Materials engineering',
								value: {
									identifier: '2.5',
									name: 'Materials engineering',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Medical engineering',
								value: {
									identifier: '2.6',
									name: 'Medical engineering',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Environmental engineering',
								value: {
									identifier: '2.7',
									name: 'Environmental engineering',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Environmental biotechnology',
								value: {
									identifier: '2.8',
									name: 'Environmental biotechnology',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Industrial Biotechnology',
								value: {
									identifier: '2.9',
									name: 'Industrial Biotechnology',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Nano-technology',
								value: {
									identifier: '2.10',
									name: 'Nano-technology',
									source: 'Frascati',
								},
								selectable: true,
							},
							{
								label: 'Other engineering and technologies',
								value: {
									identifier: '2.11',
									name: 'Other engineering and technologies',
									source: 'Frascati',
								},
								selectable: true,
							},
						],
					},
				],
			},
		],
	},
};
