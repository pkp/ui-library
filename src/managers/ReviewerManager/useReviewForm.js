/**
 * Builds the form fields from the review form questions returned by the API
 */
export function useReviewForm({
	addFieldText,
	addFieldSelect,
	addFieldOptions,
	addFieldRichTextArea,
}) {
	/** Each field type needs its own empty value, or it renders as answered */
	function getResponseValue(field, reviewFormResponses) {
		const response = reviewFormResponses?.[field.name];
		const isChoice =
			field.component === 'field-options' || field.component === 'field-select';

		// Checkbox answers can be stored as strings, which won't match the numeric option value
		if (field.component === 'field-options' && field.type === 'checkbox') {
			return Array.isArray(response) ? response.map(Number) : [];
		}

		if (response === undefined || response === null) {
			return isChoice ? null : '';
		}

		return response;
	}

	function addReviewFormFields(
		{reviewFormConfig, reviewFormResponses} = {},
		{groupId, inDisplayMode = false, override = false} = {},
	) {
		(reviewFormConfig?.fields ?? []).forEach((field) => {
			const {component, name, type, options, ...fieldProps} = field;

			const commonFields = {
				...fieldProps,
				groupId,
				isRequired: inDisplayMode ? false : !!field.isRequired,
				value: getResponseValue(field, reviewFormResponses),
			};

			switch (component) {
				case 'field-rich-textarea':
					addFieldRichTextArea(
						name,
						{size: 'large', ...commonFields},
						{override},
					);
					break;
				case 'field-options':
					addFieldOptions(name, type, {options, ...commonFields}, {override});
					break;
				case 'field-select':
					addFieldSelect(name, {options, ...commonFields}, {override});
					break;
				case 'field-text':
					addFieldText(name, {...commonFields}, {override});
					break;
				default:
					// An unknown field isn't shown so saving leaves its answer untouched
					break;
			}
		});
	}

	/** Maps all the review form field values */
	function getReviewFormValues(
		{reviewFormConfig, reviewFormResponses} = {},
		formData,
	) {
		const values = {...(reviewFormResponses ?? {})};

		(reviewFormConfig?.fields ?? []).forEach((field) => {
			if (field.name in formData) {
				values[field.name] = formData[field.name];
			}
		});

		return values;
	}

	return {addReviewFormFields, getReviewFormValues};
}
