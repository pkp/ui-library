<template>
	<TableRowSpan :rowspan="rowSpanGroupContext?.groupSize" class="align-top">
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
	</TableRowSpan>
</template>

<script setup>
import {inject} from 'vue';
import TableRowSpan from '@/components/Table/TableRowSpan.vue';
import FileTypeIcon from '@/components/FileTypeIcon/FileTypeIcon.vue';

defineProps({mediaFile: {type: Object, required: true}});

const rowSpanGroupContext = inject('rowSpanGroupContext', null);
</script>
