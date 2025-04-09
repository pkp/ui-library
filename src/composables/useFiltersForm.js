import {ref, computed} from 'vue';
import {useForm} from './useForm';

/**
 * Check if a field value exists (not empty)
 * @param {*} fieldValue - The value to check
 * @returns {boolean} True if the value exists
 */
function doesValueExist(fieldValue) {
	if (Array.isArray(fieldValue)) {
		return !!fieldValue.length;
	}

	return !!fieldValue;
}

/**
 * Ensure a value is an array
 * @param {*} value - The value to ensure is an array
 * @returns {Array} The value as an array
 */
function ensureArray(value) {
	return Array.isArray(value) ? value : [value];
}

/**
 * Convert a value to number if it's numeric
 * @param {*} value - The value to fix
 * @returns {number|*} The value as a number if numeric, otherwise the original value
 */
function fixValueType(value) {
	return isNaN(Number(value)) ? value : Number(value);
}

/**
 * Create selected items from values and labels
 * @param {Array} values - Array of values
 * @param {Array} labels - Array of labels
 * @returns {Array<Object>} Array of objects with value and label properties
 */
function createSelected(values, labels) {
	return values.map((value, i) => ({
		value,
		label: labels[i],
	}));
}

/**
 * Provides functions for managing filter forms
 * @param {Object} _filtersForm - The initial filters form configuration
 */
export function useFiltersForm(_filtersForm) {
	/**
	 * The filters form configuration
	 * @type {Ref<Object>}
	 */
	const filtersForm = ref(_filtersForm);
	const {clearForm, removeFieldValue, setValue, isFieldValueArray} =
		useForm(_filtersForm);

	/**
	 * List of applied filters in a user-friendly format
	 * @type {ComputedRef<Array<Object>>}
	 */
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

	/**
	 * Filter form values formatted for API query parameters
	 * @type {ComputedRef<Object>}
	 */
	const filtersFormQueryParamsApi = computed(() => {
		const params = {};
		filtersForm.value.fields.forEach((field) => {
			if (doesValueExist(field.value)) {
				params[field.name] = field.value;
			}
		});

		return params;
	});

	/**
	 * Filter form values formatted for URL query parameters
	 * @type {ComputedRef<Object>}
	 */
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

	/**
	 * Initialize filters form values from URL query parameters
	 * @param {Object} queryParams - The query parameters to initialize from
	 */
	function initFiltersFormFromQueryParams(queryParams) {
		filtersForm.value.fields.forEach((field) => {
			if (queryParams[field.name]) {
				const values = isFieldValueArray(field)
					? ensureArray(queryParams[field.name]).map(fixValueType)
					: fixValueType(queryParams[field.name]);

				if (queryParams[`${field.name}_label`]) {
					const labels = ensureArray(queryParams[`${field.name}_label`]);
					setValue(field.name, createSelected(values, labels));
				} else {
					setValue(field.name, values);
				}
			}
		});
	}

	/**
	 * Update the filters form configuration
	 * @param {Object} update - The properties to update
	 */
	function updateFiltersForm(update) {
		filtersForm.value = {
			...filtersForm.value,
			...update,
		};
	}

	/**
	 * Clear all filter form values
	 */
	function clearFiltersForm() {
		clearForm();
	}

	/**
	 * Clear a specific filter form field value
	 * @param {string} fieldName - The name of the field to clear
	 * @param {*} fieldValue - The specific value to remove (for arrays)
	 */
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
