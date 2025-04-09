import {ref, computed} from 'vue';

/**
 * Available sort directions in cycle order
 * @type {Array<string>}
 */
const sortDirections = ['descending', 'ascending', 'none'];

/**
 * Provides functions for managing column sorting
 */
export function useSorting() {
	/**
	 * The current sort configuration
	 * @type {Ref<Object>}
	 * @property {string} column - The column identifier to sort by
	 * @property {string} direction - The sort direction ('descending', 'ascending', or 'none')
	 */
	const sortDescriptor = ref({column: '', direction: 'none'});

	/**
	 * Sort configuration formatted for API query parameters
	 * @type {ComputedRef<Object>}
	 */
	const sortQueryParamsApi = computed(() => {
		if (
			sortDescriptor.value?.column &&
			sortDescriptor.value?.direction !== 'none'
		) {
			return {
				orderBy: sortDescriptor.value.column,
				orderDirection:
					sortDescriptor.value.direction === 'descending' ? 'DESC' : 'ASC',
			};
		}

		return {};
	});

	/**
	 * Apply sorting to a column, cycling through sort directions
	 * @param {string} columnId - The identifier of the column to sort
	 */
	function applySort(columnId) {
		if (columnId === sortDescriptor.value.column) {
			const i = sortDirections.findIndex(
				(dir) => dir === sortDescriptor.value.direction,
			);
			sortDescriptor.value.direction =
				i + 1 === sortDirections.length
					? sortDirections[0]
					: sortDirections[i + 1];
		} else {
			sortDescriptor.value = {column: columnId, direction: sortDirections[0]};
		}
	}

	return {
		sortDescriptor,
		sortQueryParamsApi,
		applySort,
	};
}
