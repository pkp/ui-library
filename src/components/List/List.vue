<template>
	<div class="list">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'List'
};
</script>

<style lang="less">
@import '../../styles/_import';

.list {
	border-top: @grid-border;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
	border-radius: @radius;
}
</style>
