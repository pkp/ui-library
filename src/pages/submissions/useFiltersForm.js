import {ref, computed} from 'vue';

// probably will go to some form utils
function clearForm(form) {
	form.fields.forEach((field) => {
		if (field?.value?.length) {
			field.value = [];
		}

		if (field?.selected?.length) {
			field.selected = [];
		}
	});
}

function doesValueExist(fieldValue) {
	if (Array.isArray(fieldValue)) {
		return !!fieldValue.length;
	}

	return !!fieldValue;
}

function ensureArray(value) {
	return Array.isArray(value) ? value : [value];
}

function fixValueType(value) {
	return isNaN(Number(value)) ? value : Number(value);
}

function createSelected(values, labels) {
	return values.map((value, i) => ({
		value,
		label: labels[i],
	}));
}

export function useFiltersForm(_filtersForm) {
	const filtersForm = ref(_filtersForm);

	const filtersList = computed(() => {
		const list = [];
		filtersForm.value.fields.forEach((field) => {
			const fieldValuesArray = Array.isArray(field.value)
				? field.value
				: [field.value];

			fieldValuesArray.forEach((fieldValue) => {
				if (field.selected) {
					const select = field.selected.find(
						(select) => select.value === fieldValue,
					);

					list.push({
						fieldLabel: field.label,
						label: select.label,
						value: select.value,
					});
				} else if (field.options) {
					const option = field.options.find(
						(option) => option.value === fieldValue,
					);

					list.push({
						fieldLabel: field.label,
						label: option.label,
						value: option.value,
					});
				} else {
					list.push({
						fieldLabel: field.label,
						value: fieldValue,
						label: 'TODO',
					});
				}
			});
		});

		return list;
	});

	const filtersQueryParamsApi = computed(() => {
		const params = {};
		filtersForm.value.fields.forEach((field) => {
			if (doesValueExist(field.value)) {
				params[field.name] = field.value;
			}
		});

		return params;
	});

	const filtersQueryParams = computed(() => {
		const params = {};
		filtersForm.value.fields.forEach((field) => {
			params[field.name] = doesValueExist(field.value) ? field.value : null;
			if (field.selected) {
				params[`${field.name}_label`] = doesValueExist(field.value)
					? field.selected.map((select) => select.label)
					: null;
			}
		});

		return params;
	});

	function initFromQueryParams(queryParams) {
		filtersForm.value.fields.forEach((field) => {
			if (queryParams[field.name]) {
				// TODO detect which fields are array and which not
				const values = ensureArray(queryParams[field.name]).map(fixValueType);
				if (queryParams[`${field.name}_label`]) {
					const labels = ensureArray(queryParams[`${field.name}_label`]);
					console.log(labels);
					field.selected = createSelected(values, labels);
				}
				field.value = values;
			}
		});
	}

	function update(update) {
		filtersForm.value = {
			...filtersForm.value,
			...update,
		};
	}

	function clear() {
		clearForm(filtersForm.value);
	}

	return {
		filtersForm,
		filtersList,
		filtersQueryParamsApi,
		filtersQueryParams,
		initFromQueryParams,
		update,
		clear,
	};
}
