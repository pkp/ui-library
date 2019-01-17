import Form from './form';
import GroupIdentity from './group-identity';
import GroupContact from './group-contact';
import FieldTextAffiliation from './field-text-affiliation';
import FieldTextEmail from './field-text-email';
import FieldTextPhone from './field-text-phone';
import FieldSelectCountry from './field-select-country';

export default {
	...Form,
	id: 'example',
	action: '/example/example',
	fields: [
		FieldTextEmail,
		FieldTextAffiliation,
		FieldTextPhone,
		FieldSelectCountry
	],
	groups: [
		{...GroupIdentity, pageId: 'default'},
		{...GroupContact, pageId: 'default'}
	],
	supportedFormLocales: [
		...Form.supportedFormLocales,
		{
			key: 'fr_CA',
			label: 'Français (Canada)'
		},
		{
			key: 'ar_AR',
			label: 'عربى'
		}
	]
};
