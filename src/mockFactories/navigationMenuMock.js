/**
 * Factory function to create mock navigation menu items
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} Menu item object
 */
export function getNavigationMenuItemMock(overrides = {}) {
	const id = overrides.id ?? Math.floor(Math.random() * 10000);
	const title = overrides.title ?? 'Menu Item';

	return {
		id,
		title,
		localizedTitle: overrides.localizedTitle ?? {en: title},
		type: overrides.type ?? 'custom',
		url: overrides.url ?? null,
		isVisible: overrides.isVisible ?? true,
		hasWarning: overrides.hasWarning ?? false,
		warningMessage: overrides.warningMessage ?? '',
		parentId: overrides.parentId ?? null,
		children: overrides.children ?? [],
		metadata: overrides.metadata ?? {},
	};
}

/**
 * Sample assigned menu items matching the navigation menu editor UI
 */
export const sampleAssignedItems = [
	getNavigationMenuItemMock({
		id: 1,
		title: 'Register',
		type: 'register',
	}),
	getNavigationMenuItemMock({
		id: 2,
		title: 'Login',
		type: 'login',
	}),
	getNavigationMenuItemMock({
		id: 3,
		title: 'admin',
		type: 'dashboard',
		hasWarning: true,
		warningMessage: 'This menu item requires authentication',
		children: [
			getNavigationMenuItemMock({
				id: 31,
				title: 'Dashboard',
				type: 'dashboard',
				parentId: 3,
			}),
			getNavigationMenuItemMock({
				id: 32,
				title: 'View Profile',
				type: 'profile',
				parentId: 3,
			}),
			getNavigationMenuItemMock({
				id: 33,
				title: 'Administration',
				type: 'administration',
				parentId: 3,
			}),
			getNavigationMenuItemMock({
				id: 34,
				title: 'Logout',
				type: 'logout',
				parentId: 3,
			}),
		],
	}),
];

/**
 * Sample unassigned menu items (flat list)
 */
export const sampleUnassignedItems = [
	getNavigationMenuItemMock({
		id: 100,
		title: 'Current',
		type: 'current_issue',
	}),
	getNavigationMenuItemMock({
		id: 101,
		title: 'Archives',
		type: 'archives',
	}),
	getNavigationMenuItemMock({
		id: 102,
		title: 'Announcements',
		type: 'announcements',
		isVisible: false,
	}),
	getNavigationMenuItemMock({
		id: 103,
		title: 'About',
		type: 'about',
		isVisible: false,
	}),
	getNavigationMenuItemMock({
		id: 104,
		title: 'About the Journal',
		type: 'about_journal',
		isVisible: false,
	}),
	getNavigationMenuItemMock({
		id: 105,
		title: 'Submissions',
		type: 'submissions',
	}),
	getNavigationMenuItemMock({
		id: 106,
		title: 'Editorial Masthead',
		type: 'editorial_masthead',
	}),
	getNavigationMenuItemMock({
		id: 107,
		title: 'Privacy Statement',
		type: 'privacy',
		isVisible: false,
	}),
	getNavigationMenuItemMock({
		id: 108,
		title: 'Contact',
		type: 'contact',
		isVisible: false,
	}),
	getNavigationMenuItemMock({
		id: 109,
		title: 'Search',
		type: 'search',
	}),
];

/**
 * Sample items with deep nesting (3 levels)
 * Structure:
 * - About (Level 1)
 *   - About the Journal (Level 2)
 *     - Editorial Team (Level 3)
 *     - Submission Guidelines (Level 3)
 *   - Contact (Level 2)
 * - Current (Level 1)
 *   - Archives (Level 2)
 *     - 2025 (Level 3)
 *     - 2024 (Level 3)
 */
export const sampleDeepNestedItems = [
	getNavigationMenuItemMock({
		id: 1,
		title: 'About',
		type: 'about',
		children: [
			getNavigationMenuItemMock({
				id: 11,
				title: 'About the Journal',
				type: 'about_journal',
				parentId: 1,
				children: [
					getNavigationMenuItemMock({
						id: 111,
						title: 'Editorial Team',
						type: 'editorial_team',
						parentId: 11,
					}),
					getNavigationMenuItemMock({
						id: 112,
						title: 'Submission Guidelines',
						type: 'submissions',
						parentId: 11,
					}),
				],
			}),
			getNavigationMenuItemMock({
				id: 12,
				title: 'Contact',
				type: 'contact',
				parentId: 1,
			}),
		],
	}),
	getNavigationMenuItemMock({
		id: 2,
		title: 'Current',
		type: 'current_issue',
		children: [
			getNavigationMenuItemMock({
				id: 21,
				title: 'Archives',
				type: 'archives',
				parentId: 2,
				children: [
					getNavigationMenuItemMock({
						id: 211,
						title: '2025',
						type: 'custom',
						parentId: 21,
					}),
					getNavigationMenuItemMock({
						id: 212,
						title: '2024',
						type: 'custom',
						parentId: 21,
					}),
				],
			}),
		],
	}),
];

/**
 * Sample unassigned items for deep nesting story
 */
export const sampleDeepNestedUnassignedItems = [
	getNavigationMenuItemMock({
		id: 200,
		title: 'Search',
		type: 'search',
	}),
	getNavigationMenuItemMock({
		id: 201,
		title: 'Announcements',
		type: 'announcements',
	}),
	getNavigationMenuItemMock({
		id: 202,
		title: 'Register',
		type: 'register',
	}),
];
