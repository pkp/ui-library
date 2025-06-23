import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import TasksAndDiscussionsForm from './TasksAndDiscussionsForm.vue';

export const Actions = {
	TASKS_AND_DISCUSSIONS_LIST: 'tasksAndDiscussionsList',
	TASKS_AND_DISCUSSIONS_SEARCH: 'tasksAndDiscussionsSearch',
	TASKS_AND_DISCUSSIONS_ADD: 'tasksAndDiscussionsAdd',
	TASKS_AND_DISCUSSIONS_EDIT: 'tasksAndDiscussionsEdit',
	TASKS_AND_DISCUSSIONS_DELETE: 'tasksAndDiscussionsDelete',
	TASKS_AND_DISCUSSIONS_HISTORY: 'tasksAndDiscussionsHistory',
	TASKS_AND_DISCUSSIONS_ADD_TASK_DETAILS: 'tasksAndDiscussionsAddTaskDetails',
};

export function useTasksAndDiscussionsManagerActions() {
	const {t} = useLocalize();

	function tasksAndDiscussionsAdd({workItem, submission}, finishedCallback) {
		const {openSideModal, closeSideModal} = useModal();

		function onCloseFn() {
			closeSideModal(TasksAndDiscussionsForm);
		}

		openSideModal(TasksAndDiscussionsForm, {
			onCloseFn,
			onSubmitFn: finishedCallback,
		});
	}

	function tasksAndDiscussionsSearch({workItem, submission}, finishedCallback) {
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
		tasksAndDiscussionsSearch,
		tasksAndDiscussionsEdit,
		tasksAndDiscussionsDelete,
		tasksAndDiscussionsHistory,
		tasksAndDiscussionsAddTaskDetails,
	};
}
