<template>
	<div class="buttonRow">
		<div v-if="hasEndSlot" class="buttonRow__end">
			<slot name="end" />
		</div>
		<slot />
	</div>
</template>

<script>
export default {
	computed: {
		hasEndSlot() {
			return this.$slots.end;
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.buttonRow {
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * + * {
		margin-inline-start: 0.25rem;
	}
}

.buttonRow__end {
	margin-inline-start: 0;
	margin-inline-end: auto;

	> * + * {
		margin-inline-end: auto;
	}
}
</style>
