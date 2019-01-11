import Form from './form';
import FieldOptionsConfirmation from './field-options-confirmation';
import FieldOptionsEmails from './field-options-emails';
import FieldOptionsEmailsDiscussions from './field-options-emails-discussions';

export default {
	...Form,
	id: 'example',
	action: 'https://example.org/example',
	fields: [
		{...FieldOptionsConfirmation, groupId: 'default'},
		{...FieldOptionsEmails, groupId: 'default'},
		{...FieldOptionsEmailsDiscussions, groupId: 'default'}
	],
	groups: [
		{
			id: 'default',
			pageId: 'default'
		}
	]
};
