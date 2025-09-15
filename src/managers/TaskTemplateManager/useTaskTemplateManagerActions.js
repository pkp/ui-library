import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';

export const Actions = {
	TASK_TEMPLATES_LIST: 'templateList',
	TASK_TEMPLATES_ADD: 'templateAdd',
	TASK_TEMPLATES_EDIT: 'templateEdit',
	TASK_TEMPLATES_DELETE: 'templateDelete',
};

export function useTaskTemplateActions() {
	const {t} = useLocalize();

	function templateAdd(
		{workItem, submission, submissionStageId},
		finishedCallback,
	) {
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

	function templateEdit(
		{workItem, submission, submissionStageId},
		finishedCallback,
	) {
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

	function templateDelete({workItem, submission}, finishedCallback) {
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

	return {
		templateAdd,
		templateEdit,
		templateDelete,
	};
}
