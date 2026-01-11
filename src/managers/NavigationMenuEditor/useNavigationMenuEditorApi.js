import {ref} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';

/**
 * Composable for Navigation Menu API operations
 * Handles fetching menu items and updating form fields for submission
 *
 * @param {Object} options - Configuration options
 * @param {string} options.apiUrl - Base API URL for navigation menus
 * @param {string|number} options.navigationMenuId - The menu ID to fetch items for
 * @returns {Object} State and methods for API operations
 */
export function useNavigationMenuEditorApi(options = {}) {
	const {t} = useLocalize();

	// State
	const assignedItems = ref(null);
	const unassignedItems = ref(null);
	const isLoading = ref(true);
	const error = ref(null);

	/**
	 * Fetch menu items from the API
	 * @param {string} apiUrl - Base API URL
	 * @param {string|number} menuId - Navigation menu ID (optional for new menus)
	 */
	async function fetchMenuItems(apiUrl, menuId) {
		// Check if this is an existing menu (menuId is a valid positive number)
		const isExistingMenu = menuId && Number(menuId) > 0;

		isLoading.value = true;
		error.value = null;

		// For new menus (menuId is 0, null, or empty), use /items to get all available items
		// For existing menus, use /{menuId}/items to get assigned/unassigned
		const itemsUrl = isExistingMenu
			? `${apiUrl}/${menuId}/items`
			: `${apiUrl}/items`;

		const {data, fetch, isSuccess} = useFetch(itemsUrl, {
			method: 'GET',
		});

		await fetch();

		if (isSuccess.value && data.value) {
			assignedItems.value = data.value.assigned || [];
			unassignedItems.value = data.value.unassigned || [];
		} else {
			error.value = t('common.error');
		}

		isLoading.value = false;
	}

	/**
	 * Convert hierarchical items to flat menuTree format for form submission
	 * Format: menuTree[menuItemId] = { seq: number, parentId: number|null }
	 *
	 * @param {Array} items - Hierarchical menu items
	 * @param {number|null} parentId - Parent menu item ID
	 * @param {number} startSeq - Starting sequence number
	 * @returns {Object} Flat menuTree object
	 */
	function convertToMenuTree(items, parentId = null, startSeq = 0) {
		const menuTree = {};
		let seq = startSeq;

		for (const item of items) {
			menuTree[item.menuItemId] = {
				seq: seq,
				parentId: parentId,
			};
			seq++;

			// Process children recursively
			if (item.children && item.children.length > 0) {
				const childTree = convertToMenuTree(item.children, item.menuItemId, 0);
				Object.assign(menuTree, childTree);
			}
		}

		return menuTree;
	}

	/**
	 * Update hidden form fields with the menu tree data
	 * This allows the existing form Save button to submit the data
	 *
	 * @param {string} formId - The form element ID
	 */
	function updateFormFields(formId = 'navigationMenuForm') {
		// Remove any existing menuTree hidden fields
		const existingFields = document.querySelectorAll(
			'input[name^="menuTree["]',
		);
		existingFields.forEach((field) => field.remove());

		if (!assignedItems.value) return;

		// Convert to menuTree format
		const menuTree = convertToMenuTree(assignedItems.value);

		// Find the form
		const form = document.getElementById(formId);
		if (!form) return;

		// Create hidden fields for each menu item
		for (const [menuItemId, data] of Object.entries(menuTree)) {
			// Create seq field
			const seqField = document.createElement('input');
			seqField.type = 'hidden';
			seqField.name = `menuTree[${menuItemId}][seq]`;
			seqField.value = data.seq;
			form.appendChild(seqField);

			// Create parentId field if it exists
			if (data.parentId !== null) {
				const parentField = document.createElement('input');
				parentField.type = 'hidden';
				parentField.name = `menuTree[${menuItemId}][parentId]`;
				parentField.value = data.parentId;
				form.appendChild(parentField);
			}
		}
	}

	/**
	 * Handle assigned items update
	 * @param {Array} items - Updated assigned items
	 * @param {string} formId - The form element ID
	 */
	function handleAssignedItemsUpdate(items, formId = 'navigationMenuForm') {
		assignedItems.value = items;
		updateFormFields(formId);
	}

	/**
	 * Handle unassigned items update
	 * @param {Array} items - Updated unassigned items
	 */
	function handleUnassignedItemsUpdate(items) {
		unassignedItems.value = items;
	}

	return {
		// State
		assignedItems,
		unassignedItems,
		isLoading,
		error,

		// Methods
		fetchMenuItems,
		convertToMenuTree,
		updateFormFields,
		handleAssignedItemsUpdate,
		handleUnassignedItemsUpdate,
	};
}
