import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {replaceLocaleParams} from '@/utils/i18n.js';
import {useReviewerRecommendationManagerActions} from './reviewerRecommendationManagerActions';
import {cloneDeep} from 'lodash';
import ReviewerRecommendationsEditModal from './ReviewerRecommendationsEditModal.vue';
import {escapeHtml} from '@/directives/stripUnsafeHtml';

export const useReviewerRecommendationManagerStore = defineComponentStore(
	'reviewerRecommendationManager',
	(props) => {
		const {data: recommendations, fetch: fetchRecommendations} = useFetch(
			props.apiUrl,
		);
		const {openDialog, openSideModal, closeSideModal} = useModal();
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

		// Pass apiUrl from props to actions
		const _actionFns = useReviewerRecommendationManagerActions(props.apiUrl);

		async function handleStatusToggle(item, event) {
			const newStatus = !item.status;

			openDialog({
				name: 'edit',
				title: newStatus ? props.activateTitle : props.deactivateTitle,
				message: replaceLocaleParams(
					item.status
						? props.confirmDeactivateMessage
						: props.confirmActivateMessage,
					{
						title: escapeHtml(localize(item.title)),
					},
				),
				actions: [
					{
						label: t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							const success = await _actionFns.toggleStatus({
								id: item.id,
								newStatus,
							});
							if (success) {
								// Only update the specific item's status
								items.value.forEach((i) => {
									if (i.id === item.id) {
										i.status = Number(newStatus);
									}
								});
								// Update the checkbox state
								if (event?.target) {
									event.target.checked = newStatus;
								}
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
				close: () => {
					// Reset checkbox state on dialog close
					if (event?.target) {
						event.target.checked = item.status;
					}
				},
			});
		}

		async function handleDelete(item) {
			openDialog({
				name: 'delete',
				title: props.deleteRecommendationLabel,
				message: replaceLocaleParams(props.confirmDeleteMessage, {
					title: escapeHtml(localize(item.title)),
				}),
				actions: [
					{
						label: t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							const success = await _actionFns.deleteRecommendation({
								id: item.id,
							});
							if (success) {
								// Update the items using the setter
								items.value = items.value.filter((i) => i.id !== item.id);
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

		function handleAdd() {
			const activeForm = cloneDeep(props.form);
			activeForm.action = props.apiUrl;
			activeForm.method = 'POST';

			// Initialize multilingual fields properly
			activeForm.fields = activeForm.fields.map((field) => {
				const baseField = {...field};
				if (field.isMultilingual) {
					baseField.value = {};
					Object.keys(field.locales || {}).forEach((locale) => {
						baseField.value[locale] = '';
					});
				} else {
					baseField.value = field.value || '';
				}
				return baseField;
			});

			openSideModal(ReviewerRecommendationsEditModal, {
				title: props.addRecommendationLabel,
				activeForm,
				onUpdateForm: (formId, data) => {
					Object.keys(data).forEach((key) => {
						activeForm[key] = data[key];
					});
				},
				onFormSuccess: (result) => {
					items.value = [...items.value, result];
					pkp.eventBus.$emit('add:recommendation', result);
					closeSideModal(ReviewerRecommendationsEditModal);
				},
			});
		}

		function handleEdit(item) {
			const activeForm = cloneDeep(props.form);
			activeForm.action = `${props.apiUrl}/${item.id}`;
			activeForm.method = 'PUT';

			activeForm.fields = activeForm.fields.map((field) => {
				const baseField = {...field};

				if (field.isMultilingual) {
					baseField.value = {};
					Object.keys(field.locales || {}).forEach((locale) => {
						baseField.value[locale] = '';
					});
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

			openSideModal(ReviewerRecommendationsEditModal, {
				title: props.editRecommendationLabel,
				activeForm,
				onUpdateForm: (formId, data) => {
					Object.keys(data).forEach((key) => {
						activeForm[key] = data[key];
					});
				},
				onFormSuccess: (result) => {
					items.value = items.value.map((i) => (i.id === item.id ? result : i));
					pkp.eventBus.$emit('update:recommendation', result);
					closeSideModal(ReviewerRecommendationsEditModal);
				},
			});
		}

		// Initial data fetch
		fetchRecommendations();

		return {
			items,
			itemsMax,
			apiUrl: props.apiUrl,
			handleStatusToggle,
			handleDelete,
			handleAdd,
			handleEdit,
			fetchRecommendations,
		};
	},
);
