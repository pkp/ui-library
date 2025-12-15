import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useFetch} from '../../composables/useFetch';
import {useUrl} from '../../composables/useUrl';

import TaskTemplateManagerFormModal from './TaskTemplateManagerFormModal.vue';

export const Actions = {
	TASK_TEMPLATES_LIST: 'templateList',
	TASK_TEMPLATES_ADD: 'templateAdd',
	TASK_TEMPLATES_EDIT: 'templateEdit',
	TASK_TEMPLATES_DELETE: 'templateDelete',
};

export function useTaskTemplateActions() {
	const {t} = useLocalize();

	function templateAdd({stage}, finishedCallback) {
		const {openSideModal} = useModal();

		openSideModal(
			TaskTemplateManagerFormModal,
			{
				stage,
			},
			{
				onClose: finishedCallback,
			},
		);
	}

	function templateEdit({taskTemplate}, finishedCallback) {
		const {openSideModal} = useModal();

		openSideModal(
			TaskTemplateManagerFormModal,
			{
				taskTemplate,
			},
			{
				onClose: finishedCallback,
			},
		);
	}

	function templateDelete({taskTemplate}, finishedCallback) {
		async function deleteTaskTemplate() {
			const {apiUrl: deleteTaskTemplateUrl} = useUrl(
				`editTaskTemplates/${taskTemplate.id}`,
			);

			const {
				fetch,
				data: deleteTaskTemplateData,
				isSuccess,
			} = useFetch(deleteTaskTemplateUrl, {
				method: 'DELETE',
			});

			await fetch();

			return {
				data: deleteTaskTemplateData.value,
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
						await deleteTaskTemplate();
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

	async function templateUpdateAutoAdd({taskTemplate}, finishedCallback) {
		const {apiUrl: updateTaskTemplateUrl} = useUrl(
			`editTaskTemplates/${taskTemplate.id}`,
		);

		const {fetch} = useFetch(updateTaskTemplateUrl, {
			method: 'PUT',
			body: {include: !taskTemplate.include},
		});

		await fetch();
		finishedCallback();
	}

	return {
		templateAdd,
		templateEdit,
		templateDelete,
		templateUpdateAutoAdd,
	};
}
