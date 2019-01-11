import fieldBase from '../FieldBase/config';
import fieldArchivingPn from '../../helpers/field-archiving-pn';

export let props = {
	...fieldBase.props,
	...fieldArchivingPn
};

export const propDocs = [
	{
		key: '...',
		description:
			'Supports all props in [FieldBase](#/component/Form/fields/FieldBase).'
	},
	{
		key: 'value',
		description: 'The current value for this field.'
	},
	{
		key: 'terms',
		description:
			"An HTML string with a `<button>` that can be used to open the preservation plugin's settings modal. **Note: the modal will not open in this demonstration.**"
	},
	{
		key: 'enablePluginUrl',
		description:
			'A URL to send a request to the plugin grid handler to enable this plugin.'
	},
	{
		key: 'disablePluginUrl',
		description:
			'A URL to send a request to the plugin grid handler to disable this plugin.'
	},
	{
		key: 'settingsUrl',
		description:
			'A URL to send a request to the plugin grid handler to display the settings for this plugin. **Note: the modal will not open in this demonstration.**'
	},
	{
		key: 'csrfToken',
		description:
			"A CSRF token for the current user's session which must be sent with the requests to enable and disable the plugin. The CSRF token is used to prevent unauthorized access."
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
