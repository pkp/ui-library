import fieldBase from '../FieldBase/config';
import fieldText from '../../helpers/field-text-given-name';

export let props = {
	...fieldBase.props,
	...fieldText
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
		key: 'inputType',
		description:
			'The `type` attribute for the `<input>` field. See [available types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types). Default: `text`.'
	},
	{
		key: 'size',
		description: 'One of `small`, `normal` or `large`. Default: `normal`.'
	},
	{
		key: 'prefix',
		description:
			"An optional prefix to show before the user's input. For example, a prefix of `http://publisher.com/` is used for the journal `path` field."
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
