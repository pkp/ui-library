export default {
	name: 'doi',
	component: 'field-pub-id',
	label: 'DOI',
	value: '',
	contextInitials: 'PKP',
	issueNumber: '2',
	issueVolume: '14',
	pattern: '%j.v%vi%i.%a',
	prefix: '10.1234',
	separator: '/',
	submissionId: 21,
	year: '2019',
	assignIdLabel: 'Assign DOI',
	clearIdLabel: 'Clear DOI',
	missingPartsLabel:
		'You can not generate a DOI because one or more parts of the DOI pattern are missing data. You may need to assign the publication to an issue, set a publisher ID or enter page numbers.',
	missingIssueLabel:
		'You can not generate a DOI until this publication has been assigned to an issue.'
};
