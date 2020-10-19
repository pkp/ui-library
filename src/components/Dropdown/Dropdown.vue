<template>
	<div class="pkpDropdown">
		<pkp-button
			ref="button"
			:isActive="isActive"
			:isLink="isLink"
			:isPrimary="isPrimary"
			:isWarnable="isWarnable"
			:aria-describedby="ariaDescribedBy"
			:aria-controls="id"
			:aria-expanded="isOpen"
			@click="toggle"
			@blur="closeOnBlur"
		>
			<slot name="button">
				<icon v-if="icon" :icon="icon" :inline="true" />
				{{ label }}
			</slot>
		</pkp-button>
		<div
			v-if="isOpen"
			class="pkpDropdown__content"
			:id="id"
			@click="preserveFocus"
		>
			<slot />
		</div>
		<span v-if="isOpen" class="pkpDropdown__caret" />
	</div>
</template>

<script>
export default {
	props: {
		ariaDescribedBy: {
			type: String,
			default: ''
		},
		icon: {
			type: String,
			default: ''
		},
		label: {
			type: String,
			default: ''
		},
		isActive: {
			type: Boolean,
			default: false
		},
		isLink: {
			type: Boolean,
			default: false
		},
		isPrimary: {
			type: Boolean,
			default: false
		},
		isWarnable: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isOpen: false
		};
	},
	computed: {
		/**
		 * A unique id for the dropdown
		 */
		id() {
			return this._uid;
		}
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
		}
	}
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
