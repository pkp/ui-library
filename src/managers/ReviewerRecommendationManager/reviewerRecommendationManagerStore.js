import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {cloneDeep} from 'lodash';
import ReviewerRecommendationsEditModal from './ReviewerRecommendationsEditModal.vue';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';

export const useReviewerRecommendationManagerStore = defineComponentStore(
	'reviewerRecommendationManager',
	(props) => {
		const {apiUrl} = useUrl('reviewers/recommendations');
		const {openDialog, openSideModal} = useModal();
		const {t, localize} = useLocalize();

		const {
			data: recommendations,
			fetch: fetchRecommendations,
			isLoading: isRecommendationsLoading,
		} = useFetch(apiUrl);

		// Initial data fetch
		fetchRecommendations();

		const items = computed(() => recommendations.value?.items || []);
		const itemsMax = computed(() => recommendations.value?.itemsMax || 0);

		async function toggleStatus({id, newStatus}) {
			const {fetch} = useFetch(`${apiUrl.value}/${id}/status`, {
				method: 'PUT',
				body: {
					status: Number(newStatus),
				},
			});

			await fetch();
		}

		async function deleteRecommendation({id}) {
			const {fetch} = useFetch(`${apiUrl.value}/${id}`, {
				method: 'DELETE',
			});

			await fetch();
		}

		async function handleStatusToggle(item, event) {
			const newStatus = !item.status;

			openDialog({
				title: newStatus
					? t('manager.reviewerRecommendations.activate.title')
					: t('manager.reviewerRecommendations.deactivate.title'),
				message: item.status
					? t('manager.reviewerRecommendations.confirmDeactivate', {
							title: localize(item.title),
						})
					: t('manager.reviewerRecommendations.confirmActivate', {
							title: localize(item.title),
						}),
				actions: [
					{
						label: t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							await toggleStatus({
								id: item.id,
								newStatus,
							});
							await fetchRecommendations();
							close();
						},
					},
					{
						label: t('common.no'),
						isWarnable: true,
						callback: (close) => close(),
					},
				],
			});
		}

		async function handleDelete(item) {
			openDialog({
				name: 'delete',
				title: t('grid.action.deleteReviewerRecommendation'),
				message: t('manager.reviewerRecommendations.confirmDelete', {
					title: localize(item.title),
				}),
				actions: [
					{
						label: t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							await deleteRecommendation({
								id: item.id,
							});
							await fetchRecommendations();
							close();
						},
					},
					{
						label: t('common.no'),
						isWarnable: true,
						callback: (close) => close(),
					},
				],
			});
		}

		function openRecommendationFormModal(title, form) {
			openSideModal(
				ReviewerRecommendationsEditModal,
				{
					title,
					formProps: form,
				},
				{
					onClose: async () => {
						await fetchRecommendations();
					},
				},
			);
		}

		function handleAdd() {
			const newForm = cloneDeep(props.form);
			const {setAction, setMethod} = useForm(newForm);
			setAction(apiUrl.value);
			setMethod('POST');

			openRecommendationFormModal(
				t('grid.action.addReviewerRecommendation'),
				newForm,
			);
		}

		function handleEdit(item) {
			const editForm = cloneDeep(props.form);
			const {setValues, setAction, setMethod} = useForm(editForm);
			setAction(`${apiUrl.value}/${item.id}`);
			setMethod('PUT');
			setValues(item);
			openRecommendationFormModal(
				t('grid.action.editReviewerRecommendation'),
				editForm,
			);
		}

		return {
			isRecommendationsLoading,
			items,
			itemsMax,
			handleStatusToggle,
			handleDelete,
			handleAdd,
			handleEdit,
			fetchRecommendations,
		};
	},
);
