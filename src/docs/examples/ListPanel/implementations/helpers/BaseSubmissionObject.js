export default {
	id: 1,
	fullTitle: {
		en_US: 'Tortor ultrices dolor diam dignissim ante nulla et morbi imperdiet',
	},
	authorString: 'Carlo Corino',
	reviewAssignments: [],
	reviewRounds: [
		{
			id: 1,
			round: 1,
			stageId: 3,
			status: 'Waiting for reviewers to be selected.',
			statusId: 6,
		},
	],
	stages: [
		{
			id: 1,
			label: 'Submission',
			isActiveStage: true,
			queries: [],
			files: {
				count: 0,
			},
		},
		{
			id: 3,
			label: 'Review',
			isActiveStage: false,
			queries: [],
			files: {
				count: 0,
			},
		},
		{
			id: 4,
			label: 'Copyediting',
			isActiveStage: false,
			queries: [],
			files: {
				count: 0,
			},
		},
		{
			id: 5,
			label: 'Production',
			isActiveStage: false,
			queries: [],
			files: {
				count: 0,
			},
		},
	],
	status: {
		id: 1,
		label: 'Queued',
	},
	submissionProgress: 0,
	urlPublished: '/article/view/5',
	urlWorkflow: '/workflow/access/1',
};
