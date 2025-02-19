const CommonDefaults = {
	contextId: 1,
	currentPublicationId: 20,
	dateLastActivity: '2024-02-17 11:01:48',
	dateSubmitted: '2024-03-23 11:01:02',
	id: 19,
	lastModified: '2024-03-23 11:01:02',
	status: 1,
	submissionProgress: '',
	stageId: 3,
	editorAssigned: true,
	publications: [
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/19/publications/20',
			authorsString: 'Zita Woods (Author)',
			authorsStringIncludeInBrowse: 'Zita Woods (Author)',
			authorsStringShort: 'Woods',
			categoryIds: [],
			coverImage: {
				en: null,
				fr_CA: null,
			},
			datePublished: null,
			doiObject: null,
			fullTitle: {
				en: 'Finocchiaro: Arguments About Arguments',
				fr_CA: '',
			},
			galleys: [],
			id: 20,
			locale: 'en',
			pages: null,
			prefix: {
				en: '',
				fr_CA: '',
			},
			primaryContactId: 28,
			'pub-id::publisher-id': null,
			sectionId: 2,
			status: 1,
			submissionId: 19,
			subtitle: {
				en: '',
				fr_CA: '',
			},
			title: {
				en: 'Finocchiaro: Arguments About Arguments',
				fr_CA: '',
			},
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/19/version/20',
			version: 1,
		},
	],
	reviewAssignments: [],
	reviewRounds: [],
	stages: [
		{
			id: 1,
			label: 'Submission',
			isActiveStage: false,
			openQueryCount: 0,
			currentUserAssignedRoles: [],
			files: {
				count: 0,
			},
		},
		{
			id: 3,
			label: 'Review',
			isActiveStage: true,
			openQueryCount: 0,
			currentUserAssignedRoles: [],
			statusId: 1,
			status: 'Revisions have been requested.',
			files: {
				count: 0,
			},
			currentUserCanRecommendOnly: false,
		},
		{
			id: 4,
			label: 'Copyediting',
			isActiveStage: false,
			openQueryCount: 0,
			currentUserAssignedRoles: [],
			files: {
				count: 0,
			},
		},
		{
			id: 5,
			label: 'Production',
			isActiveStage: false,
			openQueryCount: 0,
			currentUserAssignedRoles: [],
			files: {
				count: 0,
			},
		},
	],
};

export function getSubmissionMock(_overrides = {}) {
	// if overrides has stages array, apply individual stage overrides
	const {stages: overrideStages, ...overrides} = _overrides;
	if (overrideStages) {
		delete overrides.stages;
	}

	const stages = CommonDefaults.stages.map((stage) => {
		let isActiveStage = stage.isActiveStage;
		if (overrides.stageId) {
			isActiveStage = overrides.stageId === stage.id;
		}
		const overrideStage =
			overrideStages?.find((os) => os.id === stage.id) || {};
		return {...stage, isActiveStage, ...overrideStage};
	});
	return {...CommonDefaults, stages, ...overrides};
}
