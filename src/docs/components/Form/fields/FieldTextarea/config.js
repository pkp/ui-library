import fieldBase from '../FieldBase/config';
import fieldTextarea from '../../helpers/field-textarea-metatags';

export let props = {
	...fieldBase.props,
	...fieldTextarea
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
		description: 'One of `small`, `normal` or `large`. Default: `normal`.'
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
