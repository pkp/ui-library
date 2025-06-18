import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';

export const Actions = {
	TASKS_AND_DISCUSSIONS_LIST: 'tasksAndDiscussionsList',
	TASKS_AND_DISCUSSIONS_ADD: 'tasksAndDiscussionsAdd',
	TASKS_AND_DISCUSSIONS_EDIT: 'tasksAndDiscussionsEdit',
	TASKS_AND_DISCUSSIONS_DELETE: 'tasksAndDiscussionsDelete',
	TASKS_AND_DISCUSSIONS_HISTORY: 'tasksAndDiscussionsHistory',
	TASKS_AND_DISCUSSIONS_ADD_TASK_DETAILS: 'tasksAndDiscussionsAddTaskDetails',
};

export function useTasksAndDiscussionsManagerActions() {
	const {t} = useLocalize();

	function tasksAndDiscussionsAdd({workItem, submission}, finishedCallback) {
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
			title: 'Add',
			message: 'Placeholder',
		});
	}

	function tasksAndDiscussionsEdit({workItem, submission}, finishedCallback) {
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
			title: 'Edit',
			message: 'Placeholder',
		});
	}

	function tasksAndDiscussionsDelete({workItem, submission}, finishedCallback) {
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

	function tasksAndDiscussionsHistory() {
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

	function tasksAndDiscussionsAddTaskDetails() {
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

	return {
		tasksAndDiscussionsAdd,
		tasksAndDiscussionsEdit,
		tasksAndDiscussionsDelete,
		tasksAndDiscussionsHistory,
		tasksAndDiscussionsAddTaskDetails,
	};
}
