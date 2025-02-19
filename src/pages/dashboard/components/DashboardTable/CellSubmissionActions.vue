<template>
	<TableCell>
		<PkpButton
			v-if="showButton"
			class="-ms-3"
			:aria-describedby="'submission-title-' + item.id"
			:is-link="true"
			@click="handleAction"
		>
			{{ t('common.view') }}
		</PkpButton>
	</TableCell>
</template>
<script setup>
import {defineProps, computed} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/Table/TableCell.vue';
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore.js';

const props = defineProps({
	item: {type: Object, required: true},
});

const showButton = computed(() => !props.item.submissionProgress);

function handleAction() {
	dashboardPageStore.openWorkflowModal(props.item.id);
}

const dashboardPageStore = useDashboardPageStore();
</script>
