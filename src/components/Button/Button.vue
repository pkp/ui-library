<template>
	<component
		:is="element"
		class="pkpButton"
		:class="classes"
		:href="element === 'a' ? href : false"
		:disabled="isDisabled"
		@click="click"
		@focus="$emit('focus')"
		@blur="$emit('blur')"
	>
		<slot />
	</component>
</template>

<script>
export default {
	name: 'pkpButton',
	props: {
		element: {
			type: String,
			default: 'button'
		},
		href: String,
		isPrimary: Boolean,
		isWarnable: Boolean,
		isActive: Boolean,
		isLink: Boolean,
		isDisabled: Boolean
	},
	computed: {
		classes() {
			let classes = [];
			if (this.isPrimary) {
				classes.push('pkpButton--isPrimary');
			}
			if (this.isWarnable) {
				classes.push('pkpButton--isWarnable');
			}
			if (this.isActive) {
				classes.push('pkpButton--isActive');
			}
			if (this.isLink) {
				classes.push('pkpButton--isLink');
			}
			return classes;
		}
	},
	methods: {
		click(e) {
			if (this.element === 'button') {
				e.preventDefault();
			}
			this.$emit('click');
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpButton {
	display: inline-block;
	padding: 0 0.5em;
	min-width: 2.13rem; // Always at least as wide as it is tall
	background: #fff;
	border: @bg-border-light;
	border-radius: @radius;
	text-align: center;
	font-size: @font-sml;
	line-height: 2rem;
	font-weight: @bold;
	color: @primary;
	text-decoration: none;
	box-shadow: 0 1px 0 @bg-border-color-light;
	cursor: pointer;

	&:hover {
		color: @primary;
		border-color: @primary;
	}

	&:focus {
		color: @primary;
		border-color: @primary;
		outline: 1px solid @primary;
	}

	&:active {
		box-shadow: 0 0 2px;
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
	&:focus {
		background: @primary-lift;
		color: #fff;
	}
}

.pkpButton--isLink {
	box-shadow: none;
	border-color: transparent;
}

.pkpButton--isWarnable {
	color: @no;

	&:hover,
	&:focus {
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
	&:focus {
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
	&:focus {
		cursor: not-allowed;
		outline: none;
		box-shadow: none;
	}
}
</style>
