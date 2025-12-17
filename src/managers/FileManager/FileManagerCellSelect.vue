<template>
	<TableCellSelect
		:checked="
			!!fileManagerStore.selectedFiles.find(
				(selectedFile) => selectedFile.id === file.id,
			)
		"
		:labelled-by="`${fileManagerStore.namespace}-file-name-${file.id}`"
		@change="fileManagerStore.toggleSelectedFile(file)"
	/>
</template>
<script setup>
import TableCellSelect from '@/components/Table/TableCellSelect.vue';
import {useFileManagerStore} from './fileManagerStore.js';

defineProps({
	file: {type: Object, required: true},
});
const fileManagerStore = useFileManagerStore();
</script>
