<template>
	<PanelMenu
		:expanded-keys="expandedKeys"
		:model="items"
		:pt="navigationStyling"
		class="w-72 overflow-y-auto border-e border-s border-light"
		:class="backgroundVariant"
		@update:expanded-keys="(...args) => emit('update:expandedKeys', ...args)"
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
					:icon="active ? 'Dropup' : 'Dropdown'"
				/>
			</a>
		</template>
	</PanelMenu>
</template>

<script setup>
import PanelMenu from 'primevue/panelmenu';
import Icon from '../Icon/Icon.vue';
import Badge from '../Badge/Badge.vue';
import {computed} from 'vue';

const props = defineProps({
	/**
	 * An array of item objects for the SideMenu.
	 * Each object should contain:
	 * - `label` (string, required): The label of the menu item.
	 * - `key` (string, required): A unique key for each item.
	 * - `link` (string, optional): The URL to navigate to when the item is clicked.
	 * - `action` (string, optional): A function to be executed when the item is clicked.
	 * - `actionArgs` (object, optional): An object to be passed as function arguments when the `item.action` is emitted.
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
				const hasKey = typeof item.key === 'string' && item.key.trim() !== '';
				const validItem = item.link || item.action || item.items;
				return hasLabel && hasKey && validItem;
			});
		},
	},
	/**
	 * An object of keys from the SideMenu items that should be expanded by default.
	 * Example: { key1: true, key1_1: true }
	 */
	expandedKeys: {
		type: Object,
		default: () => {},
	},
	/**
	 * The item key that should be set to active by default.
	 */
	activeItemKey: {
		type: String,
		required: true,
		validator: (value) => !!value,
	},
	/**
	 * The background class that should be used for the SideMenu.
	 * See the [list of background classes](../?path=/docs/guide-style-colors--docs) available for use.
	 * Default: 'bg-tertiary'
	 */
	backgroundVariant: {
		type: String,
		default: 'bg-tertiary',
	},
});

const emit = defineEmits([
	/** When a panel menu item's "action" is clicked */
	'action',
	/** When the item with link is clicked */
	'update:activeItemKey',
	/** When the expandedKeys gets updated by the PanelMenu */
	'update:expandedKeys',
]);

// Maps the level attributes which are necessary to render the nested menu
function mapItems(_items, level = 1) {
	const result = [];

	_items.forEach((_item) => {
		const item = {
			..._item,
			level,
		};

		if (_item.items) {
			item.items = mapItems(_item.items, level + 1);
		}

		result.push(item);
	});

	return result;
}

const items = computed(() => mapItems(props.items));

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
	if (item.action) {
		emit('action', item.action, {...item.actionArgs, key: item.key});
	}

	if (!item.items) {
		emit('update:activeItemKey', item.key);
	}
}

function isActive(item) {
	const currentActiveKey = props.activeItemKey;
	return currentActiveKey && currentActiveKey === item?.key;
}

function getButtonStyles(item) {
	const isActiveItem = isActive(item);

	const style = {
		// Base
		'inline-flex relative items-center gap-x-1 text-lg-medium py-2 px-3 w-full border-b border-b-light cursor-pointer': true,
		// Default button styling
		'text-primary border-light hover:text-hover disabled:text-disabled':
			!isActiveItem,
		backgroundVariant: !isActiveItem,
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
		// Items with children
		'!text-lg-bold': item.items && item.level === 1,
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

/* Override legacy styles for: a:hover, a:focus, where the color is being set to #008acb */
a.text-on-dark:hover,
a.text-on-dark:focus,
a.text-on-dark:active {
	color: rgb(255 255 255 / var(--tw-text-opacity));
}
</style>
