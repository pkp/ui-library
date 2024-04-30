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
				submenu: {
					context: {
						name: 'Journal',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					website: {
						name: 'Website',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					workflow: {
						name: 'Workflow',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					distribution: {
						name: 'Distribution',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					access: {
						name: 'Users & Roles',
						url: '#',
						isCurrent: false,
						icon: '',
					},
				},
			},
			{
				name: 'Statistics',
				icon: 'Statistics',
				url: '#',
				submenu: {
					publications: {
						name: 'Articles',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					issues: {
						name: 'Issues',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					context: {
						name: 'Journal',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					editorial: {
						name: 'Editorial Activity',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					users: {
						name: 'Users',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					reports: {
						name: 'Reports',
						url: '#',
						isCurrent: false,
						icon: '',
					},
				},
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
