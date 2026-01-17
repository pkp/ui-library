import {within, userEvent} from 'storybook/test';
import {http, HttpResponse} from 'msw';
import NavigationMenuFormModal from './NavigationMenuFormModal.vue';
import {useModal} from '@/composables/useModal.js';
import {sampleUnassignedItems} from '@/mockFactories/navigationMenuMock';

export default {
	title: 'Managers/NavigationMenuEditor',
	component: NavigationMenuFormModal,
};

/**
 * Mock API responses for navigation menu endpoints
 */
const mockAreasResponse = {
	areas: {
		primary: 'Primary Navigation Area',
		user: 'User Navigation Area',
	},
};

const mockAllItemsResponse = {
	assigned: [],
	unassigned: sampleUnassignedItems,
};

const mockExistingMenuItemsResponse = {
	assigned: sampleUnassignedItems.slice(0, 3),
	unassigned: sampleUnassignedItems.slice(3),
};

/**
 * MSW handlers for mocking API calls
 */
const navigationMenuHandlers = [
	// Get menu items for a specific menu
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/navigationMenus/:menuId/items',
		() => {
			return HttpResponse.json(mockExistingMenuItemsResponse);
		},
	),
	// Get all items (for new menu)
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/navigationMenus/items',
		() => {
			return HttpResponse.json(mockAllItemsResponse);
		},
	),
	// Get navigation menu areas
	http.get(
		'https://mock/index.php/publicknowledge/api/v1/navigationMenus/areas',
		() => {
			return HttpResponse.json(mockAreasResponse);
		},
	),
	// Create navigation menu
	http.post(
		'https://mock/index.php/publicknowledge/api/v1/navigationMenus',
		async ({request}) => {
			const body = await request.json();
			return HttpResponse.json({
				id: 3,
				title: body.title,
				areaName: body.areaName || '',
				contextId: 1,
			});
		},
	),
	// Update navigation menu
	http.put(
		'https://mock/index.php/publicknowledge/api/v1/navigationMenus/:menuId',
		async ({request, params}) => {
			const body = await request.json();
			return HttpResponse.json({
				id: parseInt(params.menuId),
				title: body.title,
				areaName: body.areaName || '',
				contextId: 1,
			});
		},
	),
];

/**
 * Default story - Add new navigation menu in SideModal
 */
export const Default = {
	render: (args) => ({
		components: {NavigationMenuFormModal},
		setup() {
			const {openSideModal} = useModal();

			function openModal() {
				openSideModal(NavigationMenuFormModal, {
					navigationMenu: null,
					apiUrl:
						'https://mock/index.php/publicknowledge/api/v1/navigationMenus',
				});
			}

			return {openModal, args};
		},
		template: `
			<PkpButton @click="openModal">
				Add Navigation Menu
			</PkpButton>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 800px"><story/></div>',
		}),
	],
	args: {},
	parameters: {
		msw: {
			handlers: navigationMenuHandlers,
		},
	},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();
		await user.click(canvas.getByText('Add Navigation Menu'));
	},
};

/**
 * Edit existing navigation menu in SideModal
 */
export const EditMenu = {
	render: (args) => ({
		components: {NavigationMenuFormModal},
		setup() {
			const {openSideModal} = useModal();

			function openModal() {
				openSideModal(NavigationMenuFormModal, {
					navigationMenu: {
						id: 1,
						title: 'Primary Navigation Menu',
						areaName: 'primary',
					},
					apiUrl:
						'https://mock/index.php/publicknowledge/api/v1/navigationMenus',
				});
			}

			return {openModal, args};
		},
		template: `
			<PkpButton @click="openModal">
				Edit Navigation Menu
			</PkpButton>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 800px"><story/></div>',
		}),
	],
	args: {},
	parameters: {
		msw: {
			handlers: navigationMenuHandlers,
		},
	},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);
		const user = userEvent.setup();
		await user.click(canvas.getByText('Edit Navigation Menu'));
	},
};
