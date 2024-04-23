<template>
	<TableCell>
		<PkpButton
			class="-ms-3"
			:aria-describedby="'submission-title-' + item.id"
			:is-link="true"
			@click="submissionsPageStore.openSummaryModal(item.id)"
		>
			{{ 'Action (todo)' }}
		</PkpButton>
	</TableCell>
</template>
<script setup>
import {defineProps} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import {useSubmissionsPageStore} from '@/pages/submissions/submissionsPageStore.js';

defineProps({
	item: {type: Object, required: true},
});
const submissionsPageStore = useSubmissionsPageStore();
</script>
