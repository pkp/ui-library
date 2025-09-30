import {useForm} from '@/composables/useForm';
import CitationEditModal from '@/managers/CitationManager/modals/CitationEditModal.vue';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';

export const Actions = {
	CITATION_EDIT_CITATION: 'citationEditCitation',
	CITATION_DELETE_CITATION: 'citationDeleteCitation',
	CITATION_REPROCESS_CITATION: 'citationReprocessCitation',
};

export function useCitationManagerActions() {
	const {openDialog, openSideModal} = useModal();
	const {t} = useLocalize();

	function citationEditCitation(
		{publication, componentForms, citation},
		finishedCallback,
	) {
		if (!citation.authors) {
			citation.authors = [];
		}
		let formName = 'citationRawEditForm';
		if (publication.citationsMetadataLookup) {
			formName = 'citationStructuredEditForm';
		}

		const {apiUrl} = useUrl(`citations`);

		const {form, set, setValues, setAction} = useForm(componentForms[formName]);
		setValues(citation);
		setAction(`${apiUrl.value}/${citation.id}`);
		openSideModal(CitationEditModal, {
			title: t('submission.citations.structured.editModal.title'),
			form: form,
			onSet: set,
			citation: citation,
			onSuccess: () => {
				finishedCallback();
			},
		});
	}

	function citationDeleteCitation(
		{publication, componentForms, citation},
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
						const {apiUrl} = useUrl(`citations`);
						const {fetch} = useFetch(`${apiUrl.value}/${citation.id}`, {
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

	function citationReprocessCitation({citation}, finishedCallback) {
		openDialog({
			title: 'Are you sure you want to reprocess this citation?',
			message: '',
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: async (close) => {
						const {apiUrl} = useUrl(`citations`);
						const {fetch} = useFetch(
							`${apiUrl.value}/${citation.id}/reprocessCitation`,
							{
								method: 'POST',
								body: {},
							},
						);
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
		citationEditCitation,
		citationDeleteCitation,
		citationReprocessCitation,
	};
}
