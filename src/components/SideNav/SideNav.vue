<template>
	<nav
		v-if="Object.keys(links).length"
		class="sticky top-12 flex h-[calc(100vh-3rem)] flex-none"
		:aria-label="ariaLabel"
	>
		<SideMenu
			v-bind="sideMenuProps"
			background-variant="bg-secondary"
		></SideMenu>
	</nav>
</template>

<script setup>
import {ref, watch, computed} from 'vue';
import {useSideMenu} from '@/composables/useSideMenu.js';
import SideMenu from '../SideMenu/SideMenu.vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';

const props = defineProps({
	/**
	 * A set of objects for the SideMenu.
	 * Each object should contain:
	 * - `name` (string): The label of the menu item.
	 * - `url` (string, optional): The URL to navigate to when the item is clicked.
	 * - `submenu` (object, optional): An object of child items for nested menus.
	 * - and other properties supported by the SideMenu component.
	 */
	links: {
		type: Object,
		required: true,
		validator: (value) => {
			return Object.keys(value).every((key) => 'name' in value[key]);
		},
	},
	/** Aria label to be set for the nav element */
	ariaLabel: {
		type: String,
		default: 'Site Navigation',
	},
});

let currentActiveKey = '';
const menuItems = ref(convertLinksToArray(props.links));

/**
 * Dashboards count
 * */

const {apiUrl: dashboardCountUrl} = useUrl('_submissions/viewsCount');

const {data: dashboardCount, fetch: fetchDashboardCount} = useFetch(
	dashboardCountUrl,
	{
		query: {
			assignedWithRoles: [
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_ASSISTANT,
			],
		},
	},
);

const dashboardsMenuItem = menuItems.value.find(
	(item) => item.key === 'dashboards',
);
if (dashboardsMenuItem) {
	fetchDashboardCount();
}

/**
 * mySubmissions count
 */
const {apiUrl: mySubmissionsCountUrl} = useUrl('_submissions/viewsCount');

const {data: mySubmissionsCount, fetch: fetchMySubmissionsCount} = useFetch(
	mySubmissionsCountUrl,
	{query: {assignedWithRoles: [pkp.const.ROLE_ID_AUTHOR]}},
);

const mySubmissionsMenuItem = menuItems.value.find(
	(item) => item.key === 'mySubmissions',
);
if (mySubmissionsMenuItem) {
	fetchMySubmissionsCount();
}

/**
 * reviewAssignments count
 */
const {apiUrl: reviewAssignmentCountUrl} = useUrl('_submissions/viewsCount');

const {data: reviewAssignmentCount, fetch: fetchReviewAssignmentCount} =
	useFetch(reviewAssignmentCountUrl, {
		query: {assignedWithRoles: [pkp.const.ROLE_ID_REVIEWER]},
	});

const reviewAssignmentMenuItem = menuItems.value.find(
	(item) => item.key === 'reviewAssignments',
);
if (reviewAssignmentMenuItem) {
	fetchReviewAssignmentCount();
}

// helper to attach count to the menu item
function enrichMenuItemWithCounts(menuItems, page, itemsCount) {
	if (itemsCount.value) {
		const menuItem = menuItems.find((item) => item.key === page);
		if (menuItem) {
			const menuItemsEnriched = menuItem.items.map((item) => ({
				...item,
				badge: {
					slot: itemsCount.value[item.id],
				},
			}));
			menuItem.items = menuItemsEnriched;
		}
	}
	return menuItems;
}

const menuItemsEnriched = computed(() => {
	const menuItemsCopy = JSON.parse(JSON.stringify(menuItems.value));

	enrichMenuItemWithCounts(menuItemsCopy, 'dashboards', dashboardCount);
	enrichMenuItemWithCounts(menuItemsCopy, 'mySubmissions', mySubmissionsCount);
	enrichMenuItemWithCounts(
		menuItemsCopy,
		'reviewAssignments',
		reviewAssignmentCount,
	);

	return menuItemsCopy;
});

function convertLinksToArray(links, level = 1, parentKey = '') {
	const result = [];

	for (const key in links) {
		const link = links[key];
		const item = {
			...link,
			key,
			label: link.name,
			link: link.url,
		};

		if (link.submenu) {
			item.items = convertLinksToArray(link.submenu, level + 1, item.key);
		}

		if (parentKey) {
			item.key = `${parentKey}_${item.key}`;
		}

		if (link.isCurrent) {
			currentActiveKey = item.key;
		}

		result.push(item);
	}

	return result;
}

// Defines the list of expanded keys, so it renders correctly when the component loads
function getExpandedKeys(items) {
	const _expandedKeys = {};

	function markExpanded(items) {
		let found = false;
		for (const item of items) {
			if (item.isCurrent) {
				_expandedKeys[item.key] = true;
				found = true;
			}

			const isMarkExpanded = item.items && markExpanded(item.items);

			if (item.items && isMarkExpanded) {
				_expandedKeys[item.key] = true;
				found = true;
			}
		}
		return found;
	}

	markExpanded(items);
	return _expandedKeys;
}

const {sideMenuProps} = useSideMenu(menuItemsEnriched, {
	activeItemKey: currentActiveKey,
	expandedKeys: getExpandedKeys(menuItems.value),
});

watch(
	() => props.links,
	(newLinks) => {
		menuItems.value = convertLinksToArray(newLinks);
	},
);
</script>
