import {ref, computed, inject, onMounted, markRaw} from 'vue';
import {useApp} from '@/composables/useApp';
import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import NavigationMenuManagerField from './NavigationMenuManagerField.vue';

/**
 * Composable for Navigation Menu Form management
 * Creates and manages a JS-driven form for navigation menu CRUD operations
 *
 * @param {Object} options - Configuration options
 * @param {Object|null} options.navigationMenu - Existing navigation menu data for editing, null for creating
 * @param {string} options.apiUrl - Base API URL for navigation menus (full URL)
 * @param {Object|null} options.legacyOptions - Legacy modal handler options for triggering grid refresh
 * @returns {Object} Form state and methods
 */
export function useNavigationMenuManagerForm({
	navigationMenu = null,
	apiUrl,
	legacyOptions = null,
} = {}) {
	const {t} = useLocalize();
	const {getNavigationMenuMaxDepth} = useApp();
	const maxDepth = getNavigationMenuMaxDepth();
	const closeModal = inject('closeModal');

	// State
	const navigationMenuRef = ref(navigationMenu);
	const isEditMode = computed(() => !!navigationMenuRef.value?.id);
	const assignedItems = ref([]);
	const unassignedItems = ref([]);
	const areaOptions = ref([{label: t('common.none'), value: ''}]);
	const isLoadingItems = ref(true);

	const formId = isEditMode.value
		? `navigationMenuEdit-${navigationMenuRef.value.id}`
		: 'navigationMenuAdd';

	// Initialize useForm
	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		set,
		addFieldText,
		addFieldSelect,
		addFieldComponent,
		getField,
	} = useForm({}, {customSubmit: handleFormSubmission});

	/**
	 * Fetch navigation menu areas from the active theme
	 */
	async function fetchMenuAreas() {
		const areasUrl = `${apiUrl}/areas`;
		const {data, fetch, isSuccess} = useFetch(areasUrl, {method: 'GET'});

		await fetch();

		if (isSuccess.value && data.value?.areas) {
			const areas = data.value.areas;
			areaOptions.value = [
				{label: t('common.none'), value: ''},
				...areas.map((area) => ({
					label: area,
					value: area,
				})),
			];
			// Update the field options
			const areaField = getField('areaName');
			if (areaField) {
				areaField.options = areaOptions.value;
			}
		}
	}

	/**
	 * Normalize items to use menuItemId as the id
	 * This ensures consistent identifiers throughout the DND system
	 */
	function normalizeItems(items) {
		return items.map((item) => ({
			...item,
			id: item.menuItemId, // Use menuItemId as the unique identifier
			children: item.children ? normalizeItems(item.children) : [],
		}));
	}

	/**
	 * Fetch menu items (assigned and unassigned)
	 */
	async function fetchMenuItems() {
		isLoadingItems.value = true;

		const menuId = navigationMenuRef.value?.id;
		const itemsUrl = menuId ? `${apiUrl}/${menuId}/items` : `${apiUrl}/items`;

		const {data, fetch, isSuccess} = useFetch(itemsUrl, {method: 'GET'});

		await fetch();

		if (isSuccess.value && data.value) {
			// Normalize items so id = menuItemId for consistent DND operations
			assignedItems.value = normalizeItems(data.value.assigned || []);
			unassignedItems.value = normalizeItems(data.value.unassigned || []);
		}

		isLoadingItems.value = false;
	}

	/**
	 * Convert hierarchical items to flat menuTree array for API submission
	 */
	function convertToMenuTree(items, parentId = null, startSeq = 0) {
		const menuTree = [];
		let seq = startSeq;

		for (const item of items) {
			menuTree.push({
				menuItemId: item.menuItemId,
				seq: seq,
				parentId: parentId,
			});
			seq++;

			if (item.children && item.children.length > 0) {
				const childTree = convertToMenuTree(item.children, item.menuItemId, 0);
				menuTree.push(...childTree);
			}
		}

		return menuTree;
	}

	/**
	 * Handle assigned items update from NavigationMenuEditor
	 */
	function handleAssignedItemsUpdate(items) {
		assignedItems.value = items;
	}

	/**
	 * Handle unassigned items update from NavigationMenuEditor
	 */
	function handleUnassignedItemsUpdate(items) {
		unassignedItems.value = items;
	}

	/**
	 * Handle form submission
	 */
	async function handleFormSubmission(formData) {
		const menuId = navigationMenuRef.value?.id;
		const menuTree = convertToMenuTree(assignedItems.value);

		const body = {
			title: formData.title,
			areaName: formData.areaName || '',
			menuTree: menuTree,
		};

		const submitUrl = menuId ? `${apiUrl}/${menuId}` : apiUrl;
		const method = menuId ? 'PUT' : 'POST';

		const {fetch, data, validationError, isSuccess} = useFetch(submitUrl, {
			method,
			body,
			expectValidationError: true,
		});

		await fetch();

		if (isSuccess.value) {
			// Trigger grid refresh for legacy grid
			// Use the modal handler to trigger the dataChanged event which will propagate to the grid
			if (legacyOptions?.modalHandler) {
				const $handlerElement = legacyOptions.modalHandler.getHtmlElement();
				if ($handlerElement) {
					$handlerElement.trigger('dataChanged');
				}
			}
			closeModal();
		}

		return {
			data: data.value,
			validationError: validationError.value,
			isSuccess: isSuccess.value,
		};
	}

	// Initialize the form
	initEmptyForm(formId, {
		showErrorFooter: false,
		canSubmit: true,
		spacingVariant: 'fullWidth',
	});

	addPage('default', {
		submitButton: {label: t('common.save')},
		cancelButton: {label: t('common.cancel')},
	});

	addGroup('default', {});

	addFieldText('title', {
		groupId: 'default',
		label: t('manager.navigationMenus.form.title'),
		size: 'large',
		value: navigationMenuRef.value?.title || '',
		isRequired: true,
	});

	addFieldSelect('areaName', {
		groupId: 'default',
		label: t('manager.navigationMenus.form.navigationMenuArea'),
		description: t('manager.navigationMenus.form.navigationMenuAreaMessage'),
		options: areaOptions.value,
		value: navigationMenuRef.value?.areaName || '',
		size: 'large',
	});

	addFieldComponent('menuEditor', {
		groupId: 'default',
		component: markRaw(NavigationMenuManagerField),
		componentProps: {
			assignedItems,
			unassignedItems,
			maxDepth,
			isLoading: isLoadingItems,
			'onUpdate:assignedItems': handleAssignedItemsUpdate,
			'onUpdate:unassignedItems': handleUnassignedItemsUpdate,
		},
	});

	// Load data on mount
	onMounted(async () => {
		await Promise.all([fetchMenuAreas(), fetchMenuItems()]);
	});

	return {
		form,
		set,
		isEditMode,
		isLoadingItems,
		assignedItems,
		unassignedItems,
	};
}
