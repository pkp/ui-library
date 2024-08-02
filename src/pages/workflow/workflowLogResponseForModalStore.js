import {inject} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';

export const useWorkflowLogResponseForModalStore = defineComponentStore(
	'workflowLogResponseForModal',
	(props) => {
		const closeModal = inject('closeModal');
		const form = props.logResponseForm;

		function formSuccess() {
			closeModal();
		}

		function updateForm(formId, data) {
			Object.keys(data).forEach((key) => (form[key] = data[key]));
		}

		return {form, formSuccess, updateForm};
	},
);
