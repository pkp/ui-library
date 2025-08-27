<template>
	<TableCell>
		{{ userCommentStore.getCommentStatusText(item) }}
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';

const userCommentStore = useUserCommentStore();

defineProps({
	item: {
		type: Object,
		required: true,
	},
});
</script>
