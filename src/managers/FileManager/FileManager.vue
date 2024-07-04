<template>
	<ListPanel
		:title="title"
		:description="description"
		:items="fileManagerStore.files"
	>
		<template #header>
			<h2 class="text-lg-bold text-heading">
				<span>{{ title }}</span>
			</h2>
			<div v-if="description" class="text-base-normal">{{ description }}</div>
		</template>
		<template #item="{item}">
			<FileManagerItem
				:file="item"
				:submission-id="submissionId"
				:submission-stage-id="submissionStageId"
			></FileManagerItem>
		</template>
	</ListPanel>
</template>
<script setup>
import {inject} from 'vue';
import {useFileManagerStore} from './fileManagerStore.js';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import FileManagerItem from './FileManagerItem.vue';

const props = defineProps({
	namespace: {type: String, required: true},
	submissionId: {type: String, required: true},
	submissionStageId: {type: String, required: true},
	reviewRoundId: {type: String, required: true},
	fileStages: {type: Array, required: true},
	title: {type: String, required: true},
	description: {type: String, required: true},
});

const fileManagerStore = useFileManagerStore(props, props.namespace);

const registerDataChangeCallback = inject('registerDataChangeCallback');
registerDataChangeCallback(() => fileManagerStore.fetchFiles());
</script>
