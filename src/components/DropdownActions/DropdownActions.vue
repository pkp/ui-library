<template>
	<div
		class="relative inline-block items-start justify-between"
		:class="{'leading-none': displayAsEllipsis}"
	>
		<Menu as="div">
			<MenuButton
				:class="menuButtonStyle"
				:aria-label="displayAsEllipsis ? label : ariaLabel"
			>
				<span v-if="!displayAsEllipsis">{{ label }}</span>
				<Icon
					v-if="buttonVariant === 'dropdown'"
					class="h-5 w-5 text-primary"
					icon="Dropdown"
					aria-hidden="true"
				/>
				<Icon
					v-else-if="displayAsEllipsis"
					class="h-6 w-6"
					icon="MoreOptions"
					aria-hidden="true"
				/>
			</MenuButton>

			<transition
				enter-active-class="transition ease-out duration-100"
				enter-from-class="transform opacity-0 scale-95"
				enter-to-class="transform opacity-100 scale-100"
				leave-active-class="transition ease-in duration-75"
				leave-from-class="transform opacity-100 scale-100"
				leave-to-class="transform opacity-0 scale-95"
			>
				<MenuItems
					class="absolute z-10 w-max border border-light bg-secondary shadow focus:outline-none"
					:class="
						direction === 'right'
							? 'ltr:left-0 ltr:origin-top-left rtl:right-0 rtl:origin-top-left'
							: 'ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-right'
					"
				>
					<MenuItem
						v-for="(action, i) in actions"
						:key="i"
						v-slot="{active, close}"
						:disabled="action.disabled || false"
					>
						<div class="min-w-[96px]">
							<PkpButton
								v-if="isValidAction(action)"
								:element="action.url ? 'a' : 'button'"
								:href="action.url"
								:icon="action.icon"
								:is-active="active"
								:is-warnable="action.isWarnable"
								:class="i !== actions.length - 1 ? 'border-b' : ''"
								size-variant="fullWidth"
								:is-disabled="action.disabled || false"
								class="border-light"
								@click="
									() => {
										emitAction(action);
										close();
									}
								"
							>
								{{ action.label }}
							</PkpButton>
						</div>
					</MenuItem>
				</MenuItems>
			</transition>
		</Menu>
	</div>
</template>

<script setup>
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import {computed} from 'vue';

const props = defineProps({
	/**
	 * An array of action objects.
	 * Each object should contain
	 * 	`label` (string),
	 * 	`url` (string) to navigate to if the action involves a link, or
	 * 	`name` (string) to perform the action when clicked, an optional
	 * 	`icon` (string) and
	 * 	`isWarnable` (boolean) if the button needs the "warning" button styling from `<Button>` component.
	 *  `disabled` (boolean) when the item is not available
	 *  `actionFn` (function) its possible to provide action function directly to be triggered instead of the emit, useful for plugins
	 * */
	actions: {
		type: Array,
		required: true,
		validator: (actions) => {
			return actions.every((action) => {
				const hasLabel =
					typeof action.label === 'string' && action.label.trim() !== '';
				const hasAction = action.url || action.name;
				return hasLabel && hasAction;
			});
		},
	},
	/** Arguments that are passed as second argument to the emit */
	actionArgs: {
		type: Object,
		required: false,
		default: () => null,
	},
	/** The text label for the button. This is required. If buttonVariant is `ellipsis`, the label will be used for accessibility. */
	label: {
		type: String,
		required: true,
	},
	/** Defines the type of button used to display the options. Accepted values are: 'dropdown', 'ellipsis', or 'text'. */
	buttonVariant: {
		type: String,
		default: 'dropdown',
		validator: (val) => ['dropdown', 'ellipsis', 'text'].includes(val),
	},
	/** The accessible label for the button, used by screen readers. This is optional. */
	ariaLabel: {
		type: String,
		default: '',
	},
	/** This specifies where the dropdown appears relative to the element, such as "left" or "right." */
	direction: {
		type: String,
		default: 'left',
		validator: (direction) => ['left', 'right'].includes(direction),
	},
});

const displayAsEllipsis = computed(() => props.buttonVariant === 'ellipsis');

const emit = defineEmits([
	/** When a button is clicked from the dropdown menu */
	'action',
]);

const emitAction = (action) => {
	if (action.actionFn) {
		action.actionFn(props?.actionArgs);
	} else if (action.name) {
		emit('action', action.name, props?.actionArgs || {});
	}
};

const menuButtonStyle = computed(() => ({
	// Base
	'w-full justify-center': true,
	// Default: "dropdown" button type
	'inline-flex rounded border border-light bg-secondary px-3 py-2 text-lg-normal gap-x-1.5':
		props.buttonVariant === 'dropdown',
	// "text" button type
	'text-primary hover:text-hover mb-1': props.buttonVariant === 'text',
	// Ellipsis Menu
	'leading-none rounded hover:text-on-dark hover:bg-hover':
		displayAsEllipsis.value,
}));

const isValidAction = (action) => {
	return action?.label && (action?.url || action?.name);
};
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
