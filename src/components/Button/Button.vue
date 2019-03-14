<template>
	<component
		:is="element"
		class="pkpButton"
		:class="classes"
		:href="element === 'a' ? href : false"
		:icon="icon"
		:isPrimary="isPrimary"
		:isWarnable="isWarnable"
		:isActive="isActive"
		:isLink="isLink"
		@click="click"
		@focus="focus"
		@blur="blur"
	>
		<icon v-if="icon" :icon="icon" :inline="!!label" />
		{{ label }}
	</component>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'pkpButton',
	components: {
		Icon
	},
	props: {
		element: {
			type: String,
			default: 'button'
		},
		href: String,
		label: [String, Number],
		icon: String,
		isPrimary: Boolean,
		isWarnable: Boolean,
		isActive: Boolean,
		isLink: Boolean
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
		click: function(e) {
			if (this.element === 'button') {
				e.preventDefault();
			}
			this.$emit('click');
		},
		focus() {
			this.$emit('focus');
		},
		blur() {
			this.$emit('blur');
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpButton {
	display: inline-block;
	padding: 0 0.5em;
	background: #fff;
	border: @bg-border-light;
	border-radius: @radius;
	font-size: @font-sml;
	line-height: @double;
	font-weight: @bold;
	color: @primary;
	text-decoration: none;
	box-shadow: 0 1px 0 @bg-border-color-light;
	cursor: pointer;

	&:hover,
	&:focus {
		color: @primary;
		border-color: @primary;
		outline: 0;
	}

	.fa {
		margin-right: 0.25em;
	}

	&:disabled {
		color: @text-disabled;

		&:hover {
			color: @text-disabled;
			border-color: @bg-border-color-light;
			cursor: not-allowed;
		}
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

	&:disabled,
	&:disabled:hover {
		color: #fff;
		background: @bg-dark;
		border-color: @bg-dark;
		box-shadow: 0 1px 0 @shade;
		cursor: not-allowed;
	}
}

.pkpButton--isLink {
	box-shadow: none;
	border-color: transparent;

	&:disabled:hover {
		border-color: transparent;
	}
}

.pkpButton--isWarnable {
	color: @no;

	&:hover,
	&:focus {
		border-color: @no;
		color: @no;
	}

	&:disabled,
	&:disabled:hover {
		color: #fff;
		background: @bg-dark;
		border-color: @bg-dark;
		box-shadow: 0 1px 0 @shade;
		cursor: not-allowed;
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

	&:disabled,
	&:disabled:hover {
		color: #fff;
		background: @bg-dark;
		border-color: @bg-dark;
		box-shadow: 0 1px 0 @shade;
		cursor: not-allowed;
	}
}

.pkpButton:disabled {
	color: @text-light;
	background: #fff;
	&:hover,
	&:focus {
		cursor: not-allowed;
		border-color: @bg-border-color;
	}
}
</style>
