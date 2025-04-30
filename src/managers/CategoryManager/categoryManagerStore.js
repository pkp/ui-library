import {computed, ref} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useModal} from '@/composables/useModal';
import CategoryDeleteDialogBody from '@/managers/CategoryManager/CategoryDeleteDialogBody.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import EditCategoryFormModal from '@/managers/CategoryManager/EditCategoryFormModal.vue';
import {useForm} from '@/composables/useForm';
import {useCategoryManagerConfig} from '@/managers/CategoryManager/useCategoryManagerConfig';
import {useExtender} from '@/composables/useExtender';
import {cloneDeep} from 'lodash';

export const Actions = {
	CATEGORY_EDIT: 'categoryEdit',
	CATEGORY_ADD: 'categoryAdd',
	CATEGORY_DELETE: 'categoryDelete',
};
const {t} = useLocalize();
export const useCategoryManagerStore = defineComponentStore(
	'categoryManagerStore',
	(props) => {
		const {apiUrl} = useUrl('categories');
		const extender = useExtender();
		const categoryManagerConfig = extender.addFns(useCategoryManagerConfig());
		const {data: categories, fetch: fetchCategories} = useFetch(apiUrl, {
			method: 'GET',
		});

		const _expandedIds = ref(new Set());
		const columns = computed(() => categoryManagerConfig.getColumns());
		const expanded = computed(() => Array.from(_expandedIds.value));
		const categoryForm = props.categoryForm;
		fetchCategories();

		/**
		 * Get the form data for adding or editing a category.
		 * @param {Object|null} category - The category object being edited or the parent category for a new subcategory.
		 *                                 Pass `null` when adding a top-level category.
		 * @param {string} action - Action being performed. One of Actions.CATEGORY_ADD or Actions.CATEGORY_EDIT.
		 * @return {Object} - The category form.
		 */
		function getCategoryForm(category, action) {
			// Get a deep copy of the form to eliminate references
			let preparedForm = cloneDeep(categoryForm);
			const {setValues, setAction, setMethod} = useForm(preparedForm);

			category = category || {};

			// If adding a new Category as sub category of an existing one, then set existing category ID as parent ID of new the category
			if (Object.entries(category).length && action === Actions.CATEGORY_ADD) {
				setAction(`${preparedForm.action}?parentCategoryId=${category.id}`);
				return preparedForm;
			}

			// return empty form if adding a new top-level category
			if (!Object.entries(category).length || action === Actions.CATEGORY_ADD) {
				return preparedForm;
			}

			// Prepare form for editing existing category
			if (Object.entries(category).length && action === Actions.CATEGORY_EDIT) {
				setValues({
					...category,
					...transformAssignedEditorsToSubEditorFields(
						category.assignedEditors,
					),
				});
				setMethod('PUT');
				setAction(`${preparedForm.action}/${category.id}`);
			}

			return preparedForm;
		}

		/**
		 * Transforms the assigned editors data into form field entries for subEditor fields.
		 * @param {Array<{id: number, userGroupIds: Array<number>}>} assignedEditors - Array of assigned editor objects.
		 * @return {Object.<string, Array<number>>}  - The transformed object with subEditor fields.
		 * Example:
		 * ```
		 * {
		 *   subEditors[3]: [1, 2, 3],
		 * }
		 * ```
		 * In this example, the key `subEditors[3]` represents the group ID 3 (e.g. Journal editor), while the value is an array of editor IDs (1, 2, 3) assigned to that group.
		 */
		function transformAssignedEditorsToSubEditorFields(assignedEditors) {
			return assignedEditors.reduce((result, editor) => {
				editor.userGroupIds.forEach((userGroupId) => {
					const key = `subEditors[${userGroupId}]`;
					result[key] = result[key] || [];
					result[key].push(editor.id);
				});
				return result;
			}, {});
		}

		/**
		 * Get the actions available for a category item.
		 * @return {Array<{ label: string, icon: string, name: string, isWarnable?: boolean}>} - The list of actions available for the category item.
		 */
		function getItemActions({category}) {
			return categoryManagerConfig.getItemActions({category});
		}

		/***
		 * Deletes a category.
		 * @param {Object} category - The category to delete.
		 */
		function categoryDelete(category) {
			const {openDialog} = useModal();
			const {apiUrl} = useUrl(`categories/${category.id}`);
			const {fetch: fetchDelete, isSuccess} = useFetch(apiUrl, {
				method: 'DELETE',
			});

			const subCategoriesCount = getSubCategoriesCount(category);
			openDialog({
				bodyComponent: CategoryDeleteDialogBody,
				bodyProps: {
					onConfirm: async () => {
						await fetchDelete();

						if (isSuccess.value) {
							openCategoryDeletedDialog(
								category.localizedTitle,
								subCategoriesCount,
							);
							await fetchCategories();
						}
					},
					title: category.localizedTitle,
					subCategoryCount: subCategoriesCount,
				},
				title: t('manager.category.delete.confirmationTitle', {
					title: category.localizedTitle,
				}),
				message: t('manager.category.delete.message'),
				modalStyle: 'negative',
			});
		}

		/**
		 * Open a dialog indicating that the category was deleted.
		 * @param {string} title - Category title. Used in message displayed to user.
		 * @param {number} subCategoriesCount - The number of sub-categories deleted. Used in message displayed to user.
		 */
		function openCategoryDeletedDialog(title, subCategoriesCount) {
			const {openDialog} = useModal();

			openDialog({
				title: t('manager.category.deleted'),
				message: t('manager.category.deleted.description', {
					title,
					subCategoryCount: subCategoriesCount,
				}),

				actions: [
					{
						label: t('manager.category.backToCategories'),
						callback: (close) => close(),
					},
				],
				modalStyle: 'primary',
			});
		}

		/**
		 * Get the count of sub-categories for a given category.
		 * @param category - The category object to check.
		 */
		function getSubCategoriesCount(category) {
			if (!category.subCategories || category.subCategories.length === 0) {
				return 0;
			}

			let count = category.subCategories.length;

			for (const sub of category.subCategories) {
				count += getSubCategoriesCount(sub);
			}

			return count;
		}

		/**
		 * Open the form modal to add/edit category.
		 * @param {string} title - The title to display in the modal.
		 * @param {Object} form - The category form object to display in the modal.
		 */
		function openCategoryFormModal(title, form) {
			const {openSideModal} = useModal();
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
			await fetchCategories();

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
		 * Expand or collapse a parent in the category tree.
		 * @param {number} id - The ID of the category to expand/collapse.
		 */
		function toggleItemExpansion(id) {
			if (_expandedIds.value.has(id)) {
				_expandedIds.value.delete(id);
			} else {
				_expandedIds.value.add(id);
			}
		}

		/**
		 * Edit a category.
		 * @param {Object} category - The category object to edit.
		 */
		function categoryEdit(category) {
			openCategoryFormModal(
				t('grid.category.edit'),
				getCategoryForm(category, Actions.CATEGORY_EDIT),
			);
		}

		/**
		 * Add a new category.
		 * @param {Object|null} category - If provided, the new category will be added as a subcategory of this category.
		 */
		function categoryAdd(category = null) {
			openCategoryFormModal(
				t('grid.category.add'),
				getCategoryForm(category, Actions.CATEGORY_ADD),
			);
		}

		return {
			getItemActions,
			toggleItemExpansion,
			categoryEdit,
			categoryAdd,
			categoryDelete,
			columns,
			categories,
			expanded,
		};
	},
);
