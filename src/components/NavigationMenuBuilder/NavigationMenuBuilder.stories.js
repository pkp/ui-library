import {ref} from 'vue';
import NavigationMenuBuilder from './NavigationMenuBuilder.vue';
import {within, expect} from 'storybook/test';

export default {
	title: 'Components/NavigationMenuBuilder',
	component: NavigationMenuBuilder,
};

// Mock data matching the screenshot structure
const mockAssignedItems = [
	{
		id: 1,
		title: 'Current',
		type: 'NMI_TYPE_CURRENT',
	},
	{
		id: 2,
		title: 'Archives',
		type: 'NMI_TYPE_ARCHIVES',
	},
	{
		id: 3,
		title: 'Announcements',
		type: 'NMI_TYPE_ANNOUNCEMENTS',
		conditionalWarning:
			'This item is only visible when announcements are enabled.',
	},
	{
		id: 4,
		title: 'About',
		type: 'NMI_TYPE_ABOUT',
		conditionalWarning:
			'This item will display a submenu with additional information about the journal.',
		children: [
			{
				id: 5,
				title: 'About the Journal',
				type: 'NMI_TYPE_ABOUT',
				conditionalWarning: 'This item displays information about the journal.',
			},
			{
				id: 6,
				title: 'Submissions',
				type: 'NMI_TYPE_SUBMISSIONS',
			},
			{
				id: 7,
				title: 'Editorial Masthead',
				type: 'NMI_TYPE_EDITORIAL_MASTHEAD',
			},
			{
				id: 8,
				title: 'Privacy Statement',
				type: 'NMI_TYPE_PRIVACY',
				conditionalWarning: 'This item displays the privacy statement.',
			},
			{
				id: 9,
				title: 'Contact',
				type: 'NMI_TYPE_CONTACT',
				conditionalWarning: 'This item displays contact information.',
			},
		],
	},
];

const mockUnassignedItems = [
	{
		id: 10,
		title: 'Register',
		type: 'NMI_TYPE_REGISTER',
		conditionalWarning:
			'This item is only visible when the user is not logged in and registration is enabled.',
	},
	{
		id: 11,
		title: 'Login',
		type: 'NMI_TYPE_LOGIN',
		conditionalWarning:
			'This item is only visible when the user is not logged in.',
	},
	{
		id: 12,
		title: 'admin',
		type: 'NMI_TYPE_CUSTOM',
	},
	{
		id: 13,
		title: 'Dashboard',
		type: 'NMI_TYPE_DASHBOARD',
		conditionalWarning: 'This item is only visible when the user is logged in.',
	},
	{
		id: 14,
		title: 'View Profile',
		type: 'NMI_TYPE_PROFILE',
		conditionalWarning: 'This item is only visible when the user is logged in.',
	},
	{
		id: 15,
		title: 'Administration',
		type: 'NMI_TYPE_ADMINISTRATION',
		conditionalWarning:
			'This item is only visible when the user has administrative privileges.',
	},
	{
		id: 16,
		title: 'Logout',
		type: 'NMI_TYPE_LOGOUT',
		conditionalWarning: 'This item is only visible when the user is logged in.',
	},
	{
		id: 17,
		title: 'Search',
		type: 'NMI_TYPE_SEARCH',
	},
];

export const Default = {
	render: (args) => ({
		components: {NavigationMenuBuilder},
		setup() {
			const assignedItems = ref([...mockAssignedItems]);
			const unassignedItems = ref([...mockUnassignedItems]);

			function handleChange(menuTree) {
				console.log('Menu tree changed:', menuTree);
			}

			return {args, assignedItems, unassignedItems, handleChange};
		},
		template: `
			<NavigationMenuBuilder
				v-bind="args"
				v-model:assigned-items="assignedItems"
				v-model:unassigned-items="unassignedItems"
				@change="handleChange"
			/>
		`,
	}),
	args: {
		assignedLabel: 'Assigned Menu Items',
		unassignedLabel: 'Unassigned Menu Items',
	},
};

export const Empty = {
	render: (args) => ({
		components: {NavigationMenuBuilder},
		setup() {
			const assignedItems = ref([]);
			const unassignedItems = ref([
				...mockUnassignedItems,
				...mockAssignedItems.map((item) => ({
					...item,
					children: undefined,
				})),
			]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<NavigationMenuBuilder
				v-bind="args"
				v-model:assigned-items="assignedItems"
				v-model:unassigned-items="unassignedItems"
			/>
		`,
	}),
	args: {
		assignedLabel: 'Assigned Menu Items',
		unassignedLabel: 'Unassigned Menu Items',
	},
};

export const DeeplyNested = {
	render: (args) => ({
		components: {NavigationMenuBuilder},
		setup() {
			const assignedItems = ref([
				{
					id: 1,
					title: 'Level 0 - Parent',
					type: 'NMI_TYPE_CUSTOM',
					children: [
						{
							id: 2,
							title: 'Level 1 - Child',
							type: 'NMI_TYPE_CUSTOM',
							children: [
								{
									id: 3,
									title: 'Level 2 - Grandchild (Max)',
									type: 'NMI_TYPE_CUSTOM',
								},
								{
									id: 4,
									title: 'Level 2 - Another Grandchild',
									type: 'NMI_TYPE_CUSTOM',
								},
							],
						},
						{
							id: 5,
							title: 'Level 1 - Another Child',
							type: 'NMI_TYPE_CUSTOM',
						},
					],
				},
				{
					id: 6,
					title: 'Level 0 - Another Parent',
					type: 'NMI_TYPE_CUSTOM',
				},
			]);

			const unassignedItems = ref([
				{
					id: 7,
					title: 'Available Item 1',
					type: 'NMI_TYPE_CUSTOM',
				},
				{
					id: 8,
					title: 'Available Item 2',
					type: 'NMI_TYPE_CUSTOM',
				},
			]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<NavigationMenuBuilder
				v-bind="args"
				v-model:assigned-items="assignedItems"
				v-model:unassigned-items="unassignedItems"
			/>
		`,
	}),
	args: {
		assignedLabel: 'Assigned Menu Items',
		unassignedLabel: 'Unassigned Menu Items',
	},
};

export const LastItemNested = {
	render: (args) => ({
		components: {NavigationMenuBuilder},
		setup() {
			// This scenario tests when the last visible item is nested
			// The "Drop here to add at root level" zone should appear
			const assignedItems = ref([
				{
					id: 1,
					title: 'About',
					type: 'NMI_TYPE_ABOUT',
					children: [
						{
							id: 2,
							title: 'About the Journal',
							type: 'NMI_TYPE_CUSTOM',
						},
						{
							id: 3,
							title: 'Editorial Team',
							type: 'NMI_TYPE_CUSTOM',
							children: [
								{
									id: 4,
									title: 'Editor in Chief',
									type: 'NMI_TYPE_CUSTOM',
								},
								{
									id: 5,
									title: 'Associate Editors',
									type: 'NMI_TYPE_CUSTOM',
								},
							],
						},
					],
				},
			]);

			const unassignedItems = ref([
				{
					id: 6,
					title: 'Contact',
					type: 'NMI_TYPE_CONTACT',
				},
				{
					id: 7,
					title: 'Home',
					type: 'NMI_TYPE_CUSTOM',
				},
			]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<div>
				<p style="margin-bottom: 1rem; color: #666;">
					The last item "Associate Editors" is at level 2.
					A "Drop here to add at root level" zone should appear at the bottom
					to allow adding items at the root level.
				</p>
				<NavigationMenuBuilder
					v-bind="args"
					v-model:assigned-items="assignedItems"
					v-model:unassigned-items="unassignedItems"
				/>
			</div>
		`,
	}),
	args: {
		assignedLabel: 'Assigned Menu Items',
		unassignedLabel: 'Unassigned Menu Items',
	},
};

export const WithConditionalWarnings = {
	render: (args) => ({
		components: {NavigationMenuBuilder},
		setup() {
			const assignedItems = ref([
				{
					id: 1,
					title: 'Login',
					type: 'NMI_TYPE_LOGIN',
					conditionalWarning:
						'This item is only visible when the user is not logged in.',
				},
				{
					id: 2,
					title: 'Register',
					type: 'NMI_TYPE_REGISTER',
					conditionalWarning:
						'This item is only visible when the user is not logged in and registration is enabled.',
				},
				{
					id: 3,
					title: 'Dashboard',
					type: 'NMI_TYPE_DASHBOARD',
					conditionalWarning:
						'This item is only visible when the user is logged in.',
				},
			]);

			const unassignedItems = ref([
				{
					id: 4,
					title: 'Home',
					type: 'NMI_TYPE_CUSTOM',
				},
			]);

			return {args, assignedItems, unassignedItems};
		},
		template: `
			<NavigationMenuBuilder
				v-bind="args"
				v-model:assigned-items="assignedItems"
				v-model:unassigned-items="unassignedItems"
			/>
		`,
	}),
	args: {
		assignedLabel: 'Assigned Menu Items',
		unassignedLabel: 'Unassigned Menu Items',
	},
};

// Interactive test - verify items render correctly
export const TestItemsRender = {
	...Default,
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);

		// Check that assigned items are rendered
		await expect(canvas.getByText('Current')).toBeInTheDocument();
		await expect(canvas.getByText('Archives')).toBeInTheDocument();
		await expect(canvas.getByText('About')).toBeInTheDocument();
		await expect(canvas.getByText('About the Journal')).toBeInTheDocument();

		// Check that unassigned items are rendered
		await expect(canvas.getByText('Register')).toBeInTheDocument();
		await expect(canvas.getByText('Login')).toBeInTheDocument();
		await expect(canvas.getByText('Search')).toBeInTheDocument();
	},
};

// Interactive test - verify panel headers
export const TestPanelHeaders = {
	...Default,
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByText('Assigned Menu Items')).toBeInTheDocument();
		await expect(canvas.getByText('Unassigned Menu Items')).toBeInTheDocument();
	},
};
