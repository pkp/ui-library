import doi from './doi';
import reviewAssignment from './reviewAssignment';
import submission from './submission';

const reviewRound = {
	id: 1,
	round: 1,
	stageId: 3,
	statusId: 1,
	status: 'Example status',
};

let submissions = [
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
					crossref_failedMsg: 'This is a sample failure message',
				},
				fullTitle: {
					en: 'Quisque vel ultrices ut vel sollicitudin vel varius suscipit phasellus',
				},
				isPublished: true,
			},
		],
		sectionId: 2,
		stageId: 1,
		stageName: 'Desk Review',
		status: 3,
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
					en: 'Metus ut elit est ultrices vivamus mauris est quisque arcu',
				},
			},
		],
		reviewRounds: [{...reviewRound}],
		stageId: 3,
		stageName: 'Review',
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
					en: 'Submission title when current user is assigned as reviewer and editor',
				},
			},
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2017-01-01',
				isCurrentUserAssigned: true,
				status: 'The reviewer has missed the response due date.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
			},
		],
		reviewRounds: [{...reviewRound}],
		stageId: 3,
		stageName: 'Review',
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
					en: 'Scelerisque felis imperdiet proin fermentum: Pretium quam vulputate dignissim suspendisse in est',
				},
			},
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'Waiting for a response from the reviewer.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE,
			},
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			},
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			},
		],
		reviewRounds: [
			{...reviewRound},
			{
				...reviewRound,
				round: 2,
			},
		],
		sectionId: 2,
		stageId: 3,
		stageName: 'Review',
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
					en: 'Mi eget mauris pharetra et ultrices neque ornare aenean',
				},
			},
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			},
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RECEIVED,
			},
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2024-12-05',
				status: 'The reviewer has submitted their review.',
				statusId: pkp.const.REVIEW_ROUND_STATUS_REVIEWS_COMPLETED,
			},
		],
		reviewRounds: [{...reviewRound}],
		stageId: 3,
		stageName: 'Review',
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
					en: 'Sed sed mattis amet eget aenean leo est nam sit',
				},
			},
		],
		stageId: 4,
		stageName: 'Copyediting',
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
					en: 'Lacus ut leo dolor nam neque nam dolor aenean sagittis',
				},
			},
		],
		stageId: 5,
		stageName: 'Production',
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
					en: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
				},
			},
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2017-01-01',
				status: 'The reviewer has missed the response due date.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE,
			},
		],
		reviewRounds: [{...reviewRound}],
		stageId: 3,
		stageName: 'Review',
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
					en: 'Submission title when current user has completed a review',
				},
			},
		],
		reviewAssignments: [
			{
				...reviewAssignment,
				due: '2025-12-05',
				responseDue: '2017-01-01',
				isCurrentUserAssigned: true,
				status: 'This review has been completed.',
				statusId: pkp.const.REVIEW_ASSIGNMENT_STATUS_COMPLETE,
			},
		],
		reviewRounds: [{...reviewRound}],
		sectionId: 2,
		stageId: 3,
		stageName: 'Review',
	},
];

submissions = submissions.map((s) => {
	s.daysInStage = Math.floor(Math.random() * (200 - 0 + 1));
	s.urlAuthorWorkflow = s.urlAuthorWorkflow.replace('1', s.id);
	s.urlEditorialWorkflow = s.urlEditorialWorkflow.replace('1', s.id);
	s.urlPublished = s.urlPublished.replace('1', s.id);
	s.urlWorkflow = s.urlWorkflow.replace('1', s.id);
	return s;
});

export default submissions;
