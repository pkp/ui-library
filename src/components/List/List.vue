<template>
	<ul class="list">
		<slot />
	</ul>
</template>

<script>
export default {
	name: 'List'
};
</script>

<style lang="less">
@import '../../styles/_import';

.list {
	margin: 0;
	padding: 0;
	list-style: none;
	border-top: @grid-border;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
	border-radius: @radius;
}
</style>
