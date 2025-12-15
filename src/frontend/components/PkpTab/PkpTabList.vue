<template>
	<BaseTabList v-bind="$attrs">
		<slot />
	</BaseTabList>
</template>

<script setup>
import BaseTabList from './base/BaseTabList.vue';
</script>

<style></style>
