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
			'Supports all props in [FieldBase](#/component/Form/fields/FieldBase) except those related to multilingual input. A DOI is never multilingual.'
	},
	{
		key: 'value',
		description: 'The current value for this field.'
	},
	{
		key: 'issueNumber',
		description:
			'The number of the issue this publication is assigned to. Used when generating a DOI.'
	},
	{
		key: 'issueVolume',
		description:
			'The volume of the issue this publication is assigned to. Used when generating a DOI.'
	},
	{
		key: 'pattern',
		description:
			'The pattern to use when generating a DOI. This is configured in the DOI plugin settings.'
	},
	{
		key: 'prefix',
		description:
			'The DOI prefix to use when generating a DOI. This is configured in the DOI plugin settings.'
	},
	{
		key: 'submissionId',
		description:
			'The ID of the submission for which a DOI will be generated. Used when generating a DOI.'
	},
	{
		key: 'year',
		description:
			"The year this publication was published. Will represent the issue's publication date if no `datePublished` exists for the publication. Used when generating a DOI."
	}
];

export const emitDocs = fieldBase.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
