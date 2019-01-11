import fieldBase from '../FieldBase/config';
import fieldColor from '../../helpers/field-color';

export let props = {
	...fieldBase.props,
	...fieldColor
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
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
