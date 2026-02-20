<template>
	<TableCell>
		<div class="flex items-center">
			<span class="text-base-normal">
				{{ formatFileSize(mediaFile?.fileSize) }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {formatFileSize} from '@/utils/fileUtils';

defineProps({mediaFile: {type: Object, required: true}});
</script>
