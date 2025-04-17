import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {replaceLocaleParams} from '@/utils/i18n.js';
import {cloneDeep} from 'lodash';
import ReviewerRecommendationsEditModal from './ReviewerRecommendationsEditModal.vue';
import {escapeHtml} from '@/directives/stripUnsafeHtml';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';

export const useReviewerRecommendationManagerStore = defineComponentStore(
	'reviewerRecommendationManager',
	(props) => {
		const {apiUrl} = useUrl('reviewers/recommendations');
		const {
			data: recommendations,
			fetch: fetchRecommendations,
			isLoading: isRecommendationsLoading,
		} = useFetch(apiUrl);
		const {openDialog, openSideModal} = useModal();
		const {t, localize} = useLocalize();

		const items = computed({
			get: () => recommendations.value?.items || [],
			set: (newValue) => {
				if (recommendations.value) {
					recommendations.value.items = newValue;
				}
			},
		});

		const itemsMax = computed(() => recommendations.value?.itemsMax || 0);

		async function toggleStatus({id, newStatus}) {
			const {isSuccess, fetch} = useFetch(`${apiUrl.value}/${id}/status`, {
				method: 'PUT',
				body: {
					status: Number(newStatus),
				},
			});

			await fetch();
			return isSuccess.value;
		}

		async function deleteRecommendation({id}) {
			const {isSuccess, fetch} = useFetch(`${apiUrl.value}/${id}`, {
				method: 'DELETE',
			});

			await fetch();
			return isSuccess.value;
		}

		async function handleStatusToggle(item, event) {
			const newStatus = !item.status;

			openDialog({
				name: 'edit',
				title: newStatus
					? t('manager.reviewerRecommendations.activate.title')
					: t('manager.reviewerRecommendations.deactivate.title'),
				message: replaceLocaleParams(
					item.status
						? t('manager.reviewerRecommendations.confirmDeactivate')
						: t('manager.reviewerRecommendations.confirmActivate'),
					{
						title: escapeHtml(localize(item.title)),
					},
				),
				actions: [
					{
						label: t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							const success = await toggleStatus({
								id: item.id,
								newStatus,
							});
							if (success) {
								await fetchRecommendations();
							}
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
				message: replaceLocaleParams(
					t('manager.reviewerRecommendations.confirmDelete'),
					{
						title: escapeHtml(localize(item.title)),
					},
				),
				actions: [
					{
						label: t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							const success = await deleteRecommendation({
								id: item.id,
							});
							if (success) {
								await fetchRecommendations();
							}
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

		// Initial data fetch
		fetchRecommendations();

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
