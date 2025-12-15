<template>
	<BaseIcon v-bind="$attrs" />
</template>
<script setup>
import BaseIcon from './BaseIcon.vue';
</script>
<style>
[dir='rtl'] .BaseIcon {
	transform: scaleX(-1);
}
</style>
