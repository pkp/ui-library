<template>
	<div :class="cn('base')"><slot></slot></div>
</template>
<script setup>
import {provide} from 'vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	comment: {type: Object, required: true},
	reportText: {type: String, required: true},
});

const {cn} = usePkpStyles();

const emit = defineEmits(['update:reportText']);
provide('reportDialogProps', props);
provide('reportDialogEmit', emit);
</script>
