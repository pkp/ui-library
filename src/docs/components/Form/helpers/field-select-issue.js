export default {
	name: 'issueId',
	component: 'field-select-issue',
	label: 'Issue',
	publicationStatus: 1, // STATUS_QUEUED
	options: [
		{
			value: '',
			label: ''
		},
		{
			value: '',
			label: '--- Future Issues ---'
		},
		{
			value: 5,
			label: 'Vol 2 No 1 2019'
		},
		{
			value: 4,
			label: 'Vol 1 No 4 2018'
		},
		{
			value: '',
			label: '--- Back Issues ---'
		},
		{
			value: 3,
			label: 'Vol 1 No 3 2019'
		},
		{
			value: 2,
			label: 'Vol 1 No 2 2019'
		},
		{
			value: 1,
			label: 'Vol 1 No 1 2019'
		}
	],
	value: '',
	publishedNoticeBase:
		'Published in <a href="http://example.com/issue/__issueId__">{$issueName}</a>.',
	scheduledNoticeBase:
		'Scheduled for publication in <a href="http://example.com/issue/__issueId__">{$issueName}</a>.',
	unscheduleLabel: 'Unschedule'
};
