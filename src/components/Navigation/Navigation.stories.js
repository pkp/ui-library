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

export const ScrollableNav = {
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
			_submissions: {
				name: 'Submissions',
				url: '#',
				isCurrent: false,
				icon: 'MySubmissions',
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
			payments: {
				name: 'Payments',
				url: '#',
				isCurrent: false,
				icon: 'Payment',
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
					context2: {
						name: 'Journal 2',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					website2: {
						name: 'Website2',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					workflow2: {
						name: 'Workflow 2',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					distribution2: {
						name: 'Distribution 2',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					access2: {
						name: 'Users & Roles 2',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					context3: {
						name: 'Journal 3',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					website3: {
						name: 'Website 3',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					workflow3: {
						name: 'Workflow 3',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					distribution3: {
						name: 'Distribution 3',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					access3: {
						name: 'Users & Roles 3',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					context4: {
						name: 'Journal 4',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					website4: {
						name: 'Website 4',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					workflow4: {
						name: 'Workflow 4',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					distribution4: {
						name: 'Distribution 4',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					access4: {
						name: 'Users & Roles 4',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					context5: {
						name: 'Journal 5',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					website5: {
						name: 'Website 5',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					workflow5: {
						name: 'Workflow 5',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					distribution5: {
						name: 'Distribution 5',
						url: '#',
						isCurrent: false,
						icon: '',
					},
					access5: {
						name: 'Users & Roles 5',
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
			anonymousReview: {
				name: 'Link 1',
				url: '#',
				addMargin: true,
				isCurrent: false,
				icon: 'AnonymousReview',
			},
			email: {
				name: 'Link 2',
				url: '#',
				isCurrent: false,
				icon: 'Email',
			},
			openReview: {
				name: 'Link 3',
				url: '#',
				isCurrent: false,
				icon: 'OpenReview',
			},
			overdue: {
				name: 'Link 4',
				url: '#',
				isCurrent: false,
				icon: 'Overdue',
			},
			administration: {
				name: 'Administration',
				url: '#',
				addMargin: true,
				isCurrent: false,
				icon: 'NavAdmin',
			},
			help: {
				name: 'Help',
				url: '#',
				isCurrent: false,
				icon: 'Help',
			},
		},
	},
};
