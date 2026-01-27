import {deepMerge} from './mockHelpers';
import {TemplatesDataMock} from './taskDiscussionTemplates';

const CommonDefaults = {
	id: 1,
	type: 2,
	assocId: 20,
	stageId: 3,
	status: 1,
	createdBy: 1,
	createdByName: 'admin admin',
	createdByUsername: 'kkarina',
	dateDue: '2035-04-01', // Y-m-d format
	dateStarted: null,
	dateClosed: null,
	latestActivities: [
		{
			id: 315,
			message: 'Task created by kkarina on 2026-01-27',
			type: 1342177281,
		},
	],
	title: 'Plagiarism Check',
	participants: [
		{
			id: 1,
			userId: 3,
			isResponsible: false,
			fullName: 'Daniel Barnes',
			username: 'dbarnes',
			roles: [
				{
					id: 16,
					name: 'Journal manager',
				},
			],
		},
		{
			id: 2,
			userId: 4,
			isResponsible: true,
			fullName: 'Andy Author',
			username: 'aauthor',
			roles: [],
		},
	],
	notes: [
		{
			id: 1,
			userId: 1,
			contents: TemplatesDataMock[0]?.description,
			createdByName: 'Test',
			createdByUsername: 'test',
			dateCreated: '2025-03-06 06:01:17',
		},
	],
	startedByName: 'Kaja Karina',
};

export function getDiscussionsMock(overrides = {}) {
	const discussions = deepMerge({...CommonDefaults}, overrides);
	return discussions;
}

export const DiscussionsDataMock = [
	{...CommonDefaults},
	{
		...CommonDefaults,
		id: 2,
		createdAt: '2025-03-06 06:01:17',
		createdByUsername: 'kkarina',
		title: 'Authorship Criteria',
		status: 2,
		dateDue: '2035-04-01',
		type: 2,
		dateStarted: '2025-08-01',
		closed: false,
		notes: [
			{
				id: 1,
				userId: 1,
				contents: TemplatesDataMock[1]?.description,
				createdByName: 'Test',
				createdByUsername: 'test',
				dateCreated: '2025-03-06 06:01:17',
			},
		],
		latestActivities: [
			{
				id: 315,
				message: 'Task initiated by kkarina on 2026-01-27',
				type: 1342177281,
			},
			{
				id: 315,
				message: 'aauthor posted a response on 2026-01-27',
				type: 1342177281,
			},
		],
	},
	{
		...CommonDefaults,
		id: 3,
		createdAt: '2025-03-06 06:01:17',
		createdByUsername: 'kstranack',
		title: 'Funding Compliance Check',
		status: 2,
		dateDue: '2025-04-01',
		type: 2,
		dateStarted: '2025-08-01',

		latestActivities: [
			{
				id: 315,
				message:
					'This task is overdue. Remind the task owner to complete it as soon as possible.',
				type: 1342177281,
			},
		],
	},
	{
		...CommonDefaults,
		id: 4,
		createdAt: '2025-03-06 06:01:17',
		createdByUsername: 'aauthor',
		title: 'Clarification',
		status: 2,
		dateDue: '2035-04-01',
		type: 1,
	},
	{
		...CommonDefaults,
		id: 5,
		createdAt: '2025-03-06 06:01:17',
		createdByUsername: 'aauthor',
		title: 'Ethical Approval',
		status: 2,
		dateDue: '2035-04-01',
		type: 1,
		notes: [
			{
				id: 1,
				userId: 1,
				contents: TemplatesDataMock[2]?.description,
				createdByName: 'Test',
				createdByUsername: 'test',
				dateCreated: '2025-03-06 06:01:17',
			},
		],
		latestActivities: [
			{
				id: 315,
				message: 'aauthor posted a response on 2026-01-27',
				type: 1342177281,
			},
			{
				id: 315,
				message: 'Task initiated by kkarina on 2026-01-27',
				type: 1342177281,
			},
		],
	},
	{
		...CommonDefaults,
		id: 6,
		createdAt: '2025-03-06 06:01:17',
		createdByUsername: 'ksimone',
		title: 'Adherence to Policies',
		status: 3,
		dateDue: '2035-04-01',
		type: 2,
		dateStarted: '2025-08-01',
		dateClosed: '2025-08-10',
		latestActivities: [
			{
				id: 315,
				message: 'Task completed by dbarnes on 2026-01-27',
				type: 1342177281,
			},
			{
				id: 315,
				message: 'aauthor posted a response on 2026-01-27',
				type: 1342177281,
			},
			{
				id: 315,
				message: 'Task initiated by kkarina on 2026-01-27',
				type: 1342177281,
			},
		],
	},
	{
		...CommonDefaults,
		id: 7,
		createdAt: '2025-03-06 06:01:17',
		createdByUsername: 'kstranack',
		title: 'Language Review',
		status: 3,
		dateDue: '2035-04-01',
		type: 1,
		dateClosed: '2025-08-10',
		latestActivities: [
			{
				id: 315,
				message: 'Message thread closed by kstranack on 2026-01-27',
				type: 1342177281,
			},
			{
				id: 315,
				message: 'Task completed by dbarnes on 2026-01-27',
				type: 1342177281,
			},
			{
				id: 315,
				message: 'aauthor posted a response on 2026-01-27',
				type: 1342177281,
			},
			{
				id: 315,
				message: 'Task initiated by kkarina on 2026-01-27',
				type: 1342177281,
			},
		],
	},
];
