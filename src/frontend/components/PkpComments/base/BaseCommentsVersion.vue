<template>
	<AccordionItem class="BaseCommentsVersion" :value="props.publicationId">
		<slot />
	</AccordionItem>
</template>
<script setup>
import {AccordionItem} from 'reka-ui';
import {provide} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const props = defineProps({publicationId: {type: Number, required: true}});

const commentsStore = usePkpCommentsStore();

// Load initial comments
commentsStore.loadComments(props.publicationId);

provide('publicationId', props.publicationId);
</script>
