import {ref} from 'vue';
import NavigationMenuTree from './NavigationMenuTree.vue';
import {useNavigationMenuTree} from '@/composables/useNavigationMenuTree';

export default {
	title: 'Components/NavigationMenuTree',
	component: NavigationMenuTree,
};

const mockAssignedItems = [
	{
		id: 'register',
		label: 'Register',
		isVisible: true,
	},
	{
		id: 'login',
		label: 'Login',
		isVisible: true,
	},
	{
		id: 'admin',
		label: 'admin',
		isVisible: true,
		hasError: true,
		children: [
			{
				id: 'dashboard',
				label: 'Dashboard',
				isVisible: true,
			},
			{
				id: 'view-profile',
				label: 'View Profile',
				isVisible: true,
			},
			{
				id: 'administration',
				label: 'Administration',
				isVisible: true,
				children: [
					{
						id: 'settings',
						label: 'Settings',
						isVisible: true,
					},
				],
			},
			{
				id: 'logout',
				label: 'Logout',
				isVisible: true,
			},
		],
	},
];

const mockUnassignedItems = [
	{
		id: 'current',
		label: 'Current',
		isVisible: true,
	},
	{
		id: 'archives',
		label: 'Archives',
		isVisible: true,
	},
	{
		id: 'announcements',
		label: 'Announcements',
		isVisible: false,
	},
	{
		id: 'about',
		label: 'About',
		isVisible: false,
	},
	{
		id: 'about-journal',
		label: 'About the Journal',
		isVisible: false,
	},
	{
		id: 'submissions',
		label: 'Submissions',
		isVisible: true,
	},
	{
		id: 'editorial-masthead',
		label: 'Editorial Masthead',
		isVisible: true,
	},
	{
		id: 'privacy-statement',
		label: 'Privacy Statement',
		isVisible: false,
	},
	{
		id: 'contact',
		label: 'Contact',
		isVisible: false,
	},
	{
		id: 'search',
		label: 'Search',
		isVisible: true,
	},
];

export const Default = {
	render: (args) => ({
		components: {NavigationMenuTree},
		setup() {
			const assignedItems = ref(JSON.parse(JSON.stringify(mockAssignedItems)));
			const unassignedItems = ref(
				JSON.parse(JSON.stringify(mockUnassignedItems)),
			);

			const {
				assignedItems: items,
				unassignedItems: unassigned,
				startEditing,
				handleDragStart,
				handleDragOver,
				handleDrop,
				handleDropOnEmpty,
				clearDragState,
			} = useNavigationMenuTree({
				assignedItems,
				unassignedItems,
			});

			// Start editing immediately for demo
			startEditing();

			return {
				items,
				unassigned,
				handleDragStart,
				handleDragOver,
				handleDrop,
				handleDropOnEmpty,
				clearDragState,
				args,
			};
		},
		template: `
			<div class="p-4">
				<NavigationMenuTree
					:assigned-items="items"
					:unassigned-items="unassigned"
					@drag-start="handleDragStart"
					@drag-over="handleDragOver"
					@drop="handleDrop"
					@drop-on-empty="handleDropOnEmpty"
					@drag-end="clearDragState"
				/>
			</div>
		`,
	}),
};

export const Empty = {
	render: (args) => ({
		components: {NavigationMenuTree},
		setup() {
			const assignedItems = ref([]);
			const unassignedItems = ref(
				JSON.parse(JSON.stringify(mockUnassignedItems)),
			);

			const {
				assignedItems: items,
				unassignedItems: unassigned,
				startEditing,
				handleDragStart,
				handleDragOver,
				handleDrop,
				handleDropOnEmpty,
				clearDragState,
			} = useNavigationMenuTree({
				assignedItems,
				unassignedItems,
			});

			startEditing();

			return {
				items,
				unassigned,
				handleDragStart,
				handleDragOver,
				handleDrop,
				handleDropOnEmpty,
				clearDragState,
				args,
			};
		},
		template: `
			<div class="p-4">
				<NavigationMenuTree
					:assigned-items="items"
					:unassigned-items="unassigned"
					@drag-start="handleDragStart"
					@drag-over="handleDragOver"
					@drop="handleDrop"
					@drop-on-empty="handleDropOnEmpty"
					@drag-end="clearDragState"
				/>
			</div>
		`,
	}),
};

export const ThreeLevelsDeep = {
	render: (args) => ({
		components: {NavigationMenuTree},
		setup() {
			const assignedItems = ref([
				{
					id: 'level1-1',
					label: 'Level 1 - Item 1',
					isVisible: true,
					children: [
						{
							id: 'level2-1',
							label: 'Level 2 - Item 1',
							isVisible: true,
							children: [
								{
									id: 'level3-1',
									label: 'Level 3 - Item 1',
									isVisible: true,
								},
								{
									id: 'level3-2',
									label: 'Level 3 - Item 2',
									isVisible: true,
								},
							],
						},
						{
							id: 'level2-2',
							label: 'Level 2 - Item 2',
							isVisible: true,
						},
					],
				},
				{
					id: 'level1-2',
					label: 'Level 1 - Item 2',
					isVisible: true,
				},
			]);
			const unassignedItems = ref([
				{
					id: 'unassigned-1',
					label: 'Unassigned Item 1',
					isVisible: true,
				},
				{
					id: 'unassigned-2',
					label: 'Unassigned Item 2',
					isVisible: true,
				},
			]);

			const {
				assignedItems: items,
				unassignedItems: unassigned,
				startEditing,
				handleDragStart,
				handleDragOver,
				handleDrop,
				handleDropOnEmpty,
				clearDragState,
			} = useNavigationMenuTree({
				assignedItems,
				unassignedItems,
			});

			startEditing();

			return {
				items,
				unassigned,
				handleDragStart,
				handleDragOver,
				handleDrop,
				handleDropOnEmpty,
				clearDragState,
				args,
			};
		},
		template: `
			<div class="p-4">
				<p class="mb-4 text-secondary">
					This example shows the maximum 3 levels of nesting.
					Items at level 3 cannot have children added to them.
				</p>
				<NavigationMenuTree
					:assigned-items="items"
					:unassigned-items="unassigned"
					@drag-start="handleDragStart"
					@drag-over="handleDragOver"
					@drop="handleDrop"
					@drop-on-empty="handleDropOnEmpty"
					@drag-end="clearDragState"
				/>
			</div>
		`,
	}),
};
