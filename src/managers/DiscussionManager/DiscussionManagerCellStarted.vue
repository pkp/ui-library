<template>
	<TableCellSelect
		:hidden="!isTask"
		:disabled="!isPending"
		:checked="!!props.workItem?.dateStarted"
		:labelled-by="labelIds"
		:confirm-title="t('task.startThisTask')"
		:confirm-message="t('task.confirmStartTask')"
		@change="discussionManagerStore.discussionStartTask({workItem})"
	/>
</template>

<script setup>
import {inject} from 'vue';
import {t} from '@/utils/i18n';
import TableCellSelect from '@/components/Table/TableCellSelect.vue';

import {useDiscussionManagerStore} from './discussionManagerStore';

const tableContext = inject('tableContext');
const discussionManagerStore = useDiscussionManagerStore();

const props = defineProps({
	workItem: {type: Object, required: true},
	index: {type: Number, required: true},
});

const isTask = props.workItem?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK;
const isPending =
	props.workItem.status === pkp.const.EDITORIAL_TASK_STATUS_PENDING;

const labelIds = `discussion_name_${props.workItem?.id} ${tableContext.tableId}_${props.index}`;
</script>
