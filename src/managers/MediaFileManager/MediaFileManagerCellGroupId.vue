<template>
	<TableCell is-row-header :rowspan="groupSize" class="align-top">
		<div class="flex items-center gap-2">
			<FileTypeIcon
				:document-type="mediaFile.documentType"
				class="h-6 w-6 text-heading"
			/>
			<span v-if="mediaFile.variantGroupId" class="text-base-normal">
				{{ mediaFile.variantGroupId }}
			</span>
			<span v-else class="text-base-normal">
				{{ mediaFile.fileId }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import {inject} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';
import FileTypeIcon from '@/components/FileTypeIcon/FileTypeIcon.vue';

defineProps({mediaFile: {type: Object, required: true}});

const groupSize = inject('rowSpanGroupSize', 1);
</script>
