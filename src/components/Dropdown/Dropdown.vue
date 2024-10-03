<template>
	<div class="pkpDropdown">
		<PkpButton
			ref="button"
			:is-active="isActive"
			:is-link="isLink"
			:is-primary="isPrimary"
			:is-warnable="isWarnable"
			:aria-describedby="ariaDescribedBy"
			:aria-controls="id"
			:aria-expanded="isOpen"
			@click="toggle"
			@blur="closeOnBlur"
		>
			<slot name="button">
				<Icon v-if="icon" :icon="icon" :inline="true" />
				{{ label }}
				<Icon
					v-if="hasDropdownIcon"
					class="-mr-1 h-5 w-5 text-primary"
					icon="Dropdown"
					aria-hidden="true"
				/>
			</slot>
		</PkpButton>
		<div
			v-if="isOpen"
			:id="id"
			class="pkpDropdown__content"
			@click="preserveFocus"
		>
			<slot />
		</div>
		<span v-if="isOpen" class="pkpDropdown__caret" />
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {PkpButton, Icon},
	props: {
		/** An optional `id` of one or more elements which describe this dropdown.
		 * It will be applied to the `<button>` in the dropdown. Optional */
		ariaDescribedBy: {
			type: String,
			default: '',
		},
		/** See **Button** props */
		icon: {
			type: String,
			default: '',
		},
		/** See **Button** props */
		label: {
			type: String,
			default: '',
		},
		/** See **Button** props */
		isActive: {
			type: Boolean,
			default: false,
		},
		/** See **Button** props */
		isLink: {
			type: Boolean,
			default: false,
		},
		/** See **Button** props */
		isPrimary: {
			type: Boolean,
			default: false,
		},
		/** See **Button** props */
		isWarnable: {
			type: Boolean,
			default: false,
		},
		hasDropdownIcon: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			isOpen: false,
		};
	},
	computed: {
		/**
		 * A unique id for the dropdown
		 */
		id() {
			return this._uid;
		},
	},
	methods: {
		/**
		 *
		 */
		preserveFocus(e) {
			// If the active element is the body, then focus was probably
			// dropped due to a click on a non-focusable id. This is usually
			// a mis-click so we reset the focus to the button to keep the
			// dropdown open
			if (document.activeElement === document.body) {
				this.$refs.button.$el.focus();
			}
		},

		/**
		 * Open and close the dropdown
		 */
		toggle() {
			this.isOpen = !this.isOpen;
		},

		/**
		 * Close the dropdown when it loses focus
		 */
		closeOnBlur() {
			setTimeout(() => {
				if (this.$el.contains(document.activeElement)) {
					var interval = setInterval(() => {
						if (!this.$el.contains(document.activeElement)) {
							this.isOpen = false;
							window.clearInterval(interval);
						}
					}, 1000);
				} else {
					this.isOpen = false;
				}
			}, 100);
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpDropdown {
	position: relative;
	display: inline-block;
}

.pkpDropdown__content {
	position: absolute;
	top: 100%;
	margin-top: 10px;
	min-width: 100%;
	max-width: 20em;
	border: @bg-border-light;
	border-radius: @radius;
	padding: 0.5rem;
	background: @lift;
	box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.3);
	font-size: @font-sml;
	line-height: 1.5rem;
	z-index: 9999;

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
}

.pkpDropdown__section {
	margin-left: -0.5rem;
	margin-right: -0.5rem;
	padding-left: 0.5rem;
	padding-right: 0.5rem;

	&:not(:first-child) {
		padding-top: 0.5rem;
	}

	&:not(:last-child) {
		border-bottom: @grid-border;
		padding-bottom: 0.5rem;
	}
}

.pkpDropdown__action {
	display: block;
	padding: 0.25rem 0.5rem;
	max-width: 100%;
	border: none;
	background: transparent;
	line-height: 1.5rem;
	color: @primary;
	text-decoration: none;
	border: 1px solid transparent;
	border-radius: @radius;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	&:hover,
	&:focus {
		border-color: @primary;
		outline: 0;
	}

	&[disabled] {
		border-color: transparent;
		color: @text-light;
	}
}

.pkpDropdown__caret {
	content: '';
	position: absolute;
	top: 100%;
	left: 50%;
	margin-top: 10px;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	border-bottom: 10px solid @lift;
	transform: translateX(-50%) translateY(-9px);
	z-index: 9999;
}
</style>
