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
		const isLoading = ref(false);

		const columns = computed(() => props.columns);
		const expanded = computed(() => Array.from(_expandedIds.value));

		const categories = computed(() => _categories.value);
		const currentCategoryForm = ref({});
		const categoryForm = props.categoryForm; // Blank form used only for adding new categories

		/**
		 * Prepares the form data for adding or editing a category.
		 * - When adding a new category, it initializes the form with default values.
		 * - When editing an existing category, it fetches the form data for the specified category.
		 * @param {Object|null} category - The category object being edited or the parent category for a new subcategory.
		 *                                 Pass `null` when adding a top-level category.
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

			// return empty form if adding a new top-level category
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
		 * @param {number} categoryId - The ID of the category to edit.
		 * @return {Promise<Object>} - The populated form for editing the category.
		 */
		async function getEditForm(categoryId) {
			const url =
				apiUrl.value + `/categoryFormComponent?categoryId=${categoryId}`;
			const {fetch, data} = useFetch(url, {method: 'GET'});
			await fetch();
			return data.value;
		}

		/**
		 * Get the actions available for a category item.
		 * @returns {Array<{ label: string, icon: string, name: string, isWarnable?: boolean}>} - The list of actions available for the category item.
		 */
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

		/*
		 * Handle the selected action for a category item.
		 * @param {string} actionName - The name of the action to perform.
		 * @param {Object|null} category - The category object to perform the action on. This will be null when adding a top-level category.
		 */
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
		 * @param {Object} category - The category to delete.
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
		 * @param {string} title - The title to display in the modal.
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
		 * @param {Object} category - The saved category object.
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
		 * @
		 * Expand or collapse a parent in the category tree.
		 * @param {number} id - The ID of the category to expand/collapse.
		 * */
		function toggleItemExpansion(id) {
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
			isLoading,
		};
	},
);
