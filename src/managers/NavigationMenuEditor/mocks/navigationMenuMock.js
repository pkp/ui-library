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
 * Sample assigned menu items with nesting
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
 * Using letter names: X, Y, Z
 */
export const sampleUnassignedItems = [
	getNavigationMenuItemMock({
		id: 100,
		title: 'X',
		type: 'current_issue',
	}),
	getNavigationMenuItemMock({
		id: 101,
		title: 'Y',
		type: 'archives',
	}),
	getNavigationMenuItemMock({
		id: 102,
		title: 'Z',
		type: 'announcements',
		isVisible: false,
	}),
];

/**
 * Sample items with deep nesting (3 levels)
 * Using letter names for easier feedback:
 * - A (Level 1)
 *   - B (Level 2)
 *     - C (Level 3)
 *     - D (Level 3)
 *   - E (Level 2)
 * - F (Level 1)
 *   - G (Level 2)
 */
export const sampleDeepNestedItems = [
	getNavigationMenuItemMock({
		id: 1,
		title: 'A',
		children: [
			getNavigationMenuItemMock({
				id: 11,
				title: 'B',
				parentId: 1,
				children: [
					getNavigationMenuItemMock({
						id: 111,
						title: 'C',
						parentId: 11,
						hasWarning: true,
						warningMessage: 'Maximum nesting depth reached',
					}),
					getNavigationMenuItemMock({
						id: 112,
						title: 'D',
						parentId: 11,
					}),
				],
			}),
			getNavigationMenuItemMock({
				id: 12,
				title: 'E',
				parentId: 1,
			}),
		],
	}),
	getNavigationMenuItemMock({
		id: 2,
		title: 'F',
		children: [
			getNavigationMenuItemMock({
				id: 21,
				title: 'G',
				parentId: 2,
			}),
		],
	}),
];

/**
 * Sample items with various visibility states
 */
export const sampleItemsWithVisibility = [
	getNavigationMenuItemMock({
		id: 1,
		title: 'Visible Parent',
		isVisible: true,
		children: [
			getNavigationMenuItemMock({
				id: 11,
				title: 'Visible Child',
				parentId: 1,
				isVisible: true,
			}),
			getNavigationMenuItemMock({
				id: 12,
				title: 'Hidden Child',
				parentId: 1,
				isVisible: false,
			}),
		],
	}),
	getNavigationMenuItemMock({
		id: 2,
		title: 'Hidden Parent',
		isVisible: false,
	}),
];

/**
 * Sample items with warnings
 */
export const sampleItemsWithWarnings = [
	getNavigationMenuItemMock({
		id: 1,
		title: 'Item with Warning',
		hasWarning: true,
		warningMessage: 'This item has a configuration issue',
	}),
	getNavigationMenuItemMock({
		id: 2,
		title: 'Normal Item',
	}),
	getNavigationMenuItemMock({
		id: 3,
		title: 'Another Warning',
		hasWarning: true,
		warningMessage: 'Missing required configuration',
		isVisible: false,
	}),
];

/**
 * Empty state for testing
 */
export const emptyAssignedItems = [];
export const emptyUnassignedItems = [];
