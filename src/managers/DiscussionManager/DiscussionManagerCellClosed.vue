<template>
	<TableCellSelect
		:disabled="!!props.workItem?.dateClosed && isTask"
		:checked="!!props.workItem?.dateClosed"
		:labelled-by="labelIds"
		:confirm-title="modalProps[statusUpdate].title"
		:confirm-message="modalProps[statusUpdate].message"
		@change="discussionManagerStore.discussionSetClosed({workItem})"
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

const statusUpdate = props.workItem?.dateClosed ? 'reopen' : 'close';

const isTask = props.workItem?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK;

const modalProps = {
	reopen: {
		title: isTask
			? t('task.reopenThisTask')
			: t('discussion.reopenThisDiscussion'),
		message: isTask
			? t('task.confirmReopenTask')
			: t('discussion.confirmReopenDiscussion'),
	},
	close: {
		title: isTask
			? t('task.closeThisTask')
			: t('discussion.closeThisDiscussion'),
		message: isTask
			? t('task.confirmCloseTask')
			: t('discussion.confirmCloseDiscussion'),
	},
};

const labelIds = `discussion_name_${props.workItem?.id} ${tableContext.tableId}_${props.index}`;
</script>
