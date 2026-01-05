import {ref} from 'vue';
import {http, HttpResponse} from 'msw';
import NavigationMenuEditor from './NavigationMenuEditor.vue';
import NavigationMenuEditorManager from './NavigationMenuEditorManager.vue';
import NavigationMenuEditorPanel from './NavigationMenuEditorPanel.vue';
import PkpButton from '@/components/Button/Button.vue';
import {
	sampleAssignedItems,
	sampleUnassignedItems,
	sampleDeepNestedItems,
	sampleItemsWithVisibility,
	sampleItemsWithWarnings,
} from './mocks/navigationMenuMock';

export default {
	title: 'Managers/NavigationMenuEditor',
	component: NavigationMenuEditor,
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
		({params}) => {
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
 * Default story with both panels populated
 */
export const Default = {
	render: (args) => ({
		components: {NavigationMenuEditor, PkpButton},
		setup() {
			const assignedItems = ref([...sampleAssignedItems]);
			const unassignedItems = ref([...sampleUnassignedItems]);

			function handleSave(payload) {
				console.log('Save triggered:', payload);
				alert('Changes saved! Check console for payload.');
			}

			function handleCancel() {
				console.log('Cancel triggered');
				assignedItems.value = [...sampleAssignedItems];
				unassignedItems.value = [...sampleUnassignedItems];
			}

			return {args, assignedItems, unassignedItems, handleSave, handleCancel};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<NavigationMenuEditor
					v-bind="args"
					v-model:assigned-items="assignedItems"
					v-model:unassigned-items="unassignedItems"
					@save="handleSave"
					@cancel="handleCancel"
				>
					<template #actions="{ hasChanges, onSave, onCancel }">
						<div class="mt-4 flex gap-2">
							<PkpButton :is-primary="true" @click="onSave">
								Save
							</PkpButton>
							<PkpButton @click="onCancel">
								Cancel
							</PkpButton>
							<span v-if="hasChanges" class="text-sm text-attention self-center">
								* Unsaved changes
							</span>
						</div>
					</template>
				</NavigationMenuEditor>
			</div>
		`,
	}),
	args: {
		maxDepth: 3,
		assignedTitle: 'Assigned Menu Items',
		unassignedTitle: 'Unassigned Menu Items',
	},
};

/**
 * Story with empty assigned panel
 */
export const EmptyAssigned = {
	render: (args) => ({
		components: {NavigationMenuEditor},
		setup() {
			const assignedItems = ref([]);
			const unassignedItems = ref([...sampleUnassignedItems]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<NavigationMenuEditor
					v-bind="args"
					v-model:assigned-items="assignedItems"
					v-model:unassigned-items="unassignedItems"
				/>
			</div>
		`,
	}),
	args: {
		maxDepth: 3,
		assignedTitle: 'Assigned Menu Items',
		unassignedTitle: 'Unassigned Menu Items',
		assignedEmptyMessage:
			'No menu items assigned. Drag items from the right panel.',
	},
};

/**
 * Story with empty unassigned panel
 */
export const EmptyUnassigned = {
	render: (args) => ({
		components: {NavigationMenuEditor},
		setup() {
			const assignedItems = ref([...sampleAssignedItems]);
			const unassignedItems = ref([]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<NavigationMenuEditor
					v-bind="args"
					v-model:assigned-items="assignedItems"
					v-model:unassigned-items="unassignedItems"
				/>
			</div>
		`,
	}),
	args: {
		maxDepth: 3,
		assignedTitle: 'Assigned Menu Items',
		unassignedTitle: 'Unassigned Menu Items',
		unassignedEmptyMessage: 'All items have been assigned.',
	},
};

/**
 * Story with deep nesting (3 levels)
 */
export const DeepNesting = {
	render: (args) => ({
		components: {NavigationMenuEditor},
		setup() {
			const assignedItems = ref([...sampleDeepNestedItems]);
			const unassignedItems = ref([...sampleUnassignedItems.slice(0, 3)]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<p class="mb-4 text-sm text-disabled">
					This example shows 3 levels of nesting. Items at level 3 cannot have children added.
				</p>
				<NavigationMenuEditor
					v-bind="args"
					v-model:assigned-items="assignedItems"
					v-model:unassigned-items="unassignedItems"
				/>
			</div>
		`,
	}),
	args: {
		maxDepth: 3,
		assignedTitle: 'Assigned Menu Items (Max 3 Levels)',
		unassignedTitle: 'Unassigned Menu Items',
	},
};

/**
 * Story with items showing visibility states
 */
export const WithHiddenItems = {
	render: (args) => ({
		components: {NavigationMenuEditor},
		setup() {
			const assignedItems = ref([...sampleItemsWithVisibility]);
			const unassignedItems = ref([
				{id: 100, title: 'Hidden Unassigned', isVisible: false, children: []},
				{id: 101, title: 'Visible Unassigned', isVisible: true, children: []},
			]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<p class="mb-4 text-sm text-disabled">
					Items with the eye icon are visible. Items with the crossed-out eye are hidden.
				</p>
				<NavigationMenuEditor
					v-bind="args"
					v-model:assigned-items="assignedItems"
					v-model:unassigned-items="unassignedItems"
				/>
			</div>
		`,
	}),
	args: {
		maxDepth: 3,
		assignedTitle: 'Assigned Menu Items',
		unassignedTitle: 'Unassigned Menu Items',
	},
};

/**
 * Story with items showing warning states
 */
export const WithWarnings = {
	render: (args) => ({
		components: {NavigationMenuEditor},
		setup() {
			const assignedItems = ref([...sampleItemsWithWarnings]);
			const unassignedItems = ref([...sampleUnassignedItems.slice(0, 3)]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<p class="mb-4 text-sm text-disabled">
					Items with the warning icon have configuration issues. Hover over the icon to see the message.
				</p>
				<NavigationMenuEditor
					v-bind="args"
					v-model:assigned-items="assignedItems"
					v-model:unassigned-items="unassignedItems"
				/>
			</div>
		`,
	}),
	args: {
		maxDepth: 3,
		assignedTitle: 'Assigned Menu Items',
		unassignedTitle: 'Unassigned Menu Items',
	},
};

/**
 * Story demonstrating both panels empty
 */
export const BothEmpty = {
	render: (args) => ({
		components: {NavigationMenuEditor},
		setup() {
			const assignedItems = ref([]);
			const unassignedItems = ref([]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<NavigationMenuEditor
					v-bind="args"
					v-model:assigned-items="assignedItems"
					v-model:unassigned-items="unassignedItems"
				/>
			</div>
		`,
	}),
	args: {
		maxDepth: 3,
		assignedTitle: 'Assigned Menu Items',
		unassignedTitle: 'Unassigned Menu Items',
		assignedEmptyMessage: 'No assigned items',
		unassignedEmptyMessage: 'No unassigned items',
	},
};

/**
 * Story with custom indent per level
 */
export const CustomIndentation = {
	render: (args) => ({
		components: {NavigationMenuEditor},
		setup() {
			const assignedItems = ref([...sampleDeepNestedItems]);
			const unassignedItems = ref([...sampleUnassignedItems.slice(0, 3)]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<p class="mb-4 text-sm text-disabled">
					This example uses a larger indentation (40px per level) for better visual hierarchy.
				</p>
				<NavigationMenuEditor
					v-bind="args"
					v-model:assigned-items="assignedItems"
					v-model:unassigned-items="unassignedItems"
				/>
			</div>
		`,
	}),
	args: {
		maxDepth: 3,
		assignedTitle: 'Assigned Menu Items',
		unassignedTitle: 'Unassigned Menu Items',
		indentPerLevel: 40,
	},
};

/**
 * Story for NavigationMenuEditorManager with API integration
 */
export const Manager = {
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
