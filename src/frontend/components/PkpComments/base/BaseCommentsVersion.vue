<template>
	<AccordionItem class="BaseCommentsVersion" :value="props.publicationId">
		<slot />
	</AccordionItem>
</template>
<script setup>
import {AccordionItem} from 'reka-ui';
import {provide} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const props = defineProps({
	publication: {type: Object, required: true},
	publicationId: {type: Number, required: true},
});

const commentsStore = usePkpCommentsStore();

// Load initial comments
commentsStore.loadComments(props.publicationId);

provide('publication', props.publication);
provide('publicationId', props.publicationId);
</script>
