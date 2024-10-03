<template>
	<PanelMenu
		:expanded-keys="expandedKeys"
		:model="items"
		:pt="navigationStyling"
		class="w-72 overflow-y-auto border-e border-s border-light"
		:class="backgroundVariant"
		@update:expanded-keys="(...args) => emit('update:expandedKeys', ...args)"
	>
		<template #item="{item, active, hasSubmenu, props: itemProps}">
			<a
				:class="getButtonStyles(item, itemProps.action?.isFocused)"
				v-bind="itemProps.action"
				:href="item.link || '#'"
				tabindex="-1"
				@click.prevent="() => {}"
			>
				<Badge
					v-if="item.badge?.slot != null"
					:color-variant="item.badge.colorVariant || 'primary'"
					v-bind="item.badge"
					class="me-1"
				>
					{{ item.badge.slot }}
				</Badge>
				<Icon v-if="item.icon" class="h-5 w-5" :icon="item.icon" />
				<span>{{ item.label }}</span>
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
	/** When the expandedKeys gets updated by the PanelMenu */
	'update:expandedKeys',
]);

const navigationStyling = {
	header: {
		class: ['focus-visible:outline-none focus-visible:bg-hover'],
	},
	headerContent: () => {
		return {
			class: [
				// Transition
				'transition duration-200 ease-in-out',
				'transition-shadow duration-200',
			],
		};
	},
	rootlist: {
		class: ['focus-visible:outline-none'],
	},
	itemLink: ({context}) => {
		return {
			isFocused: context.focused,
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

function isActive(item) {
	const currentActiveKey = props.activeItemKey;
	return currentActiveKey && currentActiveKey === item?.key;
}

function getButtonStyles(item, isFocused) {
	const isActiveItem = isActive(item);

	const style = {
		// Base
		'inline-flex relative items-center gap-x-1 text-lg-medium py-2 px-3 w-full cursor-pointer': true,

		// Default button styling
		'text-primary hover:text-hover disabled:text-disabled hover:bg-hover hover:text-on-dark':
			!isActiveItem,
		backgroundVariant: !isActiveItem,

		// Active
		'text-on-dark bg-selection-dark': isActiveItem,

		// Indentions for child menus
		'!px-7': item.level === 2 && item.colorStripe,
		'!px-9': item.level === 2 && !item.colorStripe,
		'!px-10': item.level === 3 && item.colorStripe,
		'!px-12': item.level === 3 && !item.colorStripe,
		'!px-14': item.level === 4 && item.colorStripe,
		'!px-16': item.level === 4 && !item.colorStripe,

		// Border
		'border-b border-b-light': true,
		'border-transparent': isActiveItem && !item.colorStripe,
		'border-t border-t-light': item.index === 0 && item.level === 1,
		'!border-s-8': !!item.colorStripe,

		// Outline (focus)
		'bg-hover !text-on-dark': isFocused && !isActiveItem,

		// Root items with submenu
		'!text-lg-bold': item.level === 1,
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

/* In this case we need to set the font-color of the <a data-pc-section="itemlink"> if the current focus is in the <div data-pc-section="header"> */
div[data-pc-section='header']:focus-visible a {
	@apply text-on-dark;
}
</style>
