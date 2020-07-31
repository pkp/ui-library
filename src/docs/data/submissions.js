import doi from '@/docs/data/doi';
import reviewAssignment from '@/docs/data/reviewAssignment';
import submission from '@/docs/data/submission';

export default [
	submission,
	{
		...submission,
		id: 2,
		currentPublicationId: 22,
		publications: [
			{
				...submission.publications[0],
				id: 22,
				authorsString: 'Catherine Kwantes',
				authorsStringShort: 'Kwantes',
				doiObject: {
					...doi,
					status: 4,
					crossref_batchId: '_123456',
					crossref_failedMsg: 'This is a sample failure message'
				},
				fullTitle: {
					en_US:
						'Quisque vel ultrices ut vel sollicitudin vel varius suscipit phasellus'
				},
				isPublished: true
			}
		],
		stages: submission.stages.map(stage => {
			return {
				...stage,
				currentUserAssignedRoles: [pkp.const.ROLE_ID_MANAGER]
			};
		}),
		status: 3,
		urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '2'),
		urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '2'),
		urlPublished: submission.urlPublished.replace('1', '2'),
		urlWorkflow: submission.urlWorkflow.replace('1', '2')
	},
	{
		...submission,
		id: 3,
		currentPublicationId: 45,
		publications: [
			{
				...submission.publications[0],
				id: 45,
				authorsString: 'Domatilia Sokoloff',
				authorsStringShort: 'Sokoloff',
				fullTitle: {
					en_US: 'Metus ut elit est ultrices vivamus mauris est quisque arcu'
				}
			}
		],
		stages: submission.stages.map(stage => {
			if (stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
				return {
					...stage,
					status: 'No editor has been assigned to this submission.',
					statusId: pkp.const.STAGE_STATUS_SUBMISSION_UNASSIGNED
				};
			}
			return stage;
		}),
		urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '3'),
		urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '3'),
		urlPublished: submission.urlPublished.replace('1', '3'),
		urlWorkflow: submission.urlWorkflow.replace('1', '3')
	},
	{
		...submission,
		id: 4,
		currentPublicationId: 87,
		publications: [
			{
				...submission.publications[0],
				id: 87,
				authors: [],
				authorsString: '',
				authorsStringShort: '',
				fullTitle: {
					en_US:
						'Submission title when current user is assigned as reviewer and editor'
				}
			}
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2017-01-01',
				isCurrentUserAssigned: true,
				status: 'The reviewer has missed the response due date.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
			}
		],
		stages: submission.stages.map(stage => {
			if (stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
				return {
					...stage,
					isActiveStage: false
				};
			} else if (stage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
				return {
					...stage,
					isActiveStage: true,
					status: 'A review is overdue.',
					statusId: pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE
				};
			}
			return stage;
		}),
		urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '4'),
		urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '4'),
		urlPublished: submission.urlPublished.replace('1', '4'),
		urlWorkflow: submission.urlWorkflow.replace('1', '4')
	},
	{
		...submission,
		id: 5,
		currentPublicationId: 12,
		publications: [
			{
				...submission.publications[0],
				id: 12,
				authorsString: 'Convallis Tellus',
				authorsStringShort: 'Tellus',
				fullTitle: {
					en_US:
						'Scelerisque felis imperdiet proin fermentum: Pretium quam vulputate dignissim suspendisse in est'
				}
			}
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'Waiting for a response from the reviewer.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE
			},
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED
			},
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED
			}
		],
		stages: submission.stages.map(stage => {
			if (stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
				return {
					...stage,
					isActiveStage: false
				};
			} else if (stage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
				return {
					...stage,
					isActiveStage: true,
					status: 'Awaiting responses from reviewers.',
					statusId: pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWS
				};
			}
			return stage;
		}),
		urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '5'),
		urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '5'),
		urlPublished: submission.urlPublished.replace('1', '5'),
		urlWorkflow: submission.urlWorkflow.replace('1', '5')
	},
	{
		...submission,
		id: 6,
		currentPublicationId: 71,
		publications: [
			{
				...submission.publications[0],
				id: 71,
				authorsString: 'Curabitur Eget',
				authorsStringShort: 'Eget',
				fullTitle: {
					en_US: 'Mi eget mauris pharetra et ultrices neque ornare aenean'
				}
			}
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED
			},
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED
			},
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED
			}
		],
		stages: submission.stages.map(stage => {
			if (stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
				return {
					...stage,
					isActiveStage: false
				};
			} else if (stage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
				return {
					...stage,
					isActiveStage: true,
					status: 'All reviewers have responded and a decision is needed.',
					statusId: pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWS
				};
			}
			return stage;
		}),
		urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '6'),
		urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '6'),
		urlPublished: submission.urlPublished.replace('1', '6'),
		urlWorkflow: submission.urlWorkflow.replace('1', '6')
	},
	{
		...submission,
		id: 7,
		currentPublicationId: 123,
		publications: [
			{
				...submission.publications[0],
				id: 123,
				authorsString: 'Sed Aenean',
				authorsStringShort: 'Aenean',
				fullTitle: {
					en_US: 'Sed sed mattis amet eget aenean leo est nam sit'
				}
			}
		],
		stages: submission.stages.map(stage => {
			if (stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
				return {
					...stage,
					isActiveStage: false
				};
			} else if (stage.id === pkp.const.WORKFLOW_STAGE_ID_EDITING) {
				return {
					...stage,
					isActiveStage: true,
					queries: [
						{
							assocId: 21,
							assocType: 1048585,
							closed: false,
							id: 47,
							sequence: 1,
							stageId: 4
						}
					],
					files: {
						count: 2
					},
					currentUserAssignedRoles: [pkp.const.ROLE_ID_MANAGER]
				};
			}
			return stage;
		}),
		urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '7'),
		urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '7'),
		urlPublished: submission.urlPublished.replace('1', '7'),
		urlWorkflow: submission.urlWorkflow.replace('1', '7')
	},
	{
		...submission,
		id: 8,
		currentPublicationId: 872,
		publications: [
			{
				...submission.publications[0],
				id: 872,
				authorsString: 'Lacus Agittis',
				authorsStringShort: 'Agittis',
				fullTitle: {
					en_US: 'Lacus ut leo dolor nam neque nam dolor aenean sagittis'
				}
			}
		],
		stages: submission.stages.map(stage => {
			if (stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
				return {
					...stage,
					isActiveStage: false
				};
			} else if (stage.id === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION) {
				return {
					...stage,
					isActiveStage: true,
					queries: [
						{
							assocId: 21,
							assocType: 1048585,
							closed: false,
							id: 47,
							sequence: 1,
							stageId: 5
						}
					],
					files: {
						count: 4
					},
					currentUserAssignedRoles: [pkp.const.ROLE_ID_MANAGER]
				};
			}
			return stage;
		}),
		urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '8'),
		urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '8'),
		urlPublished: submission.urlPublished.replace('1', '8'),
		urlWorkflow: submission.urlWorkflow.replace('1', '8')
	},
	{
		...submission,
		id: 9,
		currentPublicationId: 321,
		publications: [
			{
				...submission.publications[0],
				id: 321,
				authorsString: 'Ullamco Excepteur',
				authorsStringShort: 'Excepteur',
				fullTitle: {
					en_US:
						'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
				}
			}
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2017-01-01',
				status: 'The reviewer has missed the response due date.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE
			}
		],
		stages: submission.stages.map(stage => {
			if (stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
				return {
					...stage,
					isActiveStage: false
				};
			} else if (stage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
				return {
					...stage,
					isActiveStage: true,
					status: 'A review is overdue.',
					statusId: pkp.const.REVIEW_ROUND_STATUS_REVIEWS_OVERDUE
				};
			}
			return stage;
		}),
		urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '9'),
		urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '9'),
		urlPublished: submission.urlPublished.replace('1', '9'),
		urlWorkflow: submission.urlWorkflow.replace('1', '9')
	},
	{
		...submission,
		id: 10,
		currentPublicationId: 87,
		publications: [
			{
				...submission.publications[0],
				id: 87,
				authors: [],
				authorsString: '',
				authorsStringShort: '',
				fullTitle: {
					en_US: 'Submission title when current user has completed a review'
				}
			}
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2017-01-01',
				isCurrentUserAssigned: true,
				status: 'This review has been completed.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE
			}
		],
		stages: submission.stages.map(stage => {
			if (stage.id === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
				return {
					...stage,
					isActiveStage: false
				};
			} else if (stage.id === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
				return {
					...stage,
					isActiveStage: true,
					status: 'A new review has been submitted.',
					statusId: pkp.const.REVIEW_ROUND_STATUS_REVIEWS_READY
				};
			}
			return stage;
		}),
		urlAuthorWorkflow: submission.urlAuthorWorkflow.replace('1', '10'),
		urlEditorialWorkflow: submission.urlEditorialWorkflow.replace('1', '10'),
		urlPublished: submission.urlPublished.replace('1', '10'),
		urlWorkflow: submission.urlWorkflow.replace('1', '10')
	}
];
