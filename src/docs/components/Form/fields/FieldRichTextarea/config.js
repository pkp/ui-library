import fieldBase from '../FieldBase/config';
import fieldRichTextarea from '../../helpers/field-rich-text-description';

export let props = {
	...fieldBase.props,
	...fieldRichTextarea
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
		key: 'init',
		description:
			"Provide config properties for TinyMCE's `init` method. Any props you pass will be merged with defaults and can override them. See [TinyMCE documentation](https://www.tiny.cloud/docs/configure/integration-and-setup/)."
	},
	{
		key: 'plugins',
		description:
			'Specify plugins the TinyMCE editor should load. See [TinyMCE documentation](https://www.tiny.cloud/docs/configure/integration-and-setup/#plugins).'
	},
	{
		key: 'preparedContent',
		description:
			'An optional object containing preset information. When preset information exists, a button will appear in the toolbar. See the [Prepared Content](#/component/Form/fields/FieldRichTextarea/ExamplePreparedContent) example.'
	},
	{
		key: 'renderPreparedContent',
		description:
			'When `true` prepared content will be rendered into the template. When `false`, a placeholder will be added. Default is `false`. See the guidance below.'
	},
	{
		key: 'size',
		description: 'One of `default` or `large`. Default: `default`.'
	},
	{
		key: 'toolbar',
		description:
			'Provide the TinyMCE editor with a custom toolbar. See [TinyMCE documentation](https://www.tinymce.com/docs/configure/editor-appearance/#toolbar).'
	},
	{
		key: 'uploadUrl',
		description:
			'Optionally provide a URL where images and other files can be uploaded. You still need to add the appropriate buttons and plugins to the `toolbar` and `plugins` props. The most common use is the [image](https://www.tiny.cloud/docs/plugins/image/) plugin.'
	},
	{
		key: 'wordLimit',
		description:
			'Optionally provide a word limit and the editor will display the word count as they type.'
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
