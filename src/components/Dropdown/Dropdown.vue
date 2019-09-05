<template>
	<div class="pkpDropdown">
		<pkp-button
			:label="label"
			:icon="icon"
			:isActive="isActive"
			:isLink="isLink"
			:isPrimary="isPrimary"
			:isWarnable="isWarnable"
			:aria-controls="id"
			:aria-expanded="isOpen"
			@click="toggle"
			@blur="closeOnBlur"
		/>
		<div class="pkpDropdown__content" :hidden="!isOpen" :id="id">
			<slot />
		</div>
		<span v-if="isOpen" class="pkpDropdown__caret" />
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	components: {
		PkpButton
	},
	props: {
		icon: {
			type: String,
			default: ''
		},
		label: {
			type: String,
			required: true
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
			}, 10);
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
	z-index: 9999;

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
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
