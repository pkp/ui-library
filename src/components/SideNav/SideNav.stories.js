import SideNav from './SideNav.vue';

export default {
	title: 'Components/SideNav',
	component: SideNav,
	render: (args) => ({
		components: {SideNav},
		setup() {
			return {args};
		},
		template: '<SideNav v-bind="args" />',
	}),
};

export const Default = {
	args: {
		ariaLabel: 'Site Nav',
		links: {
			admin: {
				name: 'Dashboards',
				url: '#',
				isCurrent: false,
				icon: 'Dashboard',
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
						submenu: {
							item1: {
								name: 'Item 1',
								url: '#',
								isCurrent: false,
								icon: '',
							},
							item2: {
								name: 'Item 2',
								url: '#',
								isCurrent: false,
								icon: '',
								submenu: {
									item2_1: {
										name: 'Item 2.1',
										url: '#',
										isCurrent: false,
										icon: '',
									},
									item2_2: {
										name: 'Item 2.2',
										url: '#',
										isCurrent: false,
										icon: '',
									},
									item2_3: {
										name: 'Item 2.3',
										url: '#',
										isCurrent: true,
										icon: '',
									},
								},
							},
							item3: {
								name: 'Item 2',
								url: '#',
								isCurrent: false,
								icon: '',
							},
						},
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
				isCurrent: false,
				icon: 'Help',
			},
		},
	},
};
