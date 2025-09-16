<template>
	<span>{{ item.label }}</span>
</template>
<script setup>
import {inject} from 'vue';

const item = inject('item');
</script>
