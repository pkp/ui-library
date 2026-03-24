import {useForm} from '@/composables/useForm';
import FunderEditModal from '@/managers/FunderManager/modals/FunderEditModal.vue';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {cloneDeep} from 'lodash';
import {useFetch} from '@/composables/useFetch';

export const Actions = {
	FUNDERS_ADD_FUNDER: 'fundersAddFunder',
	FUNDERS_EDIT_FUNDER: 'fundersEditFunder',
	FUNDERS_DELETE_FUNDER: 'fundersDeleteFunder',
};
export function useFunderManagerActions() {
	const {openDialog, openSideModal} = useModal();
	const {t} = useLocalize();

	function fundersAddFunder(
		{submission, publication, funderEditForm},
		finishedCallback,
	) {
		const {apiUrl} = useUrl(
			`submissions/${submission.id}/publications/${publication.id}/funders`,
		);
		const addForm = cloneDeep(funderEditForm);

		const {form, set, setAction, setLocalesForSubmission} = useForm(addForm);

		setLocalesForSubmission(submission);
		form.value.fields.find(f => f.name === 'funder').supportedFormLocales = form.value.supportedFormLocales;

		setAction(apiUrl.value);
		openSideModal(FunderEditModal, {
			title: t('submission.funders.addFunder.title'),
			form: form,
			onSet: set,
			onSuccess: () => {
				finishedCallback();
			},
		});
	}

	function fundersEditFunder(
		{submission, publication, funderEditForm, funder},
		finishedCallback,
	) {
		const {apiUrl} = useUrl(
			`submissions/${submission.id}/publications/${publication.id}/funders/${funder.id}`,
		);
		const editForm = cloneDeep(funderEditForm);

		const {form, set, setValues, setAction, setMethod, setLocalesForSubmission} = useForm(editForm);

		setLocalesForSubmission(submission);
		form.value.fields.find(f => f.name === 'funder').supportedFormLocales = form.value.supportedFormLocales;

		setValues({
		funder: {
			id: funder.id,
			ror: funder.ror,
			name: funder.name,
			rorObject: funder.rorObject,
		},
		grants: funder.grants ?? [],
		});

		setAction(apiUrl.value);
		setMethod('PUT');
		openSideModal(FunderEditModal, {
			title: t('submission.funders.editFunder.title'),
			form: form,
			onSet: set,
			onSuccess: () => {
				finishedCallback();
			},
		});
	}

	function fundersDeleteFunder(
		{submission, publication, funder},
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
							`submissions/${submission.id}/publications/${publication.id}/funders/${funder.id}`,
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
		fundersAddFunder,
		fundersEditFunder,
		fundersDeleteFunder,
	};
}
