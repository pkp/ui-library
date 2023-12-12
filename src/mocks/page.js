export default {
	breadcrumbs: [
		{
			id: 'settings',
			name: 'Settings',
			url: 'http://example.org',
		},
		{
			id: 'website',
			name: 'Website',
		},
	],
	contexts: [
		{
			id: 1,
			title: 'Journal of Public Knowledge',
			url: 'http://example.org',
		},
		{
			id: 2,
			title: 'Recherche Bactériologique',
			url: 'http://example.org',
		},
		{
			id: 3,
			title: 'الطب والأنثروبولوجيا',
			url: 'http://example.org',
		},
	],
	currentLocale: 'en',
	hasMultipleContexts: true,
	isLoggedInAs: 'ccorino',
	locales: [
		{
			key: 'en',
			name: 'English',
		},
		{
			key: 'fr_CA',
			name: 'Français (Canada)',
		},
		{
			key: 'ar',
			name: 'العربية',
		},
	],
	menu: {
		submissions: {
			name: 'Submissions',
			url: '#/component/Page',
			isCurrent: false,
		},
		issues: {
			name: 'Issues',
			url: '#/component/Page',
			isCurrent: false,
		},
		announcements: {
			name: 'Announcements',
			url: '#/component/Page',
			isCurrent: false,
		},
		subscriptions: {
			name: 'Subscriptions',
			url: '#/component/Page',
			isCurrent: false,
		},
		settings: {
			name: 'Settings',
			isCurrent: false,
			submenu: {
				context: {
					name: 'Journal',
					url: '#/component/Page',
					isCurrent: false,
				},
				website: {
					name: 'Website',
					url: '#/component/Page',
					isCurrent: false,
				},
				workflow: {
					name: 'Workflow',
					url: '#/component/Page',
					isCurrent: false,
				},
				distribution: {
					name: 'Distribution',
					url: '#/component/Page',
					isCurrent: false,
				},
				access: {
					name: 'Users & Roles',
					url: '#/component/Page',
					isCurrent: false,
				},
			},
		},
		stats: {
			name: 'Stats',
			isCurrent: false,
			submenu: {
				editorial: {
					name: 'Editorial',
					url: '#/component/Page',
					isCurrent: false,
				},
				publications: {
					name: 'Publications',
					url: '#/component/Page',
					isCurrent: false,
				},
				users: {
					name: 'Users',
					url: '#/component/Page',
					isCurrent: false,
				},
			},
		},
		tools: {
			name: 'Tools',
			url: '#/component/Page',
			isCurrent: false,
		},
		admin: {
			name: 'Administration',
			url: '#/component/Page',
			isCurrent: false,
		},
	},
	tasksUrl: '',
	unreadTasksCount: 3,
};
