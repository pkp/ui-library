import publication from './publication';

export default {
	_href: 'https://httbin.org/publicknowledge/api/v1/submissions/1',
	contextId: 1,
	currentPublicationId: 17,
	dateLastActivity: '2019-06-25 16:52:47',
	dateSubmitted: '2019-05-30 12:28:18',
	id: 1,
	lastModified: '2019-06-25 16:40:29',
	publications: [{...publication}],
	reviewAssignments: [],
	reviewRounds: [],
	sectionId: 1,
	stageId: 1,
	stageName: 'Desk Review',
	stages: [
		{
			id: 1,
			label: 'Submission',
			isActiveStage: true,
			queries: [],
			currentUserAssignedRoles: [],
			files: {
				count: 0,
			},
		},
		{
			id: 3,
			label: 'Review',
			isActiveStage: false,
			queries: [],
			currentUserAssignedRoles: [],
			status: 'Waiting for reviewers to be selected',
			statusId: 6,
			files: {
				count: 0,
			},
			currentUserCanRecommendOnly: false,
		},
		{
			id: 4,
			label: 'Copyediting',
			isActiveStage: false,
			queries: [],
			currentUserAssignedRoles: [],
			files: {
				count: 0,
			},
		},
		{
			id: 5,
			label: 'Production',
			isActiveStage: false,
			queries: [],
			currentUserAssignedRoles: [],
			files: {
				count: 0,
			},
		},
	],
	status: 1,
	statusLabel: 'Queued',
	submissionProgress: '',
	urlAuthorWorkflow:
		'https://httbin.org/publicknowledge/authorDashboard/submission/1',
	urlEditorialWorkflow: 'https://httbin.org/publicknowledge/workflow/access/1',
	urlPublished: 'https://httbin.org/publicknowledge/article/view/1',
	urlWorkflow: 'https://httbin.org/publicknowledge/workflow/access/1',
};
