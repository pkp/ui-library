import fieldBase from '../FieldBase/config';
import fieldRadioInput from '../../helpers/field-radio-input';

export let props = {
	...fieldBase.props,
	...fieldRadioInput
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
