import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import DiscussionManagerForm from './DiscussionManagerForm.vue';
import DiscussionManagerFormDisplay from './DiscussionManagerFormDisplay.vue';

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
			closeSideModal(DiscussionManagerFormDisplay);
		}

		openSideModal(DiscussionManagerFormDisplay, {
			workItem,
			submission,
			submissionStageId,
			onCloseFn,
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
		{workItem, submission, submissionStageId, autoAddTaskDetails},
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
			autoAddTaskDetails,
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

	function discussionAddTaskDetails(
		{workItem, submission, submissionStageId},
		finishedCallback,
	) {
		return discussionEdit(
			{workItem, submission, submissionStageId, autoAddTaskDetails: true},
			finishedCallback,
		);
	}

	function discussionStartTask({workItem}) {
		// Discussions cannot be started
		if (workItem?.type === 'Discussion') {
			return;
		}

		// TODO: start task
	}

	function discussionSetClosed({workItem}) {
		// Tasks cannot be reopened
		if (workItem?.type === 'Task' && workItem.closed) {
			return;
		}

		// TODO: update status
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
