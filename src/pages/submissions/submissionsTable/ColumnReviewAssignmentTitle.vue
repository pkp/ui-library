<template>
	<TableCell
		:id="'submission-title-' + item.id"
		class="max-w-[25em] truncate"
		:is-row-header="true"
	>
		<span class="text-lg-semibold">
			{{ 'submission title (todo)' }}
		</span>
	</TableCell>
</template>

<script setup>
import {defineProps} from 'vue';

import TableCell from '@/components/TableNext/TableCell.vue';

defineProps({item: {type: Object, required: true}});
</script>
