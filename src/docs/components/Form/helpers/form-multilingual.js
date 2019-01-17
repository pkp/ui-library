import Form from './form';
import FieldTextOrcid from './field-text-orcid';
import FieldTextAffiliation from './field-text-affiliation';
import FieldRichTextareaBio from './field-rich-textarea-bio';

export default {
	...Form,
	id: 'example',
	action: 'https://example.org/example',
	fields: [
		{...FieldTextOrcid, groupId: 'default'},
		{...FieldTextAffiliation, groupId: 'default'},
		{...FieldRichTextareaBio, groupId: 'default'}
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
