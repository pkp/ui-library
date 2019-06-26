import fieldBase from '../FieldBase/config';
import fieldAutosuggest from '../../helpers/field-autosuggest-users';
import fieldControlledVocab from '../../helpers/field-controlled-vocab-keywords';

export let props = {
	...fieldBase.props,
	...fieldAutosuggest,
	...fieldControlledVocab
};

export const propDocs = [
	{
		key: '...',
		description:
			'Supports all props in [FieldBase](#/component/Form/fields/FieldBase).'
	},
	{
		key: '...',
		description:
			'Supports all props in [FieldAutosuggest](#/component/Form/fields/FieldAutosuggest).'
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
