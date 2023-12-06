<template>
	<div class="panel" :class="stack ? 'panel--stack' : 'panel--wide'">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'Panel',
	props: {
		/** Whether or not the header should appear above the panel content. */
		stack: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.panel {
	background: @lift;
	border: @bg-border-light;
	border-radius: @radius;
}
</style>
