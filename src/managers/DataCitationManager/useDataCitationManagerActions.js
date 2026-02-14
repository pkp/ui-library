import {useForm} from '@/composables/useForm';
import DataCitationEditModal from '@/managers/DataCitationManager/modals/DataCitationEditModal.vue';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {cloneDeep} from 'lodash';
import {useFetch} from '@/composables/useFetch';

export const Actions = {
	DATA_CITATION_ADD_DATA_CITATION: 'dataCitationAddDataCitation',
	DATA_CITATION_EDIT_DATA_CITATION: 'dataCitationEditDataCitation',
	DATA_CITATION_DELETE_DATA_CITATION: 'dataCitationDeleteDataCitation',
};
export function useDataCitationManagerActions() {
	const {openDialog, openSideModal} = useModal();
	const {t} = useLocalize();

	function dataCitationAddDataCitation(
		{submission, publication, dataCitationEditForm},
		finishedCallback,
	) {
		const {apiUrl} = useUrl(
			`submissions/${submission.id}/publications/${publication.id}/dataCitations`,
		);
		const addForm = cloneDeep(dataCitationEditForm);

		const {form, set, setAction} = useForm(addForm);
		setAction(apiUrl.value);
		openSideModal(DataCitationEditModal, {
			title: t('submission.dataCitations.addModal.title'),
			form: form,
			onSet: set,
			onSuccess: () => {
				finishedCallback();
			},
		});
	}

	function dataCitationEditDataCitation(
		{submission, publication, dataCitationEditForm, dataCitation},
		finishedCallback,
	) {
		if (!dataCitation.authors) {
			dataCitation.authors = [];
		}

		const {apiUrl} = useUrl(
			`submissions/${submission.id}/publications/${publication.id}/dataCitations/${dataCitation.id}`,
		);
		const editForm = cloneDeep(dataCitationEditForm);

		const {form, set, setValues, setAction, setMethod} = useForm(editForm);
		setValues(dataCitation);
		setAction(apiUrl.value);
		setMethod('PUT');
		openSideModal(DataCitationEditModal, {
			title: t('submission.dataCitations.editModal.title'),
			form: form,
			onSet: set,
			onSuccess: () => {
				finishedCallback();
			},
		});
	}

	function dataCitationDeleteDataCitation(
		{submission, publication, dataCitation},
		finishedCallback,
	) {
		openDialog({
			title: t('common.delete'),
			message: t('common.confirmDelete'),
			modalStyle: 'negative',
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: async (close) => {
						const {apiUrl} = useUrl(
							`submissions/${submission.id}/publications/${publication.id}/dataCitations/${dataCitation.id}`,
						);
						const {fetch} = useFetch(apiUrl.value, {
							method: 'DELETE',
						});
						await fetch();
						finishedCallback();
						close();
					},
				},
				{
					label: t('common.cancel'),
					isSecondary: true,
					callback: (close) => {
						close();
					},
				},
			],
		});
	}

	return {
		dataCitationAddDataCitation,
		dataCitationEditDataCitation,
		dataCitationDeleteDataCitation,
	};
}
