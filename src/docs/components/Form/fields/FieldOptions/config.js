import fieldBase from '../FieldBase/config';
import fieldOptions from '../../helpers/field-options-user-locales';

export let props = {
	...fieldBase.props,
	...fieldOptions
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
		key: 'type',
		description:
			'Type of the `<input>` field. Either `checkbox` or `radio`. Default: `checkbox`.'
	},
	{
		key: 'isOrderable',
		description:
			'Allow the user to reorder the options. Reordering will resort the items in the `value` property. Default: `false`.'
	},
	{
		key: 'options',
		description:
			'An array of objects defining the options which can be selected.'
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
