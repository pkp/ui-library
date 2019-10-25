import fieldBase from '../FieldBase/config';
import fieldDoi from '../../helpers/field-doi';

export let props = {
	...fieldBase.props,
	...fieldDoi
};

export const propDocs = [
	{
		key: '...',
		description:
			'Supports all props in [FieldBase](#/component/Form/fields/FieldBase) except those related to multilingual input. A pub id is never multilingual.'
	},
	{
		key: 'value',
		description: 'The current value for this field.'
	},
	{
		key: 'issueNumber',
		description:
			'The number of the issue this publication is assigned to. Used when generating a pub id.'
	},
	{
		key: 'issueVolume',
		description:
			'The volume of the issue this publication is assigned to. Used when generating a pub id.'
	},
	{
		key: 'pattern',
		description:
			'The pattern to use when generating a pub id. This is configured in the pub id plugin settings.'
	},
	{
		key: 'prefix',
		description:
			'The pub id prefix to use when generating a pub id. This is configured in the pub id plugin settings.'
	},
	{
		key: 'separator',
		description:
			'An optional separator to be added between the pub id prefix and suffix when generating the pub id.'
	},
	{
		key: 'submissionId',
		description:
			'The ID of the submission for which a pub id will be generated. Used when generating a pub id.'
	},
	{
		key: 'year',
		description:
			"The year this publication was published. Will represent the issue's publication date if no `datePublished` exists for the publication. Used when generating a pub id."
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
