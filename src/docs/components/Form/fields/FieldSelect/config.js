import fieldBase from '../FieldBase/config';
import fieldSelect from '../../helpers/field-select-country';

export let props = {
	...fieldBase.props,
	...fieldSelect
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
