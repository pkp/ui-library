import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';

import TaskTemplateManagerForm from './TaskTemplateManagerForm.vue';

export const Actions = {
	TASK_TEMPLATES_LIST: 'templateList',
	TASK_TEMPLATES_ADD: 'templateAdd',
	TASK_TEMPLATES_EDIT: 'templateEdit',
	TASK_TEMPLATES_DELETE: 'templateDelete',
};

export function useTaskTemplateActions() {
	const {t} = useLocalize();

	function templateAdd({stage}, finishedCallback) {
		const {openSideModal, closeSideModal} = useModal();

		function onCloseFn() {
			closeSideModal(TaskTemplateManagerForm);
		}

		openSideModal(
			TaskTemplateManagerForm,
			{
				stage,
				onCloseFn,
			},
			{
				onClose: finishedCallback,
			},
		);
	}

	function templateEdit({taskTemplate}, finishedCallback) {
		const {openSideModal, closeSideModal} = useModal();

		function onCloseFn() {
			closeSideModal(TaskTemplateManagerForm);
		}

		openSideModal(
			TaskTemplateManagerForm,
			{
				taskTemplate,
				onCloseFn,
			},
			{
				onClose: finishedCallback,
			},
		);
	}

	function templateDelete({taskTemplate}, finishedCallback) {
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

	function templateUpdateAutoAdd({taskTemplate}, finishedCallback) {
		// TODO: update template
	}

	return {
		templateAdd,
		templateEdit,
		templateDelete,
		templateUpdateAutoAdd,
	};
}
