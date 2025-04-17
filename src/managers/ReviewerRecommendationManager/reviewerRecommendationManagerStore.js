import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed, ref} from 'vue';
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
		const {data: recommendations, fetch: fetchRecommendations} =
			useFetch(apiUrl);
		const {openDialog, openSideModal, closeSideModal} = useModal();
		const {t, localize} = useLocalize();
		const currentForm = ref({});

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

		async function setupRecommendationForm(item = null) {
			let preparedForm = cloneDeep(props.form);

			if (!item) {
				// Adding new recommendation
				preparedForm.action = apiUrl.value;
				preparedForm.method = 'POST';
			} else {
				// Editing existing recommendation
				preparedForm.action = `${apiUrl.value}/${item.id}`;
				preparedForm.method = 'PUT';
				preparedForm.fields = preparedForm.fields.map((field) => {
					const baseField = {...field};

					if (field.isMultilingual) {
						baseField.value = {};
						if (item[field.name]) {
							Object.keys(item[field.name]).forEach((locale) => {
								baseField.value[locale] = item[field.name][locale];
							});
						}
					} else {
						baseField.value =
							item[field.name] !== undefined
								? item[field.name]
								: field.value || '';
					}

					return baseField;
				});
			}

			currentForm.value = preparedForm;
		}

		function openRecommendationFormModal(title) {
			const {form} = useForm(currentForm);
			openSideModal(ReviewerRecommendationsEditModal, {
				title,
				formProps: form,
				onRecommendationSaved: recommendationSaved,
				onUpdateForm: (formId, data) => {
					Object.keys(data).forEach((key) => {
						form.value[key] = data[key];
					});
				},
			});
		}

		async function recommendationSaved(recommendation) {
			closeSideModal(ReviewerRecommendationsEditModal);
			await fetchRecommendations();
		}

		function handleAdd() {
			setupRecommendationForm();
			openRecommendationFormModal(t('grid.action.addReviewerRecommendation'));
		}

		function handleEdit(item) {
			setupRecommendationForm(item);
			openRecommendationFormModal(t('grid.action.editReviewerRecommendation'));
		}

		// Initial data fetch
		fetchRecommendations();

		return {
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
