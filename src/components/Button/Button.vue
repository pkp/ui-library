<template>
	<component
		:is="element"
		:class="styles"
		:href="element === 'a' ? href : false"
		:disabled="element === 'a' ? undefined : isDisabled"
		@click="click"
		@focus="emit('focus')"
		@blur="emit('blur')"
	>
		<slot />
	</component>
</template>

<script setup>
import {defineProps, defineEmits, computed} from 'vue';

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
	isDisabled: Boolean,
	/** useful in tables for example */
	isCompact: {type: Boolean, default: false, required: false},
	// to fill whole space and become rectangular (used in submission when listing Views)
	isFullWidth: {type: Boolean, default: false, required: false},
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

function click(e) {
	if (props.element === 'button') {
		e.preventDefault();
	}
}

const styles = computed(() => ({
	// Base
	'inline-flex relative items-center gap-x-1 text-lg-semibold': true,
	// Button
	'': !props.isLink,
	// Link (adding border to keep dimensions consistent with button)
	'border-transparent': props.isLink,
	// Primary colors
	'bg-primary border-primary text-lightest': props.isPrimary,
	// Secondary colors
	'border-medium text-primary': isSecondary.value,
	// Warnable
	'text-action-negative': props.isWarnable,
	// Active
	'text-lightest bg-dark border-dark': props.isActive,
	// Size Normal
	'py-2 px-3': !props.isCompact,
	// Size Compact (in tables)
	'py-[0.1875rem] px-3': props.isCompact,
	// Full Width (and rectangular border)
	'w-full': props.isFullWidth,
	// Rounded borders  when button is not full width
	'border rounded': !props.isFullWidth,
}));

/*const classes = computed(() => {
	let classes = [];

	// common classes
	/*classes.push(
		'inline-block min-w-[2rem] border text-center text-sm-bold leading-8 no-underline',
	);

	if (this.isPrimary || this.isActive) {
		classes.push('bg-primary border-primary text-color-lightest');
	}*/
/*
	if (props.isPrimary) {
		classes.push('pkpButton--isPrimary');
	}
	if (props.isWarnable) {
		classes.push('pkpButton--isWarnable');
	}
	if (props.isActive) {
		classes.push('pkpButton--isActive');
	}
	if (props.isLink) {
		classes.push('pkpButton--isLink');
	}
	return classes;
});*/

const emit = defineEmits([
	/** When the button receives focus. */
	'focus',
	/** When focus moves away from the button. */
	'blur',
]);
</script>

<style lang="less">
@import '../../styles/_import';

.pkpButton {
	display: inline-block; /* */
	align-items: center;
	padding: 0 0.5em;
	min-width: 2.13rem; /**/ // Always at least as wide as it is tall
	background: #fff;
	border: @bg-border-light;
	border-radius: @radius; /* */
	text-align: center; /** */
	font-size: @font-sml; /** */
	line-height: 2rem; /** */
	font-weight: @semibold; /** */
	color: @primary;
	text-decoration: none;
	box-shadow: 0 1px 0 @bg-border-color-light; /** */
	cursor: pointer; /** */

	&:hover {
		color: @primary;
		border-color: @primary;
	}

	&:focus-visible {
		color: @primary;
		border-color: @primary;
		outline: 1px solid @primary;
	}
}

/**
 * Variations
 */
.pkpButton--isPrimary {
	color: #fff;
	background: @primary;
	border-color: @primary;
	box-shadow: 0 1px 0 @primary;

	&:hover,
	&:focus-visible {
		background: @primary-lift;
		color: #fff;
	}
}

.pkpButton--isLink {
	padding: 0;
	box-shadow: none;
	border-color: transparent;
	background: transparent;

	&:hover {
		color: @primary-lift;
		border-color: transparent;
	}
}

.pkpButton--isWarnable {
	color: @no;

	&:hover,
	&:focus-visible {
		border-color: @no;
		color: @no;
	}
}

/**
 * State modifiers
 */
.pkpButton--isActive {
	background: @primary;
	border-color: @primary;
	color: #fff;
	box-shadow: 0 1px 0 @primary;

	&:hover,
	&:focus-visible {
		background: @primary-lift;
		color: #fff;
	}
}

.pkpButton:disabled {
	color: @text-disabled;
	border-color: @bg-border-color-light;
	background: #fff;
	outline: none;
	box-shadow: none;

	&:hover,
	&:focus-visible {
		cursor: not-allowed;
		outline: none;
		box-shadow: none;
	}
}

.pkpButton--isLink:disabled {
	border-color: transparent;
}
</style>
