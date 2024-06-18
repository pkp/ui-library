import {ref, computed} from 'vue';
import {useForm} from './useForm';

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
	const {clearForm, removeFieldValue, setValue} = useForm(_filtersForm);

	const filtersFormList = computed(() => {
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
						name: field.name,
						fieldLabel: field.label,
						label: select.label,
						value: select.value,
					});
				} else if (field.options) {
					const option = field.options.find(
						(option) => option.value === fieldValue,
					);

					list.push({
						name: field.name,
						fieldLabel: field.label,
						label: option.label,
						value: option.value,
					});
				} else if (field.component === 'field-slider') {
					if (fieldValue !== field.min) {
						list.push({
							name: field.name,
							fieldLabel: field.label,
							value: fieldValue,
							label: fieldValue,
						});
					}
				} else {
					list.push({
						name: field.name,
						fieldLabel: field.label,
						value: fieldValue,
						label: 'TODO',
					});
				}
			});
		});

		return list;
	});

	const filtersFormQueryParamsApi = computed(() => {
		const params = {};
		filtersForm.value.fields.forEach((field) => {
			if (doesValueExist(field.value)) {
				params[field.name] = field.value;
			}
		});

		return params;
	});

	const filtersFormQueryParams = computed(() => {
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

	function initFiltersFormFromQueryParams(queryParams) {
		filtersForm.value.fields.forEach((field) => {
			if (queryParams[field.name]) {
				const values = ensureArray(queryParams[field.name]).map(fixValueType);
				if (queryParams[`${field.name}_label`]) {
					const labels = ensureArray(queryParams[`${field.name}_label`]);
					setValue(field.name, createSelected(values, labels));
				} else {
					setValue(field.name, values);
				}
			}
		});
	}

	function updateFiltersForm(update) {
		filtersForm.value = {
			...filtersForm.value,
			...update,
		};
	}

	function clearFiltersForm() {
		clearForm();
	}

	function clearFiltersFormField(fieldName, fieldValue) {
		removeFieldValue(fieldName, fieldValue);
	}

	return {
		filtersForm,
		filtersFormList,
		filtersFormQueryParamsApi,
		filtersFormQueryParams,
		initFiltersFormFromQueryParams,
		updateFiltersForm,
		clearFiltersForm,
		clearFiltersFormField,
	};
}
