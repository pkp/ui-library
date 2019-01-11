import Form from './form';
import FieldColor from './field-color';
import FieldHtmlLorem from './field-html-lorem';
import FieldMetadataSetting from './field-metadata';
import FieldOptionsOrderable from './field-options-orderable';
import FieldRadioInput from './field-radio-input';
import FieldShowEnsuringLink from './field-show-ensuring-link';
import FieldUploadCss from './field-upload-css.js';
import FieldUploadImageLogo from './field-upload-image-logo.js';

export default {
	...Form,
	id: 'test',
	action: '/example/default',
	fields: [
		{...FieldColor, groupId: 'default'},
		{...FieldHtmlLorem, groupId: 'default'},
		{...FieldMetadataSetting, groupId: 'default'},
		{...FieldOptionsOrderable, groupId: 'default'},
		{...FieldRadioInput, groupId: 'default'},
		{...FieldShowEnsuringLink, groupId: 'default'},
		{...FieldUploadCss, groupId: 'default'},
		{...FieldUploadImageLogo, groupId: 'default'}
	],
	groups: [
		{
			id: 'default',
			pageId: 'default'
		}
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
