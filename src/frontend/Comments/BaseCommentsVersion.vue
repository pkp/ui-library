<template>
	<AccordionItem :value="props.publicationId"><slot /></AccordionItem>
</template>
<script setup>
import {AccordionItem} from 'reka-ui';
import {provide} from 'vue';
import {usePkpCommentsVersionStore} from './usePkpCommentsVersionStore';

const props = defineProps({publicationId: {type: Number, required: true}});
usePkpCommentsVersionStore(
	{publicationId: props.publicationId},
	props.publicationId,
);

provide('versionProps', props);
</script>
