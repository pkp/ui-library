<template>
	<nav
		v-if="Object.keys(links).length"
		class="sticky top-12 flex h-[calc(100vh-3rem)] flex-none"
		:aria-label="ariaLabel"
	>
		<SideMenu
			v-bind="sideMenuProps"
			:items="items"
			background-variant="bg-secondary"
		></SideMenu>
	</nav>
</template>

<script setup>
import {reactive} from 'vue';
import {useSideMenu} from '@/composables/useSideMenu.js';
import SideMenu from '../SideMenu/SideMenu.vue';

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
const items = reactive(convertLinksToArray(props.links));

function convertLinksToArray(links, level = 1) {
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
			item.items = convertLinksToArray(link.submenu, level + 1);
		}

		if (link.isCurrent) {
			currentActiveKey = key;
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

const {sideMenuProps} = useSideMenu(currentActiveKey, getExpandedKeys(items));
</script>
