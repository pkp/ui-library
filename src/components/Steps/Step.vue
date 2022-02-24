<template>
	<div
		class="pkpStep"
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
