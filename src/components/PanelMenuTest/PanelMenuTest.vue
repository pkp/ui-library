<template>
	<div class="card flex justify-center">
		<PanelMenu :model="props.items" class="w-full md:w-80" :pt="laraStyling">
			<template #item="{item}">
				<a class="group flex cursor-pointer items-center px-4 py-2">
					<span :class="[item.icon, 'group-hover:text-inherit text-primary']" />
					<span :class="['ml-2', {'font-semibold': item.items}]">
						{{ item.label }}
					</span>
					<span
						v-if="item.shortcut"
						class="border-surface bg-emphasis text-muted-color text-xs ml-auto rounded border p-1"
					>
						{{ item.shortcut }}
					</span>
				</a>
			</template>
		</PanelMenu>
	</div>
</template>

<script setup>
import PanelMenu from 'primevue/panelmenu';

const props = defineProps({
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
});

const laraStyling = {
	panel: {
		class: 'mb-1',
	},
	header: {
		class: [
			'rounded-md',
			'outline-none',
			'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50',
		],
	},
	headerContent: ({context, instance}) => {
		var _a, _b;
		return {
			class: [
				// Shape
				'rounded-t-md',
				{
					'rounded-br-md rounded-bl-md':
						!context.active ||
						((_a = instance.activeItem) == null ? void 0 : _a.items) === void 0,
					'rounded-br-0 rounded-bl-0':
						context.active &&
						((_b = instance.activeItem) == null ? void 0 : _b.items) !== void 0,
				},
				// Color
				'border border-surface-200 dark:border-surface-700',
				'bg-surface-50 dark:bg-surface-800',
				'text-surface-600 dark:text-surface-0/80',
				{'text-surface-900': context.active},
				// States
				'hover:bg-surface-100 dark:hover:bg-surface-700',
				'hover:text-surface-900',
				// Transition
				'transition duration-200 ease-in-out',
				'transition-shadow duration-200',
			],
		};
	},
	headerLink: {
		class: [
			'relative',
			'font-bold',
			'leading-none',
			'flex items-center',
			'p-5',
			'select-none cursor-pointer no-underline',
		],
	},
	headerLabel: {
		class: 'leading-none',
	},
	headerIcon: {
		class: 'mr-2',
	},
	submenuIcon: {
		class: 'mr-2',
	},
	content: {
		class: [
			'py-2',
			'border border-t-0',
			'rounded-t-none rounded-br-md rounded-bl-md',
			'text-surface-700 dark:text-white/80',
			'bg-surface-0 dark:bg-surface-800',
			'border-surface-200 dark:border-surface-700',
		],
	},
	rootList: {
		class: ['outline-none', 'm-0 p-0 list-none'],
	},
	itemContent: {
		class: [
			'border-none rounded-none',
			'text-surface-700 dark:text-white/80',
			'transition-shadow duration-200',
		],
	},
	itemLink: ({context}) => ({
		class: [
			'relative',
			// Font
			'leading-none',
			// Flex & Alignments
			'flex items-center',
			// Spacing
			'py-3 px-5',
			// Color
			'text-surface-700 dark:text-white/80',
			// States
			'hover:bg-surface-100 dark:hover:bg-surface-700/80 hover:text-surface-700 dark:hover:text-white/80',
			{
				'bg-surface-200 text-surface-700 dark:text-white/80 dark:bg-surface-600/90':
					context.focused,
			},
			// Misc
			'cursor-pointer no-underline',
			'select-none overflow-hidden',
		],
	}),
	itemIcon: {
		class: 'mr-2',
	},
	submenu: {
		class: 'p-0 pl-4 m-0 list-none',
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

/* eslint-disable no-unused-vars */
const auraStyling = {
	panel: {
		class:
			'p-1 overflow-hidden mb-3 border border-surface-200 dark:border-surface-700 rounded-md',
	},
	header: {
		class: ['rounded-[4px]', 'outline-none'],
	},
	headerContent: ({context}) => ({
		class: [
			// Shape
			'rounded-[4px]',
			// Color
			'bg-surface-0 dark:bg-surface-900',
			'text-surface-600 dark:text-surface-0/80',
			{'text-surface-900': context.active},
			// States
			'hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)]',
			'hover:text-surface-900',
			// Transition
			'transition duration-200 ease-in-out',
			'transition-shadow duration-200',
		],
	}),
	headerLink: {
		class: [
			'relative',
			'font-semibold',
			'leading-none',
			'flex items-center',
			'py-2 px-3',
			'select-none cursor-pointer no-underline',
		],
	},
	headerLabel: {
		class: 'leading-none',
	},
	headerIcon: {
		class: 'mr-2',
	},
	submenuIcon: {
		class: 'mr-2',
	},
	content: {
		class: [
			'pl-4',
			'text-surface-700 dark:text-white/80',
			'bg-surface-0 dark:bg-surface-900',
		],
	},
	rootList: {
		class: ['outline-none', 'm-0 p-0 list-none'],
	},
	menuitem: {
		class: 'relative my-[2px]',
	},
	itemContent: {
		class: [
			'border-none rounded-[4px]',
			'text-surface-700 dark:text-white/80',
			'transition-shadow duration-200',
		],
	},
	itemLink: ({context}) => ({
		class: [
			'relative',
			// Font
			'leading-none',
			// Flex & Alignments
			'flex items-center',
			// Spacing
			'py-2 px-3',
			// Shape
			'rounded-[4px]',
			// Color
			'text-surface-700 dark:text-white/80',
			// States
			'hover:bg-surface-100 dark:hover:bg-[rgba(255,255,255,0.03)] hover:text-surface-700 dark:hover:text-white/80',
			{
				'bg-surface-200 text-surface-700 dark:text-white/80 dark:bg-surface-0/10':
					context.focused,
			},
			// Misc
			'cursor-pointer no-underline',
			'select-none overflow-hidden',
		],
	}),
	itemIcon: {
		class: 'mr-2',
	},
	submenu: {
		class: 'p-0 pl-4 m-0 list-none',
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
</script>
