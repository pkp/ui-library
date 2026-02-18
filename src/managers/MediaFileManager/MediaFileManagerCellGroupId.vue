<template>
	<TableRowSpan :rowspan="rowSpanGroupContext?.groupSize" class="align-top">
		<div class="flex items-center gap-2">
			<Icon :icon="fileTypeIcon" class="h-6 w-6 text-heading" />
			<span v-if="mediaFile.variantGroupId" class="text-base-normal">
				{{ mediaFile.variantGroupId }}
			</span>
		</div>
	</TableRowSpan>
</template>

<script setup>
import {computed, inject} from 'vue';
import TableRowSpan from '@/components/Table/TableRowSpan.vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({mediaFile: {type: Object, required: true}});

const rowSpanGroupContext = inject('rowSpanGroupContext', null);

const fileTypeIcon = computed(() => {
	const documentType = props.mediaFile?.documentType || 'default';
	return pkp.documentTypeIcons?.[documentType] || 'DefaultDocument';
});
</script>
