import {ref} from 'vue';
import NavigationMenuEditor from './NavigationMenuEditor.vue';
import PkpButton from '@/components/Button/Button.vue';
import {
	sampleAssignedItems,
	sampleUnassignedItems,
	sampleDeepNestedItems,
	sampleDeepNestedUnassignedItems,
} from '@/mockFactories/navigationMenuMock';

export default {
	title: 'Components/NavigationMenuEditor',
	component: NavigationMenuEditor,
};

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
		assignedTitle: 'Assigned Menu Items',
		unassignedTitle: 'Unassigned Menu Items',
		unassignedEmptyMessage: 'All items have been assigned.',
	},
};

/**
 * Story with deep nesting
 * Note: maxDepth is configured via pkp.context.navigationMenuMaxDepth (default: 2)
 */
export const DeepNesting = {
	render: (args) => ({
		components: {NavigationMenuEditor},
		setup() {
			const assignedItems = ref([...sampleDeepNestedItems]);
			const unassignedItems = ref([...sampleDeepNestedUnassignedItems]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<div class="p-4 bg-secondary min-h-screen">
				<p class="mb-4 text-sm text-disabled">
					This example shows nested items. Max depth is controlled by pkp.context.navigationMenuMaxDepth.
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
		assignedTitle: 'Assigned Menu Items',
		unassignedTitle: 'Unassigned Menu Items',
	},
};
