import i18n from '../../helpers/i18n';

export let props = {
	name: 'base',
	component: 'field-base',
	label: 'Base',
	description: '',
	tooltip: '',
	helpTopic: '',
	helpSection: '',
	groupId: 'default',
	formId: 'default',
	isMultilingual: false,
	isRequired: false,
	showWhen: '',
	localeKey: '',
	primaryLocale: 'en_US',
	locales: ['en_US'],
	value: '',
	allErrors: {},
	i18n: i18n
};

export const propDocs = [
	{
		key: 'name',
		description:
			'The key for this field. Used in the `name` attribute of `<input>`, `<textarea>`, `<select>` and other fields. The form will submit the value for this field under this name, so it must match an accepted value of the API endpoint.'
	},
	{
		key: 'component',
		description:
			'Used internally to load the appropriate component. For example, to load the `FieldText` component this should be `field-text`.'
	},
	{
		key: 'label',
		description:
			'The `<label>` for this field. May be used in a `<fieldset>` when appropriate. All form fields should have an accessible label.'
	},
	{
		key: 'description',
		description: 'Adds a description to the field. Can include HTML code.'
	},
	{
		key: 'tooltip',
		description: 'Adds a tooltip to the field. Can include HTML code.'
	},
	{
		key: 'helpTopic',
		description:
			'Adds a button to the field which will open the in-app help panel to this topic.'
	},
	{
		key: 'helpSection',
		description:
			'When the in-app help panel is opened to `helpTopic`, it will scroll to `helpSection` if included.'
	},
	{
		key: 'groupId',
		description: 'The ID of the group this field should appear in.'
	},
	{
		key: 'formId',
		description:
			'The ID of the form this field should appear in. This is passed down from the `Form`.'
	},
	{
		key: 'isRequired',
		description: 'Whether or not a value for this field should be required.'
	},
	{
		key: 'isMultilingual',
		description:
			'Whether or not this field should be presented for each supported language.'
	},
	{
		key: 'localeKey',
		description:
			'If the field `isMultilingual`, this will be set to the locale key of this particular instance. This is passed down from the `Form`.'
	},
	{
		key: 'primaryLocale',
		description:
			'The primary locale for this form. This is passed down from the `Form`.'
	},
	{
		key: 'locales',
		description:
			'The locales supported by this form. This is passed down from the `Form`.'
	},
	{
		key: 'showWhen',
		description:
			"The `name` of another field which should have a truthy value before this field is shown. You can also pass an array to require a specific value. For example, `['primaryLocale', 'en_US']` would hide this field unless the `primaryLocale` field had a value of `en_US`."
	},
	{
		key: 'value',
		description: 'The current value.'
	},
	{
		key: 'allErrors',
		description:
			'An object containing all errors in the form. This is passed down from the `Form`.'
	},
	{
		key: 'i18n',
		description: 'The `i18n` object will be passed down from the `Form`.'
	}
];

export const emitDocs = [
	{
		key: 'change',
		description:
			"When the value of the field changes. The payload will contain the field's `name`, the new `value` and the `localeKey` of this value for multilingual fields. `localeKey` will be an empty string for fields that are not multilingual. This event is fired every time the value changes, so you should [debounce](https://www.npmjs.com/package/debounce) event callbacks that contain resource-intensive code.",
		value: {
			name: 'fieldName',
			value: 'mixed',
			localeKey: 'en_US'
		}
	}
];

export default {
	props,
	propDocs,
	emitDocs
};
