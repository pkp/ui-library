import {ref, computed} from 'vue';

/**
 * Composable for managing item ordering with enable/disable state
 *
 * @function useOrdering
 * @param {Object} options - Configuration options
 * @param {Ref<Array>|ComputedRef<Array>} options.items - Reactive reference to the array of items to order
 * @param {Function} options.onSave - Async function called when saving the order. Receives ordered items array and should return true/false for success
 * @param {string} [options.idField='id'] - Field name to use as unique identifier for items
 *
 * @returns {Object} An object containing:
 * @returns {ComputedRef<Array>} return.items - Computed items (returns original when disabled, working copy when enabled)
 * @returns {Ref<boolean>} return.sortingEnabled - Reactive boolean indicating if sorting mode is active
 * @returns {Function} return.startSorting - Function to enable sorting mode and create working copy
 * @returns {Function} return.saveSorting - Async function to save the order via onSave callback
 * @returns {Function} return.cancelSorting - Function to cancel sorting and revert to original order
 * @returns {Function} return.moveUp - Function to move an item up. Accepts itemId parameter
 * @returns {Function} return.moveDown - Function to move an item down. Accepts itemId parameter
 *
 */

export function useOrdering(options) {
	const {items: sourceItems, onSave, idField = 'id'} = options;

	const sortingEnabled = ref(false);
	const orderedItems = ref([]);

	/**
	 * Computed property that returns the appropriate items based on sorting state
	 * When sorting is enabled, returns the working copy that can be reordered
	 * When sorting is disabled, returns the original items
	 */
	const items = computed(() => {
		return sortingEnabled.value ? orderedItems.value : sourceItems.value;
	});

	/**
	 * Enables sorting mode by creating a working copy of the items
	 */
	function startSorting() {
		orderedItems.value = [...sourceItems.value];
		sortingEnabled.value = true;
	}

	/**
	 * Saves the current order by calling the onSave callback
	 * Disables sorting mode if save is successful
	 * @returns {Promise<boolean>} Returns the result from onSave callback
	 */
	async function saveSorting() {
		await onSave(orderedItems.value);
		sortingEnabled.value = false;
	}

	/**
	 * Cancels sorting mode and discards any changes
	 */
	function cancelSorting() {
		orderedItems.value = [];
		sortingEnabled.value = false;
	}

	/**
	 * Moves an item up in the ordered list
	 * @param {*} itemId - The id of the item to move (using idField as identifier)
	 */
	function moveUp(itemId) {
		const index = orderedItems.value.findIndex(
			(item) => item[idField] === itemId,
		);

		// Can't move up if already at the top
		if (index === 0) {
			return;
		}

		// Swap with previous item
		const temp = orderedItems.value[index];
		orderedItems.value[index] = orderedItems.value[index - 1];
		orderedItems.value[index - 1] = temp;
	}

	/**
	 * Moves an item down in the ordered list
	 * @param {*} itemId - The id of the item to move (using idField as identifier)
	 */
	function moveDown(itemId) {
		const index = orderedItems.value.findIndex(
			(item) => item[idField] === itemId,
		);

		// Can't move down if already at the bottom
		if (index === orderedItems.value.length - 1) {
			return;
		}

		// Swap with next item
		const tempArray = [...orderedItems.value];
		const tempItem = tempArray[index];
		tempArray[index] = tempArray[index + 1];
		tempArray[index + 1] = tempItem;

		orderedItems.value = tempArray;
	}

	return {
		items,
		sortingEnabled,
		startSorting,
		saveSorting,
		cancelSorting,
		moveUp,
		moveDown,
	};
}
