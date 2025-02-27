<template>
	<!-- Keeping pkpButton class as its used to customize button styling from other components
		Thats pattern we want to move away from, but keeping it now for backward compatibility.
	-->
	<component
		:is="element"
		class="pkpButton"
		type="button"
		:class="styles"
		:href="element === 'a' ? href : false"
		:disabled="element === 'a' && !isDisabled ? undefined : isDisabled"
		@focus="emit('focus')"
		@blur="emit('blur')"
	>
		<Icon v-if="icon" class="h-5 w-5" :icon="icon" aria-hidden="true" />
		<slot />
	</component>
</template>

<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	/** Whether to use a `button` or `a` HTML tag. */
	element: {
		type: String,
		default: 'button',
	},
	/** URL when using a link element. `element` must be set to `a` */
	href: String,
	/** Use when this button represents the default or expected action in a group of actions. A single group of actions should never have more than one primary button. */
	isPrimary: Boolean,
	/** Use when this button represents the default or expected action in a group of actions. A single group of actions should never have more than one primary button. */
	isSecondary: {type: Boolean, default: false, required: false},

	/** Use when this button represents an action such as delete, go back, revert or cancel. */
	isWarnable: Boolean,
	/** Use when the button controls another element, and that element is active. Think of it like an [On Air](https://www.google.co.uk/search?q=on+air+sign&tbm=isch) button. */
	isActive: Boolean,
	/** Use when you want the button to look more like a traditional link than a button. */
	isLink: Boolean,
	/** Icon name, always displayed on left */
	icon: {required: false, type: String, default: () => null},
	isDisabled: Boolean,
	sizeVariant: {
		required: false,
		type: String,
		default: () => 'default',
		validator: (prop) => ['default', 'compact', 'fullWidth'].includes(prop),
	},
});

// by default button was secondary, this is for backward compatibility
const isSecondary = computed(
	() =>
		props.isSecondary ||
		(!props.isSecondary &&
			!props.isPrimary &&
			!props.isWarnable &&
			!props.isActive),
);

const styles = computed(() => ({
	// Base
	'inline-flex relative items-center gap-x-1 ': true,
	// Button
	'text-lg-semibold': !props.isLink,
	// Link (adding border to keep dimensions consistent with button)
	'border-transparent hover:enabled:underline disabled:text-disabled text-lg-medium':
		props.isLink,
	// Primary colors
	'bg-primary border-transparent text-on-dark hover:bg-hover hover:text-on-dark disabled:bg-disabled disabled:text-disabled':
		props.isPrimary,
	// Secondary colors
	'text-primary border-light  hover:text-hover disabled:text-disabled ':
		isSecondary.value,
	// Warnable
	'text-negative border-light disabled:text-disabled': props.isWarnable,
	// Warnable & Secondary have white background when its not link
	'bg-secondary': (isSecondary.value || props.isWarnable) && !props.isLink,
	// Active
	'text-on-dark bg-selection-dark border-transparent': props.isActive,
	// Size Normal
	'py-[0.4375rem] px-3': props.sizeVariant === 'default',
	// Size Compact (in tables)
	'py-[0.1875rem] px-3': props.sizeVariant === 'compact',
	// Full Width (and rectangular border)
	'py-2 px-3 w-full ': props.sizeVariant === 'fullWidth',
	// Rounded borders  when button is not full width
	'border rounded': props.sizeVariant !== 'fullWidth',
}));

const emit = defineEmits([
	/** When the button receives focus. */
	'focus',
	/** When focus moves away from the button. */
	'blur',
]);
</script>
