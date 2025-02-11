import {ref, watch} from 'vue';

function getField(form, name) {
	const fields = form.fields;

	return fields.find((field) => field.name === name);
}

function doesFieldExist(form, name) {
	const fields = form.fields;

	return !!fields.find((field) => field.name === name);
}

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

function mapFromSelectedToValue(selected) {
	return selected.map((iv) => iv.value);
}

export function isFieldValueArray(field) {
	return Array.isArray(field.value) || field.selected ? true : false;
}

export function useForm(_form, {customSubmit} = {}) {
	const form = ref(_form);

	if (customSubmit) {
		form.value.customSubmit = customSubmit;
	}

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

	function set(key, data) {
		Object.keys(data).forEach(function (dataKey) {
			form.value[dataKey] = data[dataKey];
		});
	}

	function getValue(name) {
		const field = getField(form.value, name);

		return field.value;
	}

	function setValues(values) {
		Object.keys(values).forEach((key) => {
			setValue(key, values[key]);
		});
	}

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

	function clearForm() {
		form.value.fields.forEach((field) => {
			clearFormField(field.name);
		});
	}

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
