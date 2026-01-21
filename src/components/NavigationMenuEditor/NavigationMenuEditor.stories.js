import NavigationMenuEditor from './NavigationMenuEditor.vue';

export default {
	title: 'Components/NavigationMenuEditor',
	component: NavigationMenuEditor,
	parameters: {
		layout: 'padded',
	},
};

const mockAssignedItems = [
	{
		id: 1,
		title: 'Home',
		type: 'NMI_TYPE_HOMEPAGE',
		path: '/',
		children: [],
	},
	{
		id: 2,
		title: 'About',
		type: 'NMI_TYPE_ABOUT',
		path: '/about',
		children: [
			{
				id: 3,
				title: 'Editorial Team',
				type: 'NMI_TYPE_EDITORIAL_TEAM',
				path: '/about/editorialTeam',
				children: [],
			},
			{
				id: 4,
				title: 'Submissions',
				type: 'NMI_TYPE_SUBMISSIONS',
				path: '/about/submissions',
				children: [
					{
						id: 5,
						title: 'Author Guidelines',
						type: 'NMI_TYPE_CUSTOM',
						path: '/about/submissions/authorGuidelines',
						children: [],
					},
				],
			},
		],
	},
	{
		id: 6,
		title: 'Current Issue',
		type: 'NMI_TYPE_CURRENT',
		path: '/issue/current',
		children: [],
	},
	{
		id: 7,
		title: 'Archives',
		type: 'NMI_TYPE_ARCHIVES',
		path: '/issue/archive',
		children: [],
	},
	{
		id: 8,
		title: 'Announcements',
		type: 'NMI_TYPE_ANNOUNCEMENTS',
		path: '/announcement',
		children: [],
	},
];

const mockUnassignedItems = [
	{
		id: 101,
		title: 'Contact',
		type: 'NMI_TYPE_CONTACT',
		path: '/about/contact',
		children: [],
	},
	{
		id: 102,
		title: 'Privacy Statement',
		type: 'NMI_TYPE_PRIVACY',
		path: '/about/privacy',
		children: [],
	},
	{
		id: 103,
		title: 'Search',
		type: 'NMI_TYPE_SEARCH',
		path: '/search',
		children: [],
	},
	{
		id: 104,
		title: 'User Login',
		type: 'NMI_TYPE_USER_LOGIN',
		path: '/login',
		children: [],
	},
	{
		id: 105,
		title: 'User Register',
		type: 'NMI_TYPE_USER_REGISTER',
		path: '/user/register',
		children: [],
	},
	{
		id: 106,
		title: 'User Dashboard',
		type: 'NMI_TYPE_USER_DASHBOARD',
		path: '/submissions',
		children: [],
	},
];

const conditionalWarnings = {
	NMI_TYPE_USER_LOGIN:
		'This item will only be shown when the user is not logged in.',
	NMI_TYPE_USER_REGISTER:
		'This item will only be shown when the user is not logged in and registration is enabled.',
	NMI_TYPE_USER_DASHBOARD:
		'This item will only be shown when the user is logged in.',
};

export const Default = {
	args: {
		assignedItems: mockAssignedItems,
		unassignedItems: mockUnassignedItems,
		maxDepth: 3,
		conditionalWarnings,
	},
};

export const Empty = {
	args: {
		assignedItems: [],
		unassignedItems: mockUnassignedItems,
		maxDepth: 3,
		conditionalWarnings,
	},
};

export const AllAssigned = {
	args: {
		assignedItems: [
			...mockAssignedItems,
			...mockUnassignedItems.map((item) => ({...item, id: item.id + 200})),
		],
		unassignedItems: [],
		maxDepth: 3,
		conditionalWarnings,
	},
};

export const FlatStructure = {
	args: {
		assignedItems: mockAssignedItems.map((item) => ({
			...item,
			children: [],
		})),
		unassignedItems: mockUnassignedItems,
		maxDepth: 1,
		conditionalWarnings,
	},
};

export const TwoLevelMax = {
	args: {
		assignedItems: mockAssignedItems.map((item) => ({
			...item,
			children: (item.children || []).map((child) => ({
				...child,
				children: [],
			})),
		})),
		unassignedItems: mockUnassignedItems,
		maxDepth: 2,
		conditionalWarnings,
	},
};
