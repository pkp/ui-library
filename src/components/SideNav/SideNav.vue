<template>
	<nav
		v-if="Object.keys(links).length"
		id="app-nav"
		class="sticky top-12 flex h-[calc(100vh-3rem)] flex-none"
		:aria-label="ariaLabel"
	>
		<SideMenu
			v-bind="sideMenuProps"
			background-variant="bg-secondary"
			@search-submit="onSearchSubmit"
		></SideMenu>
	</nav>
</template>

<script setup>
import {ref, watch, computed} from 'vue';

import {useAppStore} from '@/stores/appStore';
import {useSideMenu, compareUrlPaths} from '@/composables/useSideMenu.js';
import {useQueryParams} from '@/composables/useQueryParams';
import SideMenu from '../SideMenu/SideMenu.vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {DashboardPageTypes} from '@/pages/dashboard/dashboardConstants';

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

const appStore = useAppStore();

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
// The dashboard's search box, so we can tell when it's the highlighted item.
const searchMenuItem = dashboardsMenuItem?.items?.find(
	(item) => item.itemType === 'search',
);
if (dashboardsMenuItem) {
	watch(
		() => appStore.shouldReloadViewCountsEditorDashboard,
		(newVal) => {
			if (newVal) {
				fetchDashboardCount();
			}
		},
	);
	appStore.triggerReloadViewsCount(DashboardPageTypes.EDITORIAL_DASHBOARD);
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
	watch(
		() => appStore.shouldReloadViewCountsMySubmissions,
		(newVal) => {
			if (newVal) {
				fetchMySubmissionsCount();
			}
		},
	);
	appStore.triggerReloadViewsCount(DashboardPageTypes.MY_SUBMISSIONS);
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
	watch(
		() => appStore.shouldReloadViewCountsReviewAssignments,
		(newVal) => {
			if (newVal) {
				fetchReviewAssignmentCount();
			}
		},
	);
	appStore.triggerReloadViewsCount(DashboardPageTypes.MY_REVIEW_ASSIGNMENTS);
}

const ViewsWithAttentionBadge = ['reviewer-action-required', 'reviews-overdue'];

// helper to attach count to the menu item
function enrichMenuItemWithCounts(menuItems, page, itemsCount) {
	if (itemsCount.value) {
		const menuItem = menuItems.find((item) => item.key === page);
		if (menuItem) {
			const menuItemsEnriched = menuItem.items.map((item) => ({
				...item,
				badge: {
					slot: itemsCount.value[item.id],
					colorVariant: ViewsWithAttentionBadge.includes(item.id)
						? 'attention-bg'
						: 'primary',
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

const {sideMenuProps, setActiveItemKey} = useSideMenu(menuItemsEnriched, {
	activeItemKey: currentActiveKey,
	expandedKeys: getExpandedKeys(menuItems.value),
});

const queryParams = useQueryParams();

// Tracks the active menu item before a search is submitted, so it can be restored on clear.
let preSearchActiveKey = null;
let preSearchViewId = null;

/**
 * Run a search from the side nav. If the item points at the page we're already on, update the
 * query params in place (no reload); otherwise navigate to its page with the phrase.
 */
function onSearchSubmit(phrase, item) {
	const searchParam = item.searchParam || 'searchPhrase';

	if (!phrase) {
		// Clear button: remove the phrase and return to the view from before the search. The watch
		// below restores the active menu item once the view leaves search. Only clear when we're
		// actually on the search view - an empty submit from another view should do nothing.
		if (
			queryParams.currentViewId === 'search' &&
			compareUrlPaths(window.location.href, item.link)
		) {
			queryParams[searchParam] = undefined;
			queryParams.currentViewId = preSearchViewId ?? undefined;
			preSearchViewId = null;
		}
		return;
	}

	// Save the current view and active item before the search takes over.
	preSearchViewId = queryParams.currentViewId ?? null;
	preSearchActiveKey = sideMenuProps.value.activeItemKey;

	// Put the phrase in the item's own param (item.searchParam) - each search box uses a different
	// one, so they don't overwrite each other.
	const url = new URL(item.link);
	url.searchParams.set(searchParam, phrase);

	if (compareUrlPaths(window.location.href, item.link)) {
		// Same page - apply the target's params in place, no reload.
		const params = new URLSearchParams(url.search);
		for (const [key, value] of params) {
			queryParams[key] = value;
		}
	} else {
		window.location.href = url.toString();
	}
}

// When the search is cleared, restore the menu item that was active before the search - or the
// first dashboard view, when the search began on another page and there's nothing to restore.
watch(
	() => queryParams.currentViewId,
	(newViewId, oldViewId) => {
		if (oldViewId !== 'search' || newViewId === 'search') {
			return;
		}
		// Only act when the search box is still highlighted - clicking another menu item already
		// set its own highlight, so leave that alone.
		if (sideMenuProps.value.activeItemKey !== searchMenuItem?.key) {
			return;
		}
		const firstViewKey = dashboardsMenuItem?.items?.find(
			(item) => item.id,
		)?.key;
		setActiveItemKey(preSearchActiveKey ?? firstViewKey);
		preSearchActiveKey = null;
	},
);

watch(
	() => props.links,
	(newLinks) => {
		menuItems.value = convertLinksToArray(newLinks);
	},
);
</script>
