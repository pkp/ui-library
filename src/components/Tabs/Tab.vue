<template>
	<div
		:id="id"
		class="pkpTab min-w-0"
		:class="classes"
		role="tabpanel"
		:aria-labelledby="id + '-button'"
		:hidden="!isActive"
	>
		<slot />
	</div>
</template>

<script>
import {computed} from 'vue';
export default {
	inject: ['registerTab'],
	props: {
		/** Adds an **Icon** component beside the text in the tab. */
		icon: {
			type: String,
			default() {
				return '';
			},
		},
		/** A unique string for this tab */
		id: {
			type: String,
			required: true,
		},
		/** A text label for this tab. */
		label: {
			type: String,
			default() {
				return '';
			},
		},
		/** Adds a **Badge** component beside the icon or text in the tab. */
		badge: {
			type: [String, Number],
			default() {
				return '';
			},
		},
		isDisabled: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	data() {
		return {
			isActive: false,
		};
	},
	computed: {
		/**
		 * Classes to apply to root element
		 *
		 * @return {Array}
		 */
		classes() {
			let classes = [];
			if (this.isActive) {
				classes.push('pkpTab--isActive');
			}
			if (this.isDisabled) {
				classes.push('pkpTab--isDisabled');
			}
			return classes;
		},
	},
	created() {
		// share state with parent <tabs> component
		this.unregister = this.registerTab({
			id: this.id,
			icon: computed(() => this.icon),
			label: computed(() => this.label),
			badge: computed(() => this.badge),
			isActive: (active) => (this.isActive = active),
		});
	},
	beforeUnmount() {
		// Unregister the method to avoid calling methods on destroyed components
		if (this.unregister) {
			this.unregister();
		}
	},
};
</script>
