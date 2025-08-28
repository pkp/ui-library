<template>
	<DialogTitle>{{ dialogProps.title }}</DialogTitle>
</template>
<script setup>
import {inject} from 'vue';
import {DialogTitle} from 'reka-ui';

const dialogProps = inject('dialogProps');
</script>
