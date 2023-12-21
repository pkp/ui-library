export default {
	name: 'urn',
	component: 'field-pub-id',
	label: 'URN',
	value: '',
	contextInitials: 'PKP',
	issueNumber: '2',
	issueVolume: '14',
	pattern: 'v%vi%i.%a',
	prefix: 'urn:pkp:1234',
	separator: '-',
	submissionId: 21,
	year: '2019',
	assignIdLabel: 'Assign URN',
	clearIdLabel: 'Clear URN',
	missingPartsLabel:
		'You can not generate a URN because one or more parts of the URN pattern are missing data. You may need to assign the publication to an issue, set a publisher ID or enter page numbers.',
	missingIssueLabel:
		'You can not generate a URN until this publication has been assigned to an issue.',
};
