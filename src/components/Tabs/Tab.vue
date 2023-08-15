<template>
	<div
		class="pkpTab"
		:class="classes"
		role="tabpanel"
		:id="id"
		:aria-labelledby="id + '-button'"
		:hidden="!isActive"
	>
		<slot />
	</div>
</template>

<script>
export default {
	props: {
		icon: {
			type: String,
			default() {
				return '';
			},
		},
		id: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			default() {
				return '';
			},
		},
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
	inject: ['registerTab'],
	created() {
		// share state with parent <tabs> component
		this.unregister = this.registerTab({
			id: this.id,
			icon: this.icon,
			label: this.label,
			badge: this.badge,
			isActive: (active) => (this.isActive = active),
		});
	},
	beforeUnmount() {
		console.log('before destroy');
		// Unregister the method to avoid calling methods on destroyed components
		if (this.unregister) {
			this.unregister();
		}
	},
};
</script>
