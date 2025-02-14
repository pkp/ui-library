import {computed, ref, nextTick, watch} from 'vue';
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
		const _currentCategory = ref({});
		const _currentAction = ref({});

		const columns = computed(() => props.columns);
		const expanded = computed(() => Array.from(_expandedIds.value));

		const categories = computed(() => _categories.value);

		const currentCategoryForm = ref({});
		const categoryForm = props.categoryForm; //blank form

		watch(_currentCategory, (newVal) => {
			setCurrentCategoryForm(newVal);
		});

		function setCurrentCategoryForm(category) {
			// Get a deep copy of the form to eliminate references
			let preparedForm = JSON.parse(JSON.stringify(categoryForm));

			// If we are adding a new Category as sub category of an existing one, then set existing category ID as parent ID of new category
			if (
				Object.entries(category).length &&
				_currentAction.value === Actions.CATEGORY_ADD
			) {
				preparedForm.fields.map((field) => {
					if (field.name === 'parentId') {
						field.value = category.value.id;
					}
				});
			}

			// return empty form if adding a new, top level category
			if (
				!category ||
				!Object.entries(category).length ||
				_currentAction.value === Actions.CATEGORY_ADD
			) {
				currentCategoryForm.value = preparedForm;
				return;
			}

			// Prepare form for editing existing category
			if (Object.entries(category).length) {
				preparedForm.method = 'PUT';
				preparedForm.action = category._href;
				props = Object.keys(category);

				preparedForm.fields = preparedForm.fields.map((field) => {
					if (props.includes(field.name)) {
						field.value = field.isMultilingual
							? {...category[field.name]}
							: category[field.name];
					}

					if (field.name === 'subEditors') {
						field.value = category.assignedSubeditors;
					}
					return field;
				});
			}
			currentCategoryForm.value = preparedForm;
		}

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

		async function handleItemAction(actionName, category = null) {
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
			} else if (
				[Actions.CATEGORY_ADD, Actions.CATEGORY_EDIT].includes(actionName)
			) {
				_currentAction.value = actionName;
				_currentCategory.value = category || {};
				openCategoryFormModal(ActionFormLabel[actionName]);
			}
		}

		function openCategoryFormModal(title, actionName) {
			if (
				![Actions.CATEGORY_ADD, Actions.CATEGORY_EDIT].includes(
					_currentAction.value,
				)
			) {
				return;
			}

			const {openSideModal} = useModal();
			nextTick(() => {
				openSideModal(EditCategory, {
					title,
					currentTemplateForm: currentCategoryForm,
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
