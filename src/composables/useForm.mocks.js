export const FieldWithValue = {
	name: 'fieldWithValue',
	component: 'field-options',
	label: 'Categories',
	groupId: 'default',
	isMultilingual: false,
	value: 1,
	type: 'radio',
	options: [
		{value: 1, label: 'Applied Science'},
		{value: 2, label: 'Applied Science > Computer Science'},
	],
};

export const FieldWithValueArray = {
	name: 'fieldWithValueArray',
	component: 'field-options',
	label: 'Categories',
	groupId: 'default',
	isMultilingual: false,
	value: [1],
	type: 'checkbox',
	options: [
		{value: 1, label: 'Applied Science'},
		{value: 2, label: 'Applied Science > Computer Science'},
	],
};

export const FieldWithValueMultilingual = {
	name: 'fieldWithValueMultilingual',
	component: 'field-rich-text',
	label: 'Title',
	groupId: 'default',
	isRequired: true,
	isMultilingual: true,
	value: {en: 'titleEN', fr_CA: ''},
};

export const FieldWithSelected = {
	name: 'fieldWithSelected',
	component: 'field-select-users',
	label: 'Assigned To Editor',
	groupId: 'default',
	isRequired: false,
	isMultilingual: false,
	value: [2],
	// All fields based on FieldBaseAutosuggest has
	// selected property that needs to be set along with value
	selected: [{value: 2, label: 'Ramiro Vaca'}],
};

export const FieldWithSelectedMultilingual = {
	name: 'fieldWithSelectedMultilingual',
	component: 'field-controlled-vocab',
	label: 'Keywords',
	description:
		'Keywords are typically one- to three-word phrases that are used to indicate the main topics of a submission.',
	groupId: 'default',
	isRequired: false,
	isMultilingual: true,
	value: {en: '', fr_CA: ['Transformation Sociale']},
	selected: {
		en: [],
		fr_CA: [{value: 'Transformation Sociale', label: 'Transformation Sociale'}],
	},
};

export const FormMock = {
	id: 'submission',
	method: '',
	action: 'emit',
	fields: [],
	groups: [{id: 'default', pageId: 'default'}],
	hiddenFields: {},
	pages: [{id: 'default', submitButton: null}],
	primaryLocale: 'en',
	visibleLocales: ['en'],
	supportedFormLocales: [],
	errors: {},
};

export const FormMultilingualMock = {
	id: 'submission',
	method: '',
	action: 'emit',
	fields: [],
	groups: [{id: 'default', pageId: 'default'}],
	hiddenFields: {},
	pages: [{id: 'default', submitButton: null}],
	primaryLocale: 'en',
	visibleLocales: ['en', 'fr_CA'],
	supportedFormLocales: [
		{key: 'en', label: 'English'},
		{key: 'fr_CA', label: 'French'},
	],
	errors: {},
};
