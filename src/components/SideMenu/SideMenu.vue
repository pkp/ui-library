<template>
	<PanelMenu
		v-model:expandedKeys="expandedKeys"
		:model="items"
		:pt="navigationStyling"
		class="w-max min-w-60 overflow-y-auto border-e border-s border-light bg-secondary"
	>
		<template #item="{item, active, hasSubmenu}">
			<a
				:class="getButtonStyles(item)"
				:href="item.link"
				tabindex="-1"
				@click="handleClick(item)"
			>
				<Badge
					v-if="item.badge?.slot"
					:color-variant="
						isActive(item) && !item.badge.isWarnable ? 'default-on-dark' : null
					"
					v-bind="item.badge"
					class="me-1"
				>
					{{ item.badge.slot }}
				</Badge>
				<Icon v-if="item.icon" class="h-5 w-5" :icon="item.icon" />
				{{ item.label }}
				<Icon
					v-if="hasSubmenu"
					class="h-4 w-4 ltr:ml-auto rtl:mr-auto"
					:icon="active ? 'caret-up' : 'Dropdown'"
				/>
			</a>
		</template>
	</PanelMenu>
</template>

<script setup>
import PanelMenu from 'primevue/panelmenu';
import Icon from '../Icon/Icon.vue';
import Badge from '../Badge/Badge.vue';
import {ref, reactive} from 'vue';

const props = defineProps({
	/**
	 * An array of item objects for the SideMenu.
	 * Each object should contain:
	 * - `label` (string): The label of the menu item.
	 * - `link` (string, optional): The URL to navigate to when the item is clicked.
	 * - `action` (function, optional): A function to be executed when the item is clicked.
	 * - `isCurrent` (boolean, optional): Marks the item as the current selection.
	 * - `isOpen` (boolean, optional): Identifies if the menu should be expanded.
	 * - `badge` (object, optional): Contains `slot` (string) and other props for `<Badge>` customization.
	 * - `colorStripe` (string, optional): A border class to add a color stripe to the item.
	 * - `items` (array, optional): An array of child items for nested menus.
	 */
	items: {
		type: Array,
		required: true,
		validator: (items) => {
			return items.every((item) => {
				const hasLabel =
					typeof item.label === 'string' && item.label.trim() !== '';
				const validItem = item.link || item.action || item.items;
				return hasLabel && validItem;
			});
		},
	},
});

const emit = defineEmits([
	/** When a panel menu item's "action" is clicked */
	'action',
]);

const activeItemKey = ref('');

// Maps the key and level attributes which are necessary to render the nested menu
function mapItems(_items, level = 1, _key) {
	const result = [];

	_items.forEach((_item, index) => {
		const key = _key ? `${_key}_${index}` : `item_${index}`;
		const item = {
			..._item,
			key,
			level,
		};

		if (_item.items) {
			item.items = mapItems(_item.items, level + 1, key);
		}

		if (item.isCurrent) {
			activeItemKey.value = key;
		}

		result.push(item);
	});

	return result;
}

const items = reactive(mapItems(props.items));

// Defines the list of expanded keys, so it renders correctly when the component loads
function getExpandedKeys(items) {
	const _expandedKeys = {};

	function markExpanded(items) {
		let found = false;
		for (const item of items) {
			if (item.isCurrent || item.isOpen) {
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

const expandedKeys = ref(getExpandedKeys(items));

const navigationStyling = {
	headerContent: () => {
		return {
			class: [
				// Transition
				'transition duration-200 ease-in-out',
				'transition-shadow duration-200',
			],
		};
	},
	itemContent: {
		class: ['transition-shadow duration-200'],
	},
	transition: {
		enterFromClass: 'max-h-0',
		enterActiveClass:
			'overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.42,0,0.58,1)]',
		enterToClass: 'max-h-[1000px]',
		leaveFromClass: 'max-h-[1000px]',
		leaveActiveClass:
			'overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0,1,0,1)]',
		leaveToClass: 'max-h-0',
	},
};

function handleClick(item) {
	// set the current active item key
	activeItemKey.value = item.key;

	if (item.action) {
		emit('action', item.action);
	}
}

function isActive(item) {
	return item?.key === activeItemKey.value;
}

function getButtonStyles(item) {
	const isActiveItem = isActive(item);

	const style = {
		// Base
		'inline-flex relative items-center gap-x-1 text-lg-semibold py-2 px-3 w-full border-b border-b-light': true,
		// Default button styling
		'text-primary border-light  hover:text-hover disabled:text-disabled bg-secondary':
			!isActiveItem,
		// Active
		'text-on-dark bg-selection-dark': isActiveItem,
		'border-transparent': isActiveItem && !item.colorStripe,
		// Indentions for child menus
		'!px-7': item.level === 2 && item.colorStripe,
		'!px-9': item.level === 2 && !item.colorStripe,
		'!px-10': item.level === 3 && item.colorStripe,
		'!px-12': item.level === 3 && !item.colorStripe,
		'!px-14': item.level === 4 && item.colorStripe,
		'!px-16': item.level === 4 && !item.colorStripe,
		// Additional border styling
		'border-t border-t-light': item.key === 'item_0',
		'border-s-8': item.colorStripe,
	};

	// set the additional class if the button should include a color stripe
	if (item.colorStripe) {
		style[item.colorStripe] = true;
	}

	return style;
}
</script>

<style lang="less" scoped>
@import '../../styles/_import';

a.text-on-dark:hover,
a.text-on-dark:focus,
a.text-on-dark:active {
	color: rgb(255 255 255 / var(--tw-text-opacity));
}
</style>
