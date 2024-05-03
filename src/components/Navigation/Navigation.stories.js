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
		links: {
			admin: {
				name: 'Dashboards',
				url: '#',
				isCurrent: true,
				icon: 'Dashboard',
				addMargin: true,
			},
			review: {
				name: 'My Review Assignments',
				url: '#',
				isCurrent: false,
				icon: 'ReviewAssignments',
			},
			submissions: {
				name: 'My Submissions as Author',
				url: '#',
				isCurrent: false,
				icon: 'MySubmissions',
			},
			notifications: {
				name: 'Notifications (10)',
				url: '#',
				isCurrent: false,
				icon: 'Notifications',
			},
			issues: {
				name: 'Issues',
				url: '#',
				isCurrent: false,
				icon: 'Issues',
			},
			announcements: {
				name: 'Announcements',
				url: '#',
				isCurrent: false,
				icon: 'Announcements',
			},
			dois: {
				name: 'DOIs',
				url: '#',
				isCurrent: false,
				icon: 'NavDoi',
			},
			institutes: {
				name: 'Institutes',
				url: '#',
				isCurrent: false,
				icon: 'Institutes',
			},
			settings: {
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
			statistics: {
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
			tools: {
				name: 'Tools',
				url: '#',
				isCurrent: false,
				icon: 'Tools',
			},
			help: {
				name: 'Help',
				url: '#',
				addMargin: true,
				isCurrent: false,
				icon: 'Help',
			},
		},
	},
};

export const WithSecondaryNav = {
	args: {
		ariaLabel: 'Site Nav',
		links: {
			submissions: {
				name: 'Submissions',
				url: '#',
				isCurrent: false,
				icon: 'MySubmissions',
				addMargin: true,
			},
			issues: {
				name: 'Issues',
				url: '#',
				isCurrent: false,
				icon: 'Issues',
			},
			dois: {
				name: 'DOIs',
				url: '#',
				isCurrent: false,
				icon: 'NavDoi',
			},
			institutes: {
				name: 'Institutes',
				url: '#',
				isCurrent: false,
				icon: 'Institutes',
			},
			settings: {
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
						isCurrent: true,
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
			tools: {
				name: 'Tools',
				url: '#',
				isCurrent: false,
				icon: 'Tools',
			},
			admin: {
				name: 'Administration',
				url: '#',
				addMargin: true,
				isCurrent: false,
				icon: 'NavAdmin',
			},
		},
	},
};
