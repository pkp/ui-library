import {computed, ref} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import EditCategoryFormModal from '@/managers/CategoryManager/EditCategoryFormModal.vue';
import {useForm} from '@/composables/useForm';

const Actions = {
	CATEGORY_EDIT: 'categoryEdit',
	CATEGORY_ADD: 'categoryAdd',
	CATEGORY_DELETE: 'categoryDelete',
};

const ActionFormLabel = {
	[Actions.CATEGORY_EDIT]: 'Edit category',
	[Actions.CATEGORY_ADD]: 'Add category',
};
export const useCategoryManagerStore = defineComponentStore(
	'categoryManagerStore',
	(props) => {
		const {apiUrl} = useUrl('categories');
		const {t} = useLocalize();

		const _categories = ref(props.categories || []);
		const _expandedIds = ref(new Set());
		const isOrdering = ref(false);
		const isLoading = ref(false);

		const columns = computed(() => props.columns);
		const expanded = computed(() => Array.from(_expandedIds.value));

		const categories = computed(() => _categories.value);
		const currentCategoryForm = ref({});
		const categoryForm = props.categoryForm; // Blank form used only for adding new categories

		// Store categories at the start of ordering. This will allow to reset data if user cancels ordering.
		const _categoriesBeforeReordering = ref([]);
		// IDs of expanded categories will be cleared at the start of ordering to collapse all expanded items.
		// This will store the IDs of expanded categories at the start of ordering to allow re-expansion after ordering is completed/cancled.
		const _expandedIdsBeforeOrdering = ref(new Set());

		/**
		 * Prepares the form data for Adding/Editing a Category
		 * @param {Object} category - Category object which is being edited or a sub category is being added to.
		 * This wil be null when adding a top level Category.
		 * @param {string} action - Action being performed. One of Actions.CATEGORY_ADD or Actions.CATEGORY_EDIT.
		 */
		async function setupCategoryForm(category, action) {
			// Get a deep copy of the form to eliminate references
			let preparedForm = JSON.parse(JSON.stringify(categoryForm));
			category = category || {};

			// If adding a new Category as sub category of an existing one, then set existing category ID as parent ID of new the category
			if (Object.entries(category).length && action === Actions.CATEGORY_ADD) {
				preparedForm.action = `${preparedForm.action}?parentCategoryId=${category.id}`;
			}

			// return empty form if adding a new category
			if (!Object.entries(category).length || action === Actions.CATEGORY_ADD) {
				currentCategoryForm.value = preparedForm;
				return;
			}

			// Prepare form for editing existing category
			if (Object.entries(category).length && action === Actions.CATEGORY_EDIT) {
				preparedForm = await getEditForm(category.id);
				preparedForm.method = 'PUT';
				preparedForm.action = `${preparedForm.action}/${category.id}`;
			}
			currentCategoryForm.value = preparedForm;
		}

		/**
		 * Get configured form to edit a category.
		 */
		async function getEditForm(categoryId) {
			const url =
				apiUrl.value + `/categoryFormComponent?categoryId=${categoryId}`;
			const {fetch, data} = useFetch(url, {method: 'GET'});
			await fetch();
			return data.value;
		}

		function getItemActions() {
			return [
				{
					label: t('common.add'),
					icon: 'Add',
					name: Actions.CATEGORY_ADD,
				},
				{
					label: t('common.edit'),
					icon: 'Edit',
					name: Actions.CATEGORY_EDIT,
				},
				{
					label: t('common.delete'),
					icon: 'Cancel',
					name: Actions.CATEGORY_DELETE,
					isWarnable: true,
				},
			];
		}

		async function handleItemAction(actionName, category = null) {
			if (actionName === Actions.CATEGORY_DELETE) {
				deleteCategory(category);
			} else if (
				actionName === Actions.CATEGORY_ADD ||
				actionName === Actions.CATEGORY_EDIT
			) {
				await setupCategoryForm(category, actionName);
				openCategoryFormModal(ActionFormLabel[actionName]);
			}
		}

		/***
		 * Deletes a category.
		 */
		function deleteCategory(category) {
			const {openDialog, openDialogNetworkError} = useModal();
			const {apiUrl} = useUrl(`categories/${category.id}`);
			const {fetch: fetchDelete, isSuccess} = useFetch(apiUrl, {
				method: 'DELETE',
			});

			openDialog({
				actions: [
					{
						label: t('common.ok'),
						isWarnable: true,
						callback: async (close) => {
							await fetchDelete();
							close();
							if (!isSuccess.value) {
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
		}

		/**
		 * Open the form modal to add/edit category.
		 */
		function openCategoryFormModal(title) {
			const {openSideModal} = useModal();
			const {form} = useForm(currentCategoryForm);
			openSideModal(EditCategoryFormModal, {
				title,
				formProps: form,
				onCategorySaved: categorySaved,
			});
		}

		/**
		 * Function to execute when a category is successfully saved via form.
		 */
		async function categorySaved(category) {
			pkp.eventBus.$emit('notify', t('manager.category.saved'), 'success');
			closeCategoryFormModal();
			await refreshCategories();

			// If saved category has a parent then expand parent to have saved category displayed
			if (category.parentId) {
				_expandedIds.value.add(category.parentId);
			}
		}

		/**
		 * Close the currently opened category form modal.
		 */
		function closeCategoryFormModal() {
			const {closeSideModal} = useModal();
			closeSideModal(EditCategoryFormModal);
		}

		/**
		 * Loads updated list of categories from API.
		 */
		async function refreshCategories() {
			isLoading.value = true;
			const {data, fetch} = useFetch(apiUrl, {method: 'GET'});
			await fetch();
			_categories.value = data.value;
			isLoading.value = false;
		}

		/**
		 * Expand or collapse a parent in the category tree.
		 * @param id - The ID of the category to expand/collapse.
		 * */
		function toggleItemExpansion(id) {
			if (_expandedIds.value.has(id)) {
				_expandedIds.value.delete(id);
			} else {
				_expandedIds.value.add(id);
			}
		}

		/** Move an item up in the list.
		 * @param {Object} item  - The item to move
		 */
		function itemOrderUp(item) {
			const index = categories.value.findIndex((obj) => {
				return item.id === obj.id;
			});
			if (index === 0) {
				return;
			}
			let newCategoriesList = [...categories.value];
			newCategoriesList.splice(
				index - 1,
				0,
				newCategoriesList.splice(index, 1)[0],
			);
			_categories.value = newCategoriesList;
		}

		/** Move an item down in the list.
		 * @param {Object} item - The item to move.
		 */
		function itemOrderDown(item) {
			const index = categories.value.findIndex((obj) => {
				return item.id === obj.id;
			});
			if (index === categories.value.length - 1) {
				return;
			}
			let newCategoriesList = [...categories.value];
			newCategoriesList.splice(
				index + 1,
				0,
				newCategoriesList.splice(index, 1)[0],
			);
			_categories.value = newCategoriesList;
		}

		/**
		 * Cancel ordering.
		 */
		function cancelOrdering() {
			isOrdering.value = false;
			_categories.value = _categoriesBeforeReordering.value;
			_categoriesBeforeReordering.value = null;
			_expandedIds.value = new Set([..._expandedIdsBeforeOrdering.value]);
			_expandedIdsBeforeOrdering.value = null;
		}

		/**
		 * Submit ordering to API to be saved.
		 */
		async function saveOrdering() {
			isLoading.value = true;

			const sortedCategories = categories.value.map((obj, index) => ({
				seq: index + 1,
				id: obj.id,
			}));

			const url = apiUrl.value + `/saveOrder`;
			const {fetch, isSuccess} = useFetch(url, {
				method: 'PUT',
				body: JSON.stringify(sortedCategories),
			});
			await fetch();

			if (isSuccess.value) {
				await refreshCategories();
				_expandedIds.value = new Set([..._expandedIdsBeforeOrdering.value]);
				isOrdering.value = false;
				pkp.eventBus.$emit('notify', t('common.changesSaved'), 'success');
			}

			isLoading.value = false;
		}

		function initOrdering() {
			_categoriesBeforeReordering.value = _categories.value;
			_expandedIdsBeforeOrdering.value = new Set([..._expandedIds.value]);
			_expandedIds.value.clear(); // Clear entries in order to collapse all expanded items.
			isOrdering.value = true;
		}

		return {
			getItemActions,
			handleItemAction,
			toggleItemExpansion,
			cancelOrdering,
			initOrdering,
			saveOrdering,
			itemOrderUp,
			itemOrderDown,
			isOrdering,
			columns,
			categories,
			expanded,
			isLoading,
		};
	},
);
