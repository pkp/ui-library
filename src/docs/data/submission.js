import publication from './publication';

export default {
	_href: 'http://localhost:8000/publicknowledge/api/v1/submissions/1',
	contextId: 1,
	currentPublicationId: 17,
	dateLastActivity: '2019-06-25 16:52:47',
	dateSubmitted: '2019-05-30 12:28:18',
	id: 1,
	lastModified: '2019-06-25 16:40:29',
	publications: [{...publication}],
	reviewAssignments: [],
	reviewRounds: [],
	stageId: 1,
	stages: [
		{
			id: 1,
			label: 'Submission',
			isActiveStage: true,
			queries: [],
			currentUserAssignedRoles: [],
			files: {
				count: 0
			}
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
				count: 0
			},
			currentUserCanRecommendOnly: false
		},
		{
			id: 4,
			label: 'Copyediting',
			isActiveStage: false,
			queries: [],
			currentUserAssignedRoles: [],
			files: {
				count: 0
			}
		},
		{
			id: 5,
			label: 'Production',
			isActiveStage: false,
			queries: [],
			currentUserAssignedRoles: [],
			files: {
				count: 0
			}
		}
	],
	status: 1,
	statusLabel: 'Queued',
	submissionProgress: 0,
	urlAuthorWorkflow:
		'http://localhost:8000/publicknowledge/authorDashboard/submission/1',
	urlEditorialWorkflow:
		'http://localhost:8000/publicknowledge/workflow/access/1',
	urlPublished: 'http://localhost:8000/publicknowledge/article/view/1',
	urlWorkflow: 'http://localhost:8000/publicknowledge/workflow/access/1'
};
