import Form from './form';
import FieldTextGivenName from './field-text-given-name';
import FieldTextFamilyName from './field-text-family-name';
import FieldTextEmail from './field-text-email';
import FieldTextareaMailingAddress from './field-textarea-mailing-address';

export default {
	...Form,
	id: 'example',
	action: 'http://httpbin.org/put',
	method: 'PUT',
	fields: [
		{...FieldTextGivenName, groupId: 'default'},
		{...FieldTextFamilyName, groupId: 'default'},
		{...FieldTextEmail, groupId: 'default'},
		{...FieldTextareaMailingAddress, groupId: 'default'},
	],
	groups: [
		{
			id: 'default',
			pageId: 'default',
		},
	],
	supportedFormLocales: [
		...Form.supportedFormLocales,
		{
			key: 'fr_CA',
			label: 'Français (Canada)',
		},
		{
			key: 'ar',
			label: 'عربى',
		},
	],
};
