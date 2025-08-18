<template>
	<DialogRoot :open="true">
		<DialogPortal><slot></slot></DialogPortal>
	</DialogRoot>
</template>

<script setup>
import {provide} from 'vue';
import {DialogRoot, DialogPortal} from 'reka-ui';

const props = defineProps({title: {type: String, required: true}});

provide('dialogProps', props);
</script>
