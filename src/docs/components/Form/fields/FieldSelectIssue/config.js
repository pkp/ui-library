import fieldSelect from '../FieldSelect/config';
import fieldSelectIssue from '../../helpers/field-select-issue';

export let props = {
	...fieldSelect.props,
	...fieldSelectIssue
};

export const propDocs = [
	...fieldSelect.propDocs,
	{
		key: 'publicationStatus',
		description:
			'One of the `STATUS_` constants. When set to `STATUS_QUEUED` or `STATUS_PUBLISHED` the issue selection will be hidden.'
	},
	{
		key: 'publishedNoticeBase',
		description:
			'Text to be displayed when the publication is published in an issue. A string replace will be called to replace `{$issueId}` and `{$issueName}` params with the selected issue.'
	},
	{
		key: 'scheduledNoticeBase',
		description:
			'Text to be displayed when the publication is scheduled for publication in an issue. A string replace will be called to replace `{$issueId}` and `{$issueName}` params with the selected issue.'
	},
	{
		key: 'unscheduleLabel',
		description:
			'The label for the button to unschedule a scheduled publication.'
	}
];

export const emitDocs = fieldSelect.emitDocs;

export default {
	props,
	propDocs,
	emitDocs
};
