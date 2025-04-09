import {ref, watch} from 'vue';

/**
 * Get a field from a form by name
 * @param {Object} form - The form object
 * @param {string} name - The field name to find
 * @returns {Object|undefined} The field object if found
 */
function getField(form, name) {
	const fields = form.fields;

	return fields.find((field) => field.name === name);
}

/**
 * Check if a field exists in a form
 * @param {Object} form - The form object
 * @param {string} name - The field name to check
 * @returns {boolean} True if the field exists
 */
function doesFieldExist(form, name) {
	const fields = form.fields;

	return !!fields.find((field) => field.name === name);
}

/**
 * Get the default empty value for a field
 * @param {Object} field - The field object
 * @param {string|null} localeKey - The locale key for multilingual fields
 * @returns {*} The appropriate empty value based on field type
 */
function getClearValue(field, localeKey = null) {
	if (localeKey) {
		if (field.component === 'field-slider') {
			return field.min;
		}
		return Array.isArray(field.value[localeKey]) || field.selected ? [] : '';
	}

	if (field.component === 'field-slider') {
		return field.min;
	}
	return Array.isArray(field.value) || field.selected ? [] : '';
}

/**
 * Extract values from selected items
 * @param {Array<Object>} selected - Array of selected items with value properties
 * @returns {Array<*>} Array of values
 */
function mapFromSelectedToValue(selected) {
	return selected.map((iv) => iv.value);
}

/**
 * Check if a field's value should be treated as an array
 * @param {Object} field - The field object to check
 * @returns {boolean} True if the field value should be treated as an array
 */
export function isFieldValueArray(field) {
	return Array.isArray(field.value) || field.selected ? true : false;
}

/**
 * Provides functions for form management
 * @param {Object} _form - The initial form object
 * @param {Object} [options={}] - Additional options
 * @param {Function} [options.customSubmit] - Custom submit function
 */
export function useForm(_form, {customSubmit} = {}) {
	/**
	 * The form state
	 * @type {Ref<Object>}
	 */
	const form = ref(_form);

	if (customSubmit) {
		form.value.customSubmit = customSubmit;
	}

	/**
	 * Connect form fields with a payload object
	 * @param {Ref<Object>} payload - Reactive object with field values
	 */
	function connectWithPayload(payload) {
		watch(
			payload,
			(newPayload) => {
				Object.keys(newPayload).forEach((key) => {
					if (doesFieldExist(form.value, key)) {
						if (getValue(key) !== newPayload[key]) {
							setValue(key, newPayload[key]);
						}
					}
				});
			},
			{immediate: true},
		);
	}

	/**
	 * Connect form fields with an errors object
	 * @param {Ref<Object>} errors - Reactive object with field errors
	 */
	function connectWithErrors(errors) {
		watch(
			errors,
			(newErrors) => {
				form.value.errors = {};
				Object.keys(newErrors).forEach((key) => {
					if (doesFieldExist(form.value, key)) {
						form.value.errors[key] = newErrors[key];
					}
				});
			},
			{immediate: true},
		);
	}

	/**
	 * Set form properties
	 * @param {string} key - The form property to update
	 * @param {Object} data - The data to set
	 */
	function set(key, data) {
		Object.keys(data).forEach(function (dataKey) {
			form.value[dataKey] = data[dataKey];
		});
	}

	/**
	 * Get a field's value
	 * @param {string} name - The field name
	 * @returns {*} The field's value
	 */
	function getValue(name) {
		const field = getField(form.value, name);

		return field.value;
	}

	/**
	 * Set multiple field values at once
	 * @param {Object} values - Object mapping field names to values
	 */
	function setValues(values) {
		Object.keys(values).forEach((key) => {
			setValue(key, values[key]);
		});
	}

	/**
	 * Set a field's value
	 * @param {string} name - The field name
	 * @param {*} inputValue - The value to set
	 */
	function setValue(name, inputValue) {
		const field = getField(form.value, name);
		if (!field) {
			return;
		}
		if (field.selected) {
			if (field.isMultilingual) {
				field.value = {};
				field.selected = {};

				Object.keys(inputValue).forEach((localeKey) => {
					field.value[localeKey] = mapFromSelectedToValue(
						inputValue[localeKey],
					);
				});
			} else {
				const onlyValues = mapFromSelectedToValue(inputValue);
				field.value = onlyValues;
				field.selected = inputValue;
			}
			field.selected = inputValue;
		} else {
			field.value = inputValue;
		}
	}

	/**
	 * Clear a specific form field
	 * @param {string} fieldName - The name of the field to clear
	 */
	function clearFormField(fieldName) {
		const field = getField(form.value, fieldName);

		if (field.isMultilingual) {
			const newValueMultilingual = {};
			form.value.supportedFormLocales.forEach((localeObject) => {
				const localeKey = localeObject.key;
				const newValue = getClearValue(field, localeKey);
				newValueMultilingual[localeKey] = newValue;
			});
			setValue(field.name, newValueMultilingual);
		} else {
			const newValue = getClearValue(field);
			setValue(field.name, newValue);
		}
	}

	/**
	 * Remove a specific value from a field (for multi-value fields)
	 * @param {string} fieldName - The name of the field
	 * @param {*} fieldValue - The value to remove
	 */
	function removeFieldValue(fieldName, fieldValue) {
		const value = getValue(fieldName);
		const field = getField(form.value, fieldName);
		if (Array.isArray(value)) {
			let newValue = null;
			if (field.selected) {
				newValue = field.selected.filter((v) => v.value !== fieldValue);
			} else {
				newValue = value.filter((v) => v !== fieldValue);
			}

			setValue(fieldName, newValue);
		} else {
			clearFormField(fieldName);
		}
	}

	/**
	 * Clear all form fields
	 */
	function clearForm() {
		form.value.fields.forEach((field) => {
			clearFormField(field.name);
		});
	}

	/**
	 * Set form locales based on a submission object
	 * @param {Object} submission - The submission object with locale information
	 */
	function setLocalesForSubmission(submission) {
		const supportedFormLocales = submission.metadataLocales;
		if (Array.isArray(supportedFormLocales)) {
			form.value.supportedFormLocales = supportedFormLocales;
		} else {
			form.value.supportedFormLocales = Object.keys(supportedFormLocales).map(
				(localeKey) => ({
					key: localeKey,
					label: supportedFormLocales[localeKey],
				}),
			);
		}

		form.value.primaryLocale = submission.locale;
		form.value.visibleLocales = [submission.locale];
	}

	/**
	 * Convert flat errors to a nested structure
	 * @param {Object} errors - Flat error object with dot notation keys
	 * @returns {Object} Structured error object
	 */
	function structuredErrors(errors) {
		const result = {};
		for (const key in errors) {
			const value = errors[key];
			const keys = key.split('.');
			let current = result;
			for (let i = 0; i < keys.length; i++) {
				const obj = keys[i];
				if (i === keys.length - 1) {
					current[obj] = value;
				} else {
					current[obj] = current[obj] || {};
					current = current[obj];
				}
			}
		}
		return result;
	}

	/**
	 * Set the form's action URL
	 * @param {string} _action - The action URL
	 */
	function setAction(_action) {
		form.value.action = _action;
	}

	return {
		set,
		setValue,
		setValues,
		getValue,
		removeFieldValue,
		isFieldValueArray,
		clearForm,
		form,
		connectWithPayload,
		connectWithErrors,
		setLocalesForSubmission,
		setAction,
		structuredErrors,
	};
}
