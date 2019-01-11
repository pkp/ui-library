import fieldBase from '../FieldBase/config';
import fieldRichTextarea from '../../helpers/field-rich-text-citation';

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
		key: 'size',
		description: 'One of `default` or `large`. Default: `default`.'
	},
	{
		key: 'toolbar',
		description:
			'Provide the TinyMCE editor with a custom toolbar. See [TinyMCE documentation](https://www.tinymce.com/docs/configure/editor-appearance/#toolbar).'
	},
	{
		key: 'plugins',
		description:
			'Specify plugins the TinyMCE editor should load. See [TinyMCE documentation](https://www.tiny.cloud/docs/configure/integration-and-setup/#plugins).'
	},
	{
		key: 'init',
		description:
			"Provide config properties for TinyMCE's `init` method. Any props you pass will be merged with defaults and can override them. See [TinyMCE documentation](https://www.tiny.cloud/docs/configure/integration-and-setup/)."
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
