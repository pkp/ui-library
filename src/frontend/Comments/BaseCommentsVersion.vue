<template>
	<AccordionItem><slot /></AccordionItem>
</template>
<script setup>
import {AccordionItem} from 'reka-ui';
import {provide} from 'vue';

const props = defineProps({publicationId: {type: Number, required: true}});

provide('publicationId', props.publicationId);
</script>
