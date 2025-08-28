<template>
	<TableCellSelect
		:hidden="workItem.type === 'Discussion'"
		:disabled="workItem.status !== 'Pending'"
		:checked="!!props.workItem?.started"
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

const labelIds = `discussion_name_${props.workItem?.id} ${tableContext.tableId}_${props.index}`;
</script>
