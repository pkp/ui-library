<template>
	<button
		v-if="element === 'button'"
		class="pkpButton"
		:class="classes"
		:icon="icon"
		:isPrimary="isPrimary"
		:isWarnable="isWarnable"
		:isActive="isActive"
		:isLink="isLink"
		@click.prevent="click"
		@focus="focus"
		@blur="blur"
	>
		<icon v-if="icon" :icon="icon" :inline="!!label" />
		{{ label }}
	</button>
	<a
		v-else-if="element === 'a'"
		class="pkpButton"
		:class="classes"
		:href="href"
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
	</a>
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
		label: String,
		icon: String,
		isPrimary: Boolean,
		isWarnable: Boolean,
		isActive: Boolean,
		isLink: Boolean
	},
	computed: {
		classes: function() {
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
		click: function() {
			this.$emit('click');
		},
		focus: function() {
			this.$emit('focus');
		},
		blur: function() {
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

	&:hover,
	&:focus {
		color: @primary-lift;
	}

	&:disabled:hover {
		border-color: transparent;
	}
}

.pkpButton--isWarnable {
	color: @no;

	&:hover,
	&:focus {
		border-color: @no;
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
</style>
