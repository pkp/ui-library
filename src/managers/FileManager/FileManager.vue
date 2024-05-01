<template>
	<ListingFilesListPanel
		:title="title"
		:description="description"
		:files="fileManagerStore.files"
	></ListingFilesListPanel>
</template>
<script setup>
import {inject} from 'vue';
import {useFileManagerStore} from './FileManagerStore.js';
import ListingFilesListPanel from '@/components/ListPanel/listingFiles/ListingFilesListPanel.vue';
const props = defineProps({
	namespace: {type: String, required: true},
	submissionId: {type: String, required: true},
	reviewRoundId: {type: String, required: true},
	fileStages: {type: Array, required: true},
	title: {type: String, required: true},
	description: {type: String, required: true},
});
console.log('file manager create:', props.namespace);
const fileManagerStore = useFileManagerStore(props, props.namespace);

const registerDataChangeCallback = inject('registerDataChangeCallback');
registerDataChangeCallback(() => fileManagerStore.fetchFiles());
</script>
