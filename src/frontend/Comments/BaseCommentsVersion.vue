<template>
	<AccordionItem :value="props.publicationId"><slot /></AccordionItem>
</template>
<script setup>
import {AccordionItem} from 'reka-ui';
import {provide} from 'vue';
//import {usePkpCommentsStore} from './usePkpCommentsStore';

const props = defineProps({publicationId: {type: Number, required: true}});
//const commentsStore = usePkpCommentsStore();

//const versionApi = commentsStore.getApiPerVersion(props.publicationId);

provide('versionProps', props);
</script>
