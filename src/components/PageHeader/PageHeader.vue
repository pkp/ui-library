<template>
	<div class="pkpPageHeader">
		<h1 class="pkpPageHeader__title">
			<slot />
		</h1>
		<div v-if="hasActions" class="pkpPageHeader__actions">
			<slot name="actions" />
		</div>
	</div>
</template>

<script>
export default {
	computed: {
		hasActions: function () {
			return this.$slots.actions;
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpPageHeader {
	padding: 1rem 2rem;
}

.pkpPageHeader__title {
	display: inline-block;
	margin: 0;
	font-size: @font-base;
	line-height: 1.5em;

	.pkpSpinner {
		margin-left: 0.5rem;
	}
}

.pkpPageHeader__actions {
	float: right;
	margin-left: 1rem;
}
</style>
