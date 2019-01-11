import fieldBase from '../FieldBase/config';
import fieldMetadata from '../../helpers/field-metadata';

export let props = {
	...fieldBase.props,
	...fieldMetadata
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
		key: 'disabledValue',
		description:
			'The value which matches a disabled state. Usually the `METADATA_DISABLE` constant.'
	},
	{
		key: 'enabledOnlyValue',
		description:
			'The value which matches an enabled state, but not when it is requested or required during submission. Usually the `METADATA_ENABLE` constant.'
	},
	{
		key: 'submissionOptions',
		description:
			'Options for when the metadata should be requested or required. Usually includes the `METADATA_ENABLE`, `METADATA_REQUEST` and `METADATA_REQUIRE` constants.'
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
