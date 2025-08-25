<template>
	<TableCellSelect
		:disabled="props.workItem?.closed && props.workItem?.type === 'Task'"
		:checked="!!props.workItem?.closed"
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

const statusUpdate = props.workItem?.closed ? 'reopen' : 'close';

const modalProps = {
	reopen: {
		title:
			props.workItem?.type === 'Task'
				? t('task.reopenThisTask')
				: t('discussion.reopenThisDiscussion'),
		message:
			props.workItem?.type === 'Task'
				? t('task.confirmReopenTask')
				: t('discussion.confirmReopenDiscussion'),
	},
	close: {
		title:
			props.workItem?.type === 'Task'
				? t('task.closeThisTask')
				: t('discussion.closeThisDiscussion'),
		message:
			props.workItem?.type === 'Task'
				? t('task.confirmCloseTask')
				: t('discussion.confirmCloseDiscussion'),
	},
};

const labelIds = `discussion_name_${props.workItem?.id} ${tableContext.tableId}_${props.index}`;
</script>
