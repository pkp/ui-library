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
