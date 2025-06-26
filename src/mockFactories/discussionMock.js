import {deepMerge} from './mockHelpers';

const CommonDefaults = {
	id: 1,
	createdAt: '2025-03-06 06:01:17',
	owner: 'kkarina',
	activities: ['Task created by kkarina on 2025-03-06'],
	title: {
		en: 'Plagiarism Check',
		fr_CA: 'Tâche de vérification de plagiat',
	},
	status: 'Pending',
	dueDate: '2025-04-01',
	mode: 'task',
	started: false,
	closed: false,
};

export function getDiscussionsMock(overrides = {}) {
	const discussions = deepMerge({...CommonDefaults}, overrides);
	return discussions;
}

export const DiscussionsDataMock = [
	{...CommonDefaults},
	{
		id: 2,
		createdAt: '2025-03-06 06:01:17',
		owner: 'kkarina',
		activities: [
			'aauthor posted a response on {DD-MM-YYYY}',
			'Task initiated by kkarina on {DD-MM-YYYY}',
		],
		title: {
			en: 'Authorship Criteria',
			fr_CA: '',
		},
		status: 'In Progress',
		dueDate: '2025-04-01',
		mode: 'task',
		started: true,
		closed: false,
	},
	{
		id: 3,
		createdAt: '2025-03-06 06:01:17',
		owner: 'kstranack',
		activities: [
			'This task is overdue. Remind the task owner to complete it as soon as possible',
		],
		title: {
			en: 'Funding Compliance Check',
			fr_CA: '',
		},
		status: 'In Progress',
		dueDate: '2025-04-01',
		mode: 'task',
		started: true,
		closed: false,
	},
	{
		id: 4,
		createdAt: '2025-03-06 06:01:17',
		owner: 'aauthor',
		activities: [],
		title: {
			en: 'Clarification',
			fr_CA: '',
		},
		status: 'In Progress',
		dueDate: '2025-04-01',
		mode: 'discusssion',
		closed: false,
	},
	{
		id: 5,
		createdAt: '2025-03-06 06:01:17',
		owner: 'aauthor',
		activities: ['aauthor posted a response on {DD-MM-YYY}'],
		title: {
			en: 'Ethical Approval',
			fr_CA: '',
		},
		status: 'In Progress',
		dueDate: '2025-04-01',
		mode: ' discusssion',
		closed: false,
	},
	{
		id: 6,
		createdAt: '2025-03-06 06:01:17',
		owner: 'ksimone',
		activities: ['Task completed by {username} on {DD-MM-YYYY}'],
		title: {
			en: 'Adherence to Policies',
			fr_CA: '',
		},
		status: 'Closed',
		dueDate: '2025-04-01',
		mode: 'task',
		started: true,
		closed: true,
	},
	{
		id: 7,
		createdAt: '2025-03-06 06:01:17',
		owner: 'kstranack',
		activities: ['Message thread closed by kstranack on {DD-MM-YYYY}'],
		title: {
			en: 'Language Review',
			fr_CA: '',
		},
		status: 'Closed',
		dueDate: '2025-04-01',
		mode: 'discussion',
		closed: true,
	},
];
