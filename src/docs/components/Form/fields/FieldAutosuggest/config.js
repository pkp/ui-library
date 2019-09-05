import fieldBase from '../FieldBase/config';
import fieldAutosuggest from '../../helpers/field-autosuggest-users';

export let props = {
	...fieldBase.props,
	...fieldAutosuggest
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
		key: 'deselectLabel',
		description:
			'A text label for the button to remove a selection. This must be included to be compatible with assistive technology.'
	},
	{
		key: 'initialPosition',
		description:
			'Whether selected entries should appear `inline` or `below` the input field when this field is created. Default is `inline`.'
	},
	{
		key: 'noneLabel',
		description:
			'A text label for when no values are selected. This must be included to be compatible with assistive technology.'
	},
	{
		key: 'selectedLabel',
		description:
			'A text label that proceeds the selected values. This must be included to be compatible with assistive technology.'
	},
	{
		key: 'suggestionsUrl',
		description:
			'A URL where suggestions can be retrieved. Suggestions are expected to be returned in a flat array.'
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
