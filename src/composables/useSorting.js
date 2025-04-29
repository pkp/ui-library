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
	 * Sort configuration formatted for query parameters
	 * @type {ComputedRef<Object>}
	 */
	const sortQueryParams = computed(() => {
		if (
			sortDescriptor.value?.column &&
			sortDescriptor.value?.direction !== 'none'
		) {
			return {
				sortColumn: sortDescriptor.value.column,
				sortDirection: sortDescriptor.value.direction,
			};
		}

		return {};
	});

	/**
	 * Apply sorting to a column, cycling through sort directions
	 * @param {string} columnId - The identifier of the column to sort
	 * @param {string|null} [_direction=null] - Optional direction to set ('descending', 'ascending', or 'none')
	 */
	function applySort(columnId, _direction = null) {
		// validate direction argument
		const direction =
			_direction && sortDirections.includes(_direction) ? _direction : null;

		if (columnId === sortDescriptor.value.column) {
			const i = sortDirections.findIndex(
				(dir) => dir === sortDescriptor.value.direction,
			);
			if (direction) {
				sortDescriptor.value.direction = direction;
			} else {
				sortDescriptor.value.direction =
					i + 1 === sortDirections.length
						? sortDirections[0]
						: sortDirections[i + 1];
			}
		} else {
			sortDescriptor.value = {
				column: columnId,
				direction: direction ? direction : sortDirections[0],
			};
		}
	}

	return {
		sortDescriptor,
		sortQueryParamsApi,
		sortQueryParams,
		applySort,
	};
}
