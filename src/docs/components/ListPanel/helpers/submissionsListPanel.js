import submission from '@/docs/data/submission';
import reviewAssignment from '@/docs/data/reviewAssignment';
import i18n from './i18n';

export default {
	id: 'SubmissionsListPanel',
	filters: [
		{
			filters: [
				{
					title: 'Overdue',
					param: 'isOverdue',
					value: true
				},
				{
					title: 'Incomplete',
					param: 'isIncomplete',
					value: true
				}
			]
		},
		{
			heading: 'Stages',
			filters: [
				{
					title: 'Submission',
					param: 'stageIds',
					value: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION
				},
				{
					title: 'Review',
					param: 'stageIds',
					value: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
				},
				{
					title: 'Copyediting',
					param: 'stageIds',
					value: pkp.const.WORKFLOW_STAGE_ID_EDITING
				},
				{
					title: 'Production',
					param: 'stageIds',
					value: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION
				}
			]
		}
	],
	items: [
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
					fullTitle: {
						en_US:
							'Quisque vel ultrices ut vel sollicitudin vel varius suscipit phasellus'
					}
				}
			],
			stages: submission.stages.map(stage => {
				return {
					...stage,
					currentUserAssignedRoles: [pkp.const.ROLE_ID_MANAGER]
				};
			}),
			urlAuthorWorkflow: '/authorDashboard/submission/2',
			urlEditorialWorkflow: '/workflow/access/2',
			urlPublished: '/article/view/2',
			urlWorkflow: '/workflow/access/2'
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
			urlAuthorWorkflow: '/authorDashboard/submission/3',
			urlEditorialWorkflow: '/workflow/access/3',
			urlPublished: '/article/view/3',
			urlWorkflow: '/workflow/access/3'
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
			urlAuthorWorkflow: '/authorDashboard/submission/4',
			urlEditorialWorkflow: '/workflow/access/4',
			urlPublished: '/article/view/4',
			urlWorkflow: '/workflow/access/4'
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
			urlAuthorWorkflow: '/authorDashboard/submission/5',
			urlEditorialWorkflow: '/workflow/access/5',
			urlPublished: '/article/view/5',
			urlWorkflow: '/workflow/access/5'
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
			urlAuthorWorkflow: '/authorDashboard/submission/6',
			urlEditorialWorkflow: '/workflow/access/6',
			urlPublished: '/article/view/6',
			urlWorkflow: '/workflow/access/6'
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
			urlAuthorWorkflow: '/authorDashboard/submission/7',
			urlEditorialWorkflow: '/workflow/access/7',
			urlPublished: '/article/view/7',
			urlWorkflow: '/workflow/access/7'
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
			urlAuthorWorkflow: '/authorDashboard/submission/8',
			urlEditorialWorkflow: '/workflow/access/8',
			urlPublished: '/article/view/8',
			urlWorkflow: '/workflow/access/8'
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
			urlAuthorWorkflow: '/authorDashboard/submission/4',
			urlEditorialWorkflow: '/workflow/access/4',
			urlPublished: '/article/view/4',
			urlWorkflow: '/workflow/access/4'
		}
	],
	itemsMax: 10,
	csrfToken: $.pkp.currentUser.csrfToken,
	i18n: {
		...i18n.count,
		...i18n.pagination,
		...i18n.search,
		...i18n.expandable,
		...i18n.orderable,
		...i18n.filter,
		...i18n.submissionsListPanel,
		title: 'Submissions'
	}
};
