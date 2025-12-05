<template>
	<TableCellSelect
		:checked="fileManagerStore.selectedFileIds.includes(file.id)"
		:labelled-by="`${fileManagerStore.namespace}-file-name-${file.id}`"
		@change="fileManagerStore.toggleSelectedFileId(file.id, file)"
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
