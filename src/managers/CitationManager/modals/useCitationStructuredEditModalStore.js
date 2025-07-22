import {
	defineComponentStore,
	injectFromCurrentInstance,
} from '@/utils/defineComponentStore';
import {useForm} from '@/composables/useForm';

export const useCitationStructuredEditModalStore = defineComponentStore(
	'citationStructuredEditModalStore',
	(props) => {
		const closeModal = injectFromCurrentInstance('closeModal');
		const {set: updateForm, form} = useForm(props.citationStructuredEditForm);

		function formSuccess() {
			closeModal();
		}

		return {form, formSuccess, updateForm};
	},
);
