export default {
	name: 'doi',
	component: 'field-doi',
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
	i18n: {
		assignId: 'Assign DOI',
		clearId: 'Clear DOI',
		missingIssue:
			'You can not generate a DOI until this publication has been assigned to an issue.'
	}
};
