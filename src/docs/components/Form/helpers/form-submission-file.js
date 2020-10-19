import Form from './form';
import FieldOptionsFileGenre from './field-options-file-genre';

export default {
	...Form,
	id: 'submissionFile',
	action: '/submissions/1/files',
	fields: [{...FieldOptionsFileGenre}],
	groups: [
		{
			id: 'default',
			pageId: 'default'
		}
	],
	pages: [
		{
			id: 'default',
			submitButton: {
				label: 'Save'
			}
		}
	]
};
