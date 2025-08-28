import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import DiscussionManagerForm from './DiscussionManagerForm.vue';

export const Actions = {
	TASKS_AND_DISCUSSIONS_LIST: 'discussionList',
	TASKS_AND_DISCUSSIONS_SEARCH: 'discussionSearch',
	TASKS_AND_DISCUSSIONS_ADD: 'discussionAdd',
	TASKS_AND_DISCUSSIONS_EDIT: 'discussionEdit',
	TASKS_AND_DISCUSSIONS_DELETE: 'discussionDelete',
	TASKS_AND_DISCUSSIONS_HISTORY: 'discussionHistory',
	TASKS_AND_DISCUSSIONS_ADD_TASK_DETAILS: 'discussionAddTaskDetails',
};

export function useDiscussionManagerActions() {
	const {t} = useLocalize();

	function discussionView(
		{workItem, submission, submissionStageId},
		finishedCallback,
	) {
		const {openSideModal, closeSideModal} = useModal();

		function onCloseFn() {
			closeSideModal(DiscussionManagerForm);
		}

		openSideModal(DiscussionManagerForm, {
			workItem,
			submission,
			submissionStageId,
			onCloseFn,
			inDisplayMode: true,
		});
	}

	function discussionAdd(
		{workItem, submission, submissionStageId},
		finishedCallback,
	) {
		const {openSideModal, closeSideModal} = useModal();

		function onCloseFn() {
			closeSideModal(DiscussionManagerForm);
		}

		openSideModal(DiscussionManagerForm, {
			submission,
			submissionStageId,
			onCloseFn,
			onSubmitFn: finishedCallback,
		});
	}

	function discussionSearch({workItem, submission}, finishedCallback) {
		const {openDialog} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: (close) => {
						close();
					},
				},
				{
					label: t('common.cancel'),
					callback: (close) => {
						close();
					},
				},
			],
			title: 'Search',
			message: 'Placeholder',
		});
	}

	function discussionEdit(
		{workItem, submission, submissionStageId},
		finishedCallback,
	) {
		const {openSideModal, closeSideModal} = useModal();

		function onCloseFn() {
			closeSideModal(DiscussionManagerForm);
		}

		openSideModal(DiscussionManagerForm, {
			status: workItem.status,
			submission,
			submissionStageId,
			workItem,
			onCloseFn,
			onSubmitFn: finishedCallback,
		});
	}

	function discussionDelete({workItem, submission}, finishedCallback) {
		const {openDialog} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: (close) => {
						close();
					},
				},
				{
					label: t('common.cancel'),
					callback: (close) => {
						close();
					},
				},
			],
			title: t('common.delete'),
			message: t('common.confirmDelete'),
			modalStyle: 'negative',
		});
	}

	function discussionHistory() {
		const {openDialog} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: (close) => {
						close();
					},
				},
				{
					label: t('common.cancel'),
					callback: (close) => {
						close();
					},
				},
			],
			title: 'History',
			message: 'Placeholder',
		});
	}

	function discussionAddTaskDetails() {
		const {openDialog} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: (close) => {
						close();
					},
				},
				{
					label: t('common.cancel'),
					callback: (close) => {
						close();
					},
				},
			],
			title: 'Task Details',
			message: 'Placeholder',
		});
	}

	function discussionStartTask() {
		const {openDialog} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.yes'),
					callback: (close) => {
						close();
					},
				},
				{
					label: t('common.no'),
					isWarnable: true,
					callback: (close) => {
						close();
					},
				},
			],
			title: t('task.startThisTask'),
			message: t('task.confirmStartTask'),
		});
	}

	function discussionSetClosed({workItem}) {
		const isClosed = workItem.closed;
		const statusUpdate = isClosed ? 'reopen' : 'close';
		const modalProps = {
			reopen: {
				title:
					workItem?.type === 'Task'
						? t('task.reopenThisTask')
						: t('discussion.reopenThisDiscussion'),
				message:
					workItem?.type === 'Task'
						? t('task.confirmReopenTask')
						: t('discussion.confirmReopenDiscussion'),
			},
			close: {
				title:
					workItem?.type === 'Task'
						? t('task.closeThisTask')
						: t('discussion.closeThisDiscussion'),
				message:
					workItem?.type === 'Task'
						? t('task.confirmCloseTask')
						: t('discussion.confirmCloseDiscussion'),
			},
		};

		const {openDialog} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.yes'),
					callback: (close) => {
						close();
					},
				},
				{
					label: t('common.no'),
					isWarnable: true,
					callback: (close) => {
						close();
					},
				},
			],
			title: modalProps[statusUpdate].title,
			message: modalProps[statusUpdate].message,
		});
	}

	return {
		discussionView,
		discussionAdd,
		discussionSearch,
		discussionEdit,
		discussionDelete,
		discussionHistory,
		discussionAddTaskDetails,
		discussionStartTask,
		discussionSetClosed,
	};
}
