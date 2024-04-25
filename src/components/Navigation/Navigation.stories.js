import Navigation from './Navigation.vue';

export default {
	title: 'Components/Navigation',
	component: Navigation,
	render: (args) => ({
		components: {Navigation},
		setup() {
			return {args};
		},
		template: '<Navigation v-bind="args" />',
	}),
};

export const Default = {
	args: {
		ariaLabel: 'Site Nav',
		links: [
			{
				name: 'Dashboards',
				url: '#',
				isCurrent: true,
				icon: 'Dashboard',
				addMargin: true,
			},
			{
				name: 'My Review Assignments',
				url: '#',
				isCurrent: false,
				icon: 'ReviewAssignments',
			},
			{
				name: 'My Submissions as Author',
				url: '#',
				isCurrent: false,
				icon: 'MySubmissions',
			},
			{
				name: 'Notifications (10)',
				url: '#',
				isCurrent: false,
				icon: 'Notifications',
			},
			{
				name: 'Issues',
				url: '#',
				isCurrent: false,
				icon: 'Issues',
			},
			{
				name: 'Announcements',
				url: '#',
				isCurrent: false,
				icon: 'Announcements',
			},
			{
				name: 'DOIs',
				url: '#',
				isCurrent: false,
				icon: 'NavDoi',
			},
			{
				name: 'Institutes',
				url: '#',
				isCurrent: false,
				icon: 'Institutes',
			},
			{
				name: 'Settings',
				icon: 'Settings',
				url: '#',
				addMargin: true,
				submenu: [
					{
						name: 'Journal',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					{
						name: 'Website',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					{
						name: 'Workflow',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					{
						name: 'Distribution',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					{
						name: 'Users & Roles',
						url: '#',
						isCurrent: false,
						icon: '',
					},
				],
			},
			{
				name: 'Statistics',
				icon: 'Statistics',
				url: '#',
				submenu: [
					{
						name: 'Articles',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					{
						name: 'Issues',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					{
						name: 'Journal',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					{
						name: 'Editorial Activity',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					{
						name: 'Users',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					{
						name: 'Reports',
						url: '#',
						isCurrent: false,
						icon: '',
					},
				],
			},
			{
				name: 'Tools',
				url: '#',
				isCurrent: false,
				icon: 'Tools',
			},
			{
				name: 'Help',
				url: '#',
				addMargin: true,
				isCurrent: false,
				icon: 'Help',
			},
		],
	},
};
