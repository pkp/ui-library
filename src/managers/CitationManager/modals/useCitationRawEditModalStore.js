import {
	defineComponentStore,
	injectFromCurrentInstance,
} from '@/utils/defineComponentStore';
import {useForm} from '@/composables/useForm';

export const useCitationRawEditModalStore = defineComponentStore(
	'citationRawEditModalStore',
	(props) => {
		const closeModal = injectFromCurrentInstance('closeModal');
		const {set: updateForm, form} = useForm(props.citationRawEditForm);

		function formSuccess() {
			closeModal();
		}

		return {form, formSuccess, updateForm};
	},
);
