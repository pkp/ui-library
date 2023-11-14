import {ref, computed} from 'vue';

const sortDirections = ['descending', 'ascending', 'none'];

export function useSorting() {
	const sortDirection = ref('');
	const sortColumnId = ref('');

	const sortQueryParamsApi = computed(() => {
		if (sortColumnId.value && sortDirection.value !== 'none') {
			return {
				orderBy: sortColumnId.value,
				orderDirection: sortDirection.value === 'descending' ? 'DESC' : 'ASC',
			};
		}

		return {};
	});
	function applySort(columnId) {
		if (columnId === sortColumnId.value) {
			const i = sortDirections.findIndex((dir) => dir === sortDirection.value);
			sortDirection.value =
				i + 1 === sortDirections.length
					? sortDirections[0]
					: sortDirections[i + 1];
		} else {
			sortColumnId.value = columnId;
			sortDirection.value = sortDirections[0];
		}
	}

	return {
		sortDirection,
		sortColumnId,
		sortQueryParamsApi,
		applySort,
	};
}
