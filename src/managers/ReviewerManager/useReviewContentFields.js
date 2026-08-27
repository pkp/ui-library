import {useLocalize} from '@/composables/useLocalize';

import FieldRichTextareaDisplay from '@/components/Form/display/FieldRichTextareaDisplay.vue';

/**
 * Builds a submitted review into form fields: a review form's questions, or textarea comments.
 */
export function useReviewContentFields(
	{addGroup, addField, addFieldRichTextArea, addFieldComponent, setValues},
	{inDisplayMode = false, canEditPrivateComment = false} = {},
) {
	const {t} = useLocalize();

	function addReviewFormFields(
		{reviewFormConfig, reviewFormResponses} = {},
		{groupId},
	) {
		// The api sends each field its own empty value, so only the answered ones need setting
		(reviewFormConfig?.fields ?? []).forEach((field) => {
			addField(
				field.name,
				{
					...field,
					groupId,
					isRequired: inDisplayMode ? false : !!field.isRequired,
				},
				{override: true},
			);
		});

		setValues(reviewFormResponses ?? {});
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

			const response = reviewFormResponses?.[field.name];

			return Array.isArray(response)
				? !response.length
				: response === undefined || response === null || response === '';
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
