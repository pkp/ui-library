export default {
	id: 1,
	fullTitle: {
		en_US: 'Tortor ultrices dolor diam dignissim ante nulla et morbi imperdiet'
	},
	authorString: 'Carlo Corino',
	reviewAssignments: [],
	reviewRounds: [
		{
			id: 1,
			round: 1,
			stageId: 3,
			status: 'Waiting for reviewers to be selected.',
			statusId: 6
		}
	],
	stages: [
		{
			id: 1,
			label: 'Submission',
			isActiveStage: true,
			queries: [],
			files: {
				count: 0
			},
			currentUserAssignedRoles: [pkp.const.ROLE_ID_MANAGER]
		},
		{
			id: 3,
			label: 'Review',
			isActiveStage: false,
			queries: [],
			files: {
				count: 0
			},
			currentUserAssignedRoles: [pkp.const.ROLE_ID_MANAGER]
		},
		{
			id: 4,
			label: 'Copyediting',
			isActiveStage: false,
			queries: [],
			files: {
				count: 0
			},
			currentUserAssignedRoles: [pkp.const.ROLE_ID_MANAGER]
		},
		{
			id: 5,
			label: 'Production',
			isActiveStage: false,
			queries: [],
			files: {
				count: 0
			},
			currentUserAssignedRoles: [pkp.const.ROLE_ID_MANAGER]
		}
	],
	status: 1,
	statusLabel: 'Queued',
	submissionProgress: 0,
	urlWorkflow: '/workflow/access/1',
	urlPublished: '/article/view/1',
	urlAuthorWorkflow: '/authorDashboard/submission/1',
	urlEditorialWorkflow: '/workflow/access/1'
};
