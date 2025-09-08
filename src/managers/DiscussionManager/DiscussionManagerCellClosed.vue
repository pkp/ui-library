<template>
	<TableCellSelect
		:disabled="!!props.workItem?.dateClosed && isTask"
		:checked="!!props.workItem?.dateClosed"
		:labelled-by="labelIds"
		:confirm-title="confirmProps.title"
		:confirm-message="confirmProps.message"
		@change="discussionManagerStore.discussionSetClosed({workItem, status})"
	/>
</template>

<script setup>
import {inject, computed} from 'vue';
import {t} from '@/utils/i18n';
import TableCellSelect from '@/components/Table/TableCellSelect.vue';

import {useDiscussionManagerStore} from './discussionManagerStore';

const tableContext = inject('tableContext');
const discussionManagerStore = useDiscussionManagerStore();

const props = defineProps({
	workItem: {type: Object, required: true},
	index: {type: Number, required: true},
});

const isTask = computed(
	() => props.workItem?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK,
);

const status = computed(() =>
	props.workItem?.status === pkp.const.EDITORIAL_TASK_STATUS_CLOSED
		? 'open'
		: 'close',
);

const confirmProps = computed(() => {
	if (status.value === 'open') {
		return {
			title: isTask.value
				? t('task.reopenThisTask')
				: t('discussion.reopenThisDiscussion'),
			message: isTask.value
				? t('task.confirmReopenTask')
				: t('discussion.confirmReopenDiscussion'),
		};
	}

	return {
		title: isTask.value
			? t('task.closeThisTask')
			: t('discussion.closeThisDiscussion'),
		message: isTask.value
			? t('task.confirmCloseTask')
			: t('discussion.confirmCloseDiscussion'),
	};
});

const labelIds = `discussion_name_${props.workItem?.id} ${tableContext.tableId}_${props.index}`;
</script>
