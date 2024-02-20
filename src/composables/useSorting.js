import {ref, computed} from 'vue';

const sortDirections = ['descending', 'ascending', 'none'];

export function useSorting() {
	const sortDescriptor = ref({column: '', direction: 'none'});

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
	function applySort(columnId) {
		console.log('hi');
		if (columnId === sortDescriptor.value.column) {
			const i = sortDirections.findIndex(
				(dir) => dir === sortDescriptor.value.direction,
			);
			sortDescriptor.value.direction =
				i + 1 === sortDirections.length
					? sortDirections[0]
					: sortDirections[i + 1];
			console.log('sortDescriptor:', sortDescriptor.value);
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
