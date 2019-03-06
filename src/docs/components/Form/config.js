import Form from './helpers/form-base';

export let props = Form;

export const propDocs = [
	{
		key: 'id',
		description:
			'Used by a parent component, such as `Container`, to identify events emitted from the form and update the form props when necessary.'
	},
	{
		key: 'method',
		description:
			'The method to use when submitting the form. This should match the API endpoint that will handle the form. It can be `POST` (create) or `PUT` (edit).'
	},
	{
		key: 'action',
		description:
			'Where the form should be submitted. It should be a full URL (`http://...`) to the API endpoint where this form is handled.'
	},
	{
		key: 'errors',
		description:
			'Key/value object of messages. The key is the field `name` and the value is an array of errors. Errors are generated during form submission and handled automatically, so this prop can be omitted in most cicumstances.'
	},
	{
		key: 'fields',
		description:
			'Array of form fields. This prop is typically configured on the server, using the `Form` and `Field` classes in the PHP application.'
	},
	{
		key: 'groups',
		description:
			'Array of form groups. See "Groups and Group Descriptions" below.'
	},
	{
		key: 'pages',
		description: 'Array of form pages. See "Multi-page Forms" below.'
	},
	{
		key: 'primaryLocale',
		description:
			'The primary locale for this form. This may be the primary locale of the journal/press, submission or site depending on the form.'
	},
	{
		key: 'visibleLocales',
		description: 'The locale(s) the form is currently being presented in.'
	},
	{
		key: 'supportedFormLocales',
		description:
			'The locale(s) supported by this form. If a form has multilingual fields, it will display a separate input control for each of these locales.'
	},
	{
		key: 'csrfToken',
		description:
			'A CSRF token that is connected to the logged-in user. This is required to prevent some malicious `POST`, `PUT` and `DELETE` requests.'
	},
	{
		key: 'i18n',
		description: ''
	}
];

export const emitDocs = [
	{
		key: 'set-fields',
		description:
			'When the `fields` prop should be changed. Usually occurs when field values are updated. The payload is the new value of the `fields` prop.',
		value: Form.fields
	},
	{
		key: 'set-errors',
		description:
			'When the `errors` prop should be changed. The payload is the new value of the `errors` prop.',
		value: Form.errors
	},
	{
		key: 'set-visible-locales',
		description:
			'When the `visibleLocales` prop should be changed. The payload is the new array of the `visibleLocales` prop.',
		value: Form.visibleLocales
	}
];

export const dataDocs = [
	{
		key: 'currentPage',
		description: 'The page ID of the form that is currently visible.'
	},
	{
		key: 'isSaving',
		description:
			'A boolean that is set to `true` when waiting for a submit request to return.'
	}
];

export default {
	props,
	propDocs,
	emitDocs,
	dataDocs
};
