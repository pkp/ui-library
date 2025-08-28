<template>
	<TableCell class="max-w-[25em]">
		<div class="truncate">
			<span class="mr-1">{{ item.publication.submissionId }}.</span>
			<span class="font-bold">
				{{ item.publication.authorsStringShort }}
			</span>
			<span>{{ t('common.semicolonListSeparator') }}</span>
			<span v-strip-unsafe-html="item.publication.fullTitle"></span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>
