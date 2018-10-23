import FormDefault from './form-default';
import FieldColor from './field-color';
import FieldHtmlLorem from './field-html-lorem';
import FieldMetadataSetting from './field-metadata';
import FieldOptionsOrderable from './field-options-orderable';
import FieldRadioInput from './field-radio-input';
import FieldShowEnsuringLink from './field-show-ensuring-link';
import FieldUploadCss from './field-upload-css.js';
import FieldUploadImageLogo from './field-upload-image-logo.js';

export default {
	...FormDefault,
	id: 'test',
	action: '/example/test',
	fields: [
		{...FieldColor, groupId: 'test'},
		{...FieldHtmlLorem, groupId: 'test'},
		{...FieldMetadataSetting, groupId: 'test'},
		{...FieldOptionsOrderable, groupId: 'test'},
		{...FieldRadioInput, groupId: 'test'},
		{...FieldShowEnsuringLink, groupId: 'test'},
		{...FieldUploadCss, groupId: 'test'},
		{...FieldUploadImageLogo, groupId: 'test'},
	],
	groups: [
		{
			id: 'test',
			pageId: 'test',
		},
	],
	pages: [
		{
			id: 'test',
			submitButton: {
				label: 'Submit',
				isPrimary: true,
			},
		},
	],
};
