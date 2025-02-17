<template>
	<TableCell class="">
		<div class="flex items-center">
			<Icon :icon="fileIcon" class="h-6 w-6 flex-none text-heading" />
			<span class="text-base-normal text-default">{{ file.id }}</span>
		</div>
	</TableCell>
</template>
<script setup>
import {computed} from 'vue';

import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	file: {type: Object, required: true},
});

const fileIcon = computed(() =>
	!!pkp.documentTypeIcons && !!pkp.documentTypeIcons[props.file?.documentType]
		? pkp.documentTypeIcons[props.file?.documentType]
		: 'DocumentDefault',
);
</script>
