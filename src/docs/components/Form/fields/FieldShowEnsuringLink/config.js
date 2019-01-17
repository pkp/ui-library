import fieldBase from '../FieldBase/config';
import fieldShowEnsuringLink from '../../helpers/field-show-ensuring-link';

export let props = {
	...fieldBase.props,
	...fieldShowEnsuringLink,
	label: 'Reminder'
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
		key: 'message',
		description:
			'The message to display in a the popup when the button in the confirmation message is clicked. **Note: the popup will not open in this demonstration.**'
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
