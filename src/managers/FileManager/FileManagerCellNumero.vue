<template>
	<TableCell class="">
		<div class="flex items-center">
			<FileTypeIcon
				:document-type="file.documentType"
				class="h-6 w-6 flex-none text-heading"
			/>
			<span class="text-base-normal text-default">{{ file.id }}</span>
		</div>
	</TableCell>
</template>
<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import FileTypeIcon from '@/components/FileTypeIcon/FileTypeIcon.vue';

defineProps({
	file: {type: Object, required: true},
});
</script>
