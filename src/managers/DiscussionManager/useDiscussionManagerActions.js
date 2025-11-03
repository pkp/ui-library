import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useFetch} from '../../composables/useFetch';
import {useUrl} from '../../composables/useUrl';
import {useDiscussionManagerStatusUpdater} from './useDiscussionManagerStatusUpdater';
import DiscussionManagerFormModal from './DiscussionManagerFormModal.vue';
import DiscussionManagerFormDisplayModal from './DiscussionManagerFormDisplayModal.vue';

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
		const {openSideModal} = useModal();

		openSideModal(
			DiscussionManagerFormDisplayModal,
			{
				workItem,
				submission,
				submissionStageId,
			},
			{
				onClose: finishedCallback,
			},
		);
	}

	function discussionAdd(
		{workItem, submission, submissionStageId},
		finishedCallback,
	) {
		const {openSideModal} = useModal();

		openSideModal(
			DiscussionManagerFormModal,
			{
				submission,
				submissionStageId,
			},
			{
				onClose: finishedCallback,
			},
		);
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
		const {openSideModal} = useModal();

		openSideModal(
			DiscussionManagerFormModal,
			{
				status: workItem.status,
				submission,
				submissionStageId,
				workItem,
				autoAddTaskDetails,
			},
			{
				onClose: finishedCallback,
			},
		);
	}

	function discussionDelete({workItem, submission}, finishedCallback) {
		async function deleteWorkItem() {
			const {apiUrl: deleteTaskUrl} = useUrl(
				`submissions/${submission.id}/tasks/${workItem.id}`,
			);

			const {
				fetch,
				data: deleteTaskData,
				isSuccess,
			} = useFetch(deleteTaskUrl, {
				method: 'DELETE',
			});

			await fetch();

			return {
				data: deleteTaskData.value,
				isSuccess: isSuccess.value,
			};
		}

		const {openDialog} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: async (close) => {
						await deleteWorkItem();
						finishedCallback();
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

	async function discussionStartTask({workItem, submission}, finishedCallback) {
		// Discussions cannot be started
		if (workItem?.type === pkp.const.EDITORIAL_TASK_TYPE_DISCUSSION) {
			return;
		}

		const {startWorkItem} = useDiscussionManagerStatusUpdater(submission.id);
		await startWorkItem(workItem.id);
		finishedCallback();
	}

	async function discussionSetClosed(
		{workItem, submission, status},
		finishedCallback,
	) {
		// Tasks cannot be reopened
		if (
			workItem?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK &&
			!!workItem.dateClosed
		) {
			return;
		}

		const {openWorkItem, closeWorkItem} = useDiscussionManagerStatusUpdater(
			submission.id,
		);
		if (status === 'open') {
			await openWorkItem(workItem.id);
		} else {
			await closeWorkItem(workItem.id);
		}

		finishedCallback();
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
