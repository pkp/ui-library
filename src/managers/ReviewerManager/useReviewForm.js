/**
 * Builds the form fields from the review form questions returned by the API
 */
export function useReviewForm({addField}) {
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
			addField(
				field.name,
				{
					...field,
					groupId,
					isRequired: inDisplayMode ? false : !!field.isRequired,
					value: getResponseValue(field, reviewFormResponses),
				},
				{override},
			);
		});
	}

	/** Required questions the reviewer left unanswered */
	function getUnansweredRequiredFields({
		reviewFormConfig,
		reviewFormResponses,
	} = {}) {
		return (reviewFormConfig?.fields ?? []).filter((field) => {
			if (!field.isRequired) {
				return false;
			}

			const value = getResponseValue(field, reviewFormResponses);

			return Array.isArray(value)
				? !value.length
				: value === null || value === '';
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

	return {
		addReviewFormFields,
		getReviewFormValues,
		getUnansweredRequiredFields,
	};
}
