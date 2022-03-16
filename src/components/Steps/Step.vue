<template>
	<div class="pkpStep" :hidden="!isActive">
		<slot />
	</div>
</template>

<script>
export default {
	props: {
		id: {
			type: String,
			required: true
		},
		label: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {
			isActive: false
		};
	}
};
</script>
