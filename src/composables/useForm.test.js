import {expect, test, describe} from 'vitest';
import {useForm} from './useForm';
import {
	FieldWithValue,
	FieldWithValueArray,
	FieldWithValueMultilingual,
	FieldWithSelected,
	FieldWithSelectedMultilingual,
	FormMock,
	FormMultilingualMock,
} from './useForm.mocks.js';

function deepCopy(data) {
	return JSON.parse(JSON.stringify(data));
}

describe('setValue', () => {
	describe('Not multilingual field', () => {
		test('Field with value property', () => {
			const formMock = deepCopy({
				...FormMock,
				fields: [FieldWithValue],
			});

			const {setValue, form} = useForm(formMock);

			setValue('fieldWithValue', 1);

			expect(form.value.fields[0]).toMatchInlineSnapshot(`
				{
				  "component": "field-options",
				  "groupId": "default",
				  "isMultilingual": false,
				  "label": "Categories",
				  "name": "fieldWithValue",
				  "options": [
				    {
				      "label": "Applied Science",
				      "value": 1,
				    },
				    {
				      "label": "Applied Science > Computer Science",
				      "value": 2,
				    },
				  ],
				  "type": "radio",
				  "value": 1,
				}
			`);
		});

		test('Field with array value property', () => {
			const formMock = deepCopy({...FormMock, fields: [FieldWithValueArray]});

			const {setValue, form} = useForm(formMock);

			setValue('fieldWithValueArray', [1, 2]);

			expect(form.value.fields[0]).toMatchInlineSnapshot(`
				{
				  "component": "field-options",
				  "groupId": "default",
				  "isMultilingual": false,
				  "label": "Categories",
				  "name": "fieldWithValueArray",
				  "options": [
				    {
				      "label": "Applied Science",
				      "value": 1,
				    },
				    {
				      "label": "Applied Science > Computer Science",
				      "value": 2,
				    },
				  ],
				  "type": "checkbox",
				  "value": [
				    1,
				    2,
				  ],
				}
			`);
		});

		test('field with value and selected property (FieldBaseAutosuggest)', () => {
			const formMock = deepCopy({
				...FormMock,
				fields: [FieldWithSelected],
			});

			const {setValue, form} = useForm(formMock);

			setValue('fieldWithSelected', [
				{label: 'Ferninando', value: 3},
				{label: 'Alberto', value: 7},
			]);

			expect(form.value.fields[0]).toMatchInlineSnapshot(`
				{
				  "component": "field-select-users",
				  "groupId": "default",
				  "isMultilingual": false,
				  "isRequired": false,
				  "label": "Assigned To Editor",
				  "name": "fieldWithSelected",
				  "selected": [
				    {
				      "label": "Ferninando",
				      "value": 3,
				    },
				    {
				      "label": "Alberto",
				      "value": 7,
				    },
				  ],
				  "value": [
				    3,
				    7,
				  ],
				}
			`);
		});
	});

	describe('Multilingual field', () => {
		test('field with value property', () => {
			const formMock = deepCopy({
				...FormMultilingualMock,
				fields: [FieldWithValueMultilingual],
			});

			const {setValue, form} = useForm(formMock);

			setValue('fieldWithValueMultilingual', {
				en: 'anotherTitleEn',
				fr_CA: 'anotherTitleFR',
			});

			expect(form.value.fields[0]).toMatchInlineSnapshot(`
				{
				  "component": "field-rich-text",
				  "groupId": "default",
				  "isMultilingual": true,
				  "isRequired": true,
				  "label": "Title",
				  "name": "fieldWithValueMultilingual",
				  "value": {
				    "en": "anotherTitleEn",
				    "fr_CA": "anotherTitleFR",
				  },
				}
			`);
		});

		/** These are fields based on FieldBaseAutosuggest */
		test('field with value and selected property (FieldBaseAutosuggest)', () => {
			const formMock = deepCopy({
				...FormMultilingualMock,
				fields: [FieldWithSelectedMultilingual],
			});

			const {setValue, form} = useForm(formMock);

			setValue('fieldWithSelectedMultilingual', {
				en: [
					{value: 'EnKeyword1', label: 'EnKeyword1Label'},
					{value: 'EnKeyword2', label: 'EnKeyword2Label'},
				],
				fr_CA: [{value: 'FrKeyword1', label: 'FrKeyword1Label'}],
			});

			expect(form.value.fields[0]).toMatchInlineSnapshot(`
				{
				  "component": "field-controlled-vocab",
				  "description": "Keywords are typically one- to three-word phrases that are used to indicate the main topics of a submission.",
				  "groupId": "default",
				  "isMultilingual": true,
				  "isRequired": false,
				  "label": "Keywords",
				  "name": "fieldWithSelectedMultilingual",
				  "selected": {
				    "en": [
				      {
				        "label": "EnKeyword1Label",
				        "value": "EnKeyword1",
				      },
				      {
				        "label": "EnKeyword2Label",
				        "value": "EnKeyword2",
				      },
				    ],
				    "fr_CA": [
				      {
				        "label": "FrKeyword1Label",
				        "value": "FrKeyword1",
				      },
				    ],
				  },
				  "value": {
				    "en": [
				      "EnKeyword1",
				      "EnKeyword2",
				    ],
				    "fr_CA": [
				      "FrKeyword1",
				    ],
				  },
				}
			`);
		});
	});
});

describe('clearForm', () => {
	test('clearForm', () => {
		const formMock = deepCopy({
			...FormMultilingualMock,
			fields: [
				FieldWithValue,
				FieldWithValueArray,
				FieldWithSelected,
				FieldWithValueMultilingual,
				FieldWithSelectedMultilingual,
			],
		});

		const {clearForm, form} = useForm(formMock);

		clearForm();

		expect(form.value.fields).toMatchInlineSnapshot(`
			[
			  {
			    "component": "field-options",
			    "groupId": "default",
			    "isMultilingual": false,
			    "label": "Categories",
			    "name": "fieldWithValue",
			    "options": [
			      {
			        "label": "Applied Science",
			        "value": 1,
			      },
			      {
			        "label": "Applied Science > Computer Science",
			        "value": 2,
			      },
			    ],
			    "type": "radio",
			    "value": "",
			  },
			  {
			    "component": "field-options",
			    "groupId": "default",
			    "isMultilingual": false,
			    "label": "Categories",
			    "name": "fieldWithValueArray",
			    "options": [
			      {
			        "label": "Applied Science",
			        "value": 1,
			      },
			      {
			        "label": "Applied Science > Computer Science",
			        "value": 2,
			      },
			    ],
			    "type": "checkbox",
			    "value": [],
			  },
			  {
			    "component": "field-select-users",
			    "groupId": "default",
			    "isMultilingual": false,
			    "isRequired": false,
			    "label": "Assigned To Editor",
			    "name": "fieldWithSelected",
			    "selected": [],
			    "value": [],
			  },
			  {
			    "component": "field-rich-text",
			    "groupId": "default",
			    "isMultilingual": true,
			    "isRequired": true,
			    "label": "Title",
			    "name": "fieldWithValueMultilingual",
			    "value": {
			      "en": "",
			      "fr_CA": "",
			    },
			  },
			  {
			    "component": "field-controlled-vocab",
			    "description": "Keywords are typically one- to three-word phrases that are used to indicate the main topics of a submission.",
			    "groupId": "default",
			    "isMultilingual": true,
			    "isRequired": false,
			    "label": "Keywords",
			    "name": "fieldWithSelectedMultilingual",
			    "selected": {
			      "en": [],
			      "fr_CA": [],
			    },
			    "value": {
			      "en": [],
			      "fr_CA": [],
			    },
			  },
			]
		`);
	});
});
