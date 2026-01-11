import {http, HttpResponse} from 'msw';
import NavigationMenuEditorManager from './NavigationMenuEditorManager.vue';
import NavigationMenuEditorPanel from './NavigationMenuEditorPanel.vue';
import {
	sampleAssignedItems,
	sampleUnassignedItems,
} from '@/mockFactories/navigationMenuMock';

export default {
	title: 'Managers/NavigationMenuEditor',
	component: NavigationMenuEditorManager,
};

/**
 * Mock API responses for navigation menu endpoints
 */
const mockMenuItemsResponse = {
	assigned: sampleAssignedItems,
	unassigned: sampleUnassignedItems,
};

const mockMenusListResponse = {
	items: [
		{id: 1, title: 'Primary Navigation Menu'},
		{id: 2, title: 'User Navigation Menu'},
	],
};

/**
 * MSW handlers for mocking API calls
 */
const navigationMenuHandlers = [
	// Get menu items for a specific menu
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/navigationMenus/:menuId/items',
		() => {
			return HttpResponse.json(mockMenuItemsResponse);
		},
	),
	// Get all navigation menus
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/navigationMenus',
		() => {
			return HttpResponse.json(mockMenusListResponse);
		},
	),
];

/**
 * Default story for NavigationMenuEditorManager with API integration
 */
export const Default = {
	render: (args) => ({
		components: {NavigationMenuEditorManager},
		setup() {
			return {args};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<p class="mb-4 text-sm text-disabled">
					This demonstrates the Manager component that fetches data from the API.
				</p>
				<NavigationMenuEditorManager v-bind="args" />
			</div>
		`,
	}),
	args: {
		apiUrl: 'https://mock/index.php/publicknowledge/api/v1/navigationMenus',
		initialMenuId: 1,
		maxDepth: 3,
	},
	parameters: {
		msw: {
			handlers: navigationMenuHandlers,
		},
	},
};

/**
 * Story for NavigationMenuEditorPanel (form integration)
 */
export const Panel = {
	render: (args) => ({
		components: {NavigationMenuEditorPanel},
		setup() {
			return {args};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<p class="mb-4 text-sm text-disabled">
					This demonstrates the Panel component used within forms.
				</p>
				<form id="navigationMenuForm">
					<NavigationMenuEditorPanel v-bind="args" />
				</form>
			</div>
		`,
	}),
	args: {
		apiUrl: 'https://mock/index.php/publicknowledge/api/v1/navigationMenus',
		navigationMenuId: 1,
		maxDepth: 3,
	},
	parameters: {
		msw: {
			handlers: navigationMenuHandlers,
		},
	},
};
