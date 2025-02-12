import {computed, ref} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';

// import {useDataChanged} from '@/composables/useDataChanged';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {getCSRFToken, useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import EditCategory from '@/managers/CategoryManager/EditCategory.vue';

const Actions = {
	CATEGORY_EDIT: 'categoryEdit',
	CATEGORY_ADD: 'categoryAdd',
	CATEGORY_DELETE: 'categoryDelete',
};
export const useCategoryManagerStore = defineComponentStore(
	'categoryManagerStore',
	(props) => {
		const _categories = ref(props.categories || []);
		const {apiUrl} = useUrl('categories');
		const _expandedIds = ref(new Set());
		const columns = computed(() => props.columns);
		const expanded = computed(() => Array.from(_expandedIds.value));
		const categories = computed(() => _categories.value);
		const currentCategoryForm = ref({});
		const {t} = useLocalize();

		function getItemActions() {
			return [
				{
					label: 'Edit',
					icon: 'Edit',
					name: Actions.CATEGORY_EDIT,
				},
				{
					label: 'Add',
					icon: 'Add',
					name: Actions.CATEGORY_ADD,
				},
				{
					label: 'Delete',
					icon: 'Cancel',
					name: Actions.CATEGORY_DELETE,
				},
			];
		}

		async function handleItemAction(actionName, category = {}) {
			if (actionName === Actions.CATEGORY_DELETE) {
				const {openDialog, openDialogNetworkError} = useModal();

				openDialog({
					actions: [
						{
							label: t('common.ok'),
							isWarnable: true,
							callback: async (close) => {
								const {url} = useLegacyGridUrl({
									component:
										'grid.settings.category.CategoryCategoryGridHandler',
									op: 'deleteCategory',
									params: {categoryId: category.value.id},
								});

								const formData = new FormData();
								formData.append('csrfToken', getCSRFToken());

								const {fetch, data} = useFetch(url, {
									method: 'POST',
									body: formData,
								});
								await fetch();
								close();

								if (data.value.status !== true) {
									openDialogNetworkError();
								} else {
									await refreshCategories();
								}
							},
						},
						{
							label: t('common.cancel'),
							callback: (close) => {
								close();
							},
						},
					],
					title: t('common.delete'),
					message: t('common.confirmDelete'),
					modalStyle: 'negative',
				});
			} else if (actionName === Actions.CATEGORY_EDIT) {
				alert('Edit category');
			} else if (actionName === Actions.CATEGORY_ADD) {
				openCategoryFormModal(category);
			}
		}

		function openCategoryFormModal(category) {
			currentCategoryForm.value = category; // create watcher
			const {openSideModal} = useModal();

			this.$nextTick(() => {
				openSideModal(EditCategory, {
					title: 'Add Category',
					currentTemplateForm: {name: 'hey world'},
				});
			});
		}
		async function refreshCategories() {
			const {data, fetch} = useFetch(apiUrl, {method: 'GET'});
			await fetch();
			_categories.value = data.value;
		}
		function toggleItemExpansion(item) {
			const id = item.value.id;

			if (_expandedIds.value.has(id)) {
				_expandedIds.value.delete(id);
			} else {
				_expandedIds.value.add(id);
			}
		}

		return {
			getItemActions,
			handleItemAction,
			toggleItemExpansion,
			columns,
			categories,
			expanded,
			Actions,
		};
	},
);
