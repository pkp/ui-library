import {
	defineComponentStore,
	injectFromCurrentInstance,
} from '@/utils/defineComponentStore';
import {useForm} from '@/composables/useForm';

export const useWorkflowLogResponseModalStore = defineComponentStore(
	'workflowLogResponseModal',
	(props) => {
		const closeModal = injectFromCurrentInstance('closeModal');
		const {set: updateForm, form} = useForm(props.logResponseForm);

		function formSuccess() {
			closeModal();
		}

		return {form, formSuccess, updateForm};
	},
);
