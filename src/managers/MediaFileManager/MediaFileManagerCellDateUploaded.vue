<template>
	<TableCell>
		<div class="flex items-center">
			<span class="text-base-normal">
				{{ formatShortDate(mediaFile.createdAt) }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useDate} from '@/composables/useDate';

const {formatShortDate} = useDate();

defineProps({mediaFile: {type: Object, required: true}});
</script>
