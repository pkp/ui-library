<template>
	<div class="pkpStep" :hidden="!isActive">
		<slot />
	</div>
</template>

<script>
import {computed} from 'vue';
export default {
	inject: ['registerStep'],
	props: {
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
	},
	data() {
		return {
			isActive: false,
		};
	},
	created() {
		// share state with parent <tabs> component
		this.unregister = this.registerStep({
			id: this.id,
			label: computed(() => this.label),
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
