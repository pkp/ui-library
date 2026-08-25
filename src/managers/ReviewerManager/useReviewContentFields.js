import {useLocalize} from '@/composables/useLocalize';

import FieldRichTextareaDisplay from '@/components/Form/display/FieldRichTextareaDisplay.vue';

/**
 * Builds a submitted review into form fields: a review form's questions, or textarea comments.
 */
export function useReviewContentFields(
	{addGroup, addField, addFieldRichTextArea, addFieldComponent},
	{inDisplayMode = false, canEditPrivateComment = false} = {},
) {
	const {t} = useLocalize();

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
		{groupId},
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
				{override: true},
			);
		});
	}

	/**
	 * Either the reviewer's free-text comment or the review form's questions,
	 * only known once the content is fetched.
	 */
	function addReviewContentFields(reviewContent, {groupId}) {
		if (reviewContent?.reviewFormConfig) {
			const {title, description} = reviewContent.reviewFormConfig;

			addGroup(
				groupId,
				{
					label: title || t('editor.review.reviewerComments'),
					description,
				},
				{override: true},
			);

			addReviewFormFields(reviewContent, {groupId});

			return;
		}

		addFieldRichTextArea(
			'comments',
			{
				groupId,
				label: t('submission.comments.canShareWithAuthor'),
				description: inDisplayMode
					? undefined
					: t('editor.review.comments.openReviewWarning'),
				value: reviewContent?.comments ?? '',
			},
			{override: true},
		);

		if (canEditPrivateComment && !inDisplayMode) {
			addFieldRichTextArea(
				'privateComments',
				{
					groupId,
					label: t('submission.comments.cannotShareWithAuthor'),
					description: t(
						'submission.comments.cannotShareWithAuthor.description',
					),
					value: reviewContent?.commentsPrivate ?? '',
				},
				{override: true},
			);

			return;
		}

		// A display component rather than a field, so it stays read-only in the editor's view of the review
		addFieldComponent(
			'privateComments',
			{
				component: FieldRichTextareaDisplay,
				componentProps: {
					field: {
						label: t('submission.comments.cannotShareWithAuthor'),
						value: reviewContent?.commentsPrivate ?? '',
					},
					headingElement: 'h2',
					// FormGroup's .pkpFormField spacing never matches a display
					// component; display mode has its own wrapper
					...(inDisplayMode ? {} : {class: 'mt-6'}),
				},
				groupId,
			},
			{override: true},
		);
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
		addReviewContentFields,
		getReviewFormValues,
		getUnansweredRequiredFields,
	};
}
