import {markRaw} from 'vue';
import {useForm} from '@/composables/useForm';
import {useFormChanged} from '@/composables/useFormChanged';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import FileManager from '@/managers/FileManager/FileManager.vue';
import DiscussionManagerReviewer from '@/managers/DiscussionManager/DiscussionManagerReviewer.vue';
import ReviewGuidelinesButton from './ReviewGuidelinesButton.vue';

export function useReviewerReviewStep3Form(props) {
	const {t} = useLocalize();

	// Extract values from review assignment with defaults
	const reviewAssignment = props.reviewAssignment || {};
	const reviewIsClosed =
		!!reviewAssignment.dateCompleted || !!reviewAssignment.cancelled;

	const {
		id: reviewAssignmentId,
		submissionId,
		reviewRoundId,
		stageId: submissionStageId,
		recommendationId: selectedRecommendationId,
	} = reviewAssignment;

	// Build page URLs from submissionId
	const {pageUrl: saveStepUrl} = useUrl(`reviewer/saveStep/${submissionId}`, {
		step: 3,
	});
	const {pageUrl: cancelUrl} = useUrl(`reviewer/submission/${submissionId}`, {
		step: 2,
	});
	const {pageUrl: completedUrl} = useUrl(
		`reviewer/submission/${submissionId}`,
		{step: 4},
	);

	const {
		form,
		set,
		initEmptyForm,
		addPage,
		addGroup,
		addFieldText,
		addFieldTextArea,
		addFieldRichTextArea,
		addFieldSelect,
		addFieldOptions,
		addFieldComponent,
	} = useForm({}, {customSubmit: handleSubmit});

	// Initialize the form
	initEmptyForm('reviewStep3Form', {
		method: 'POST',
		action: saveStepUrl.value,
		canSubmit: !reviewIsClosed,
	});

	addPage('default', {
		submitButton: {
			label: t('reviewer.submission.submitReview'),
		},
		...(!reviewIsClosed
			? {
					saveForLaterButton: {
						label: t('reviewer.submission.saveReviewForLater'),
					},
				}
			: undefined),
		cancelButton: {
			label: t('navigation.goBack'),
		},
	});

	// Build a minimal submission object for the FileManager component
	const submission = {
		id: submissionId,
		stages: [
			{
				id: submissionStageId,
				currentUserAssignedRoles: [pkp.const.ROLE_ID_REVIEWER],
			},
		],
	};

	// --- Review Files + Guidelines ---
	addGroup('reviewFilesGroup');

	addFieldComponent('reviewFiles', {
		groupId: 'reviewFilesGroup',
		component: markRaw(FileManager),
		isInert: true,
		componentProps: {
			namespace: 'REVIEWER_REVIEW_FILES',
			submission,
			submissionStageId,
			reviewRoundId,
			reviewAssignmentId,
		},
	});

	if (props.reviewGuidelines) {
		addFieldComponent('reviewGuidelines', {
			groupId: 'reviewFilesGroup',
			isInert: true,
			component: markRaw(ReviewGuidelinesButton),
			componentProps: {
				class: 'mt-4',
				guidelines: props.reviewGuidelines,
			},
		});
	}

	// --- Review Form or Default Comments ---
	if (props.reviewForm && props.reviewFormElements?.length) {
		addGroup('reviewFormGroup', {
			label: props.reviewForm.title,
			description: props.reviewForm.description,
		});

		for (const element of props.reviewFormElements) {
			const fieldName = `reviewFormResponses[${element.id}]`;
			const existingValue = props.reviewFormResponses?.[element.id] ?? '';
			const possibleResponses = element.possibleResponses || [];

			switch (element.elementType) {
				case pkp.const.REVIEW_FORM_ELEMENT_TYPE_SMALL_TEXT_FIELD:
					addFieldText(fieldName, {
						label: element.question,
						description: element.description || undefined,
						groupId: 'reviewFormGroup',
						isRequired: element.required,
						value: existingValue,
						size: 'small',
					});
					break;
				case pkp.const.REVIEW_FORM_ELEMENT_TYPE_TEXT_FIELD:
					addFieldText(fieldName, {
						label: element.question,
						description: element.description || undefined,
						groupId: 'reviewFormGroup',
						isRequired: element.required,
						value: existingValue,
					});
					break;
				case pkp.const.REVIEW_FORM_ELEMENT_TYPE_TEXTAREA:
					addFieldTextArea(fieldName, {
						label: element.question,
						description: element.description || undefined,
						groupId: 'reviewFormGroup',
						isRequired: element.required,
						value: existingValue,
					});
					break;
				case pkp.const.REVIEW_FORM_ELEMENT_TYPE_RADIO_BUTTONS:
					addFieldOptions(fieldName, 'radio', {
						label: element.question,
						description: element.description || undefined,
						groupId: 'reviewFormGroup',
						isRequired: element.required,
						value:
							existingValue !== '' && existingValue !== null
								? Number(existingValue)
								: null,
						options: possibleResponses.map((resp, idx) => ({
							value: idx,
							label: resp,
						})),
					});
					break;
				case pkp.const.REVIEW_FORM_ELEMENT_TYPE_CHECKBOXES:
					addFieldOptions(fieldName, 'checkbox', {
						label: element.question,
						description: element.description || undefined,
						groupId: 'reviewFormGroup',
						isRequired: element.required,
						value: Array.isArray(existingValue)
							? existingValue.map(Number)
							: [],
						options: possibleResponses.map((resp, idx) => ({
							value: idx,
							label: resp,
						})),
					});
					break;
				case pkp.const.REVIEW_FORM_ELEMENT_TYPE_DROP_DOWN_BOX:
					addFieldSelect(fieldName, {
						label: element.question,
						description: element.description || undefined,
						groupId: 'reviewFormGroup',
						isRequired: element.required,
						value:
							existingValue !== '' && existingValue !== null
								? Number(existingValue)
								: '',
						options: [
							{value: '', label: t('common.chooseOne')},
							...possibleResponses.map((resp, idx) => ({
								value: idx,
								label: resp,
							})),
						],
					});
					break;
			}
		}
	} else {
		// Default comments section (no review form configured)
		addGroup('commentsGroup', {
			label: t('submission.review'),
			description: t('reviewer.submission.reviewDescription'),
		});

		addFieldRichTextArea('comments', {
			label: t('submission.comments.canShareWithAuthor'),
			groupId: 'commentsGroup',
			value: props.comments || '',
		});

		addFieldRichTextArea('commentsPrivate', {
			label: t('submission.comments.cannotShareWithAuthor'),
			groupId: 'commentsGroup',
			value: props.commentsPrivate || '',
		});
	}

	// --- Reviewer Attachments, Discussions, Recommendation ---
	addGroup('actionsGroup');

	addFieldComponent('reviewerAttachments', {
		groupId: 'actionsGroup',
		component: markRaw(FileManager),
		isInert: true,
		componentProps: {
			namespace: 'REVIEWER_REVIEW_ATTACHMENTS',
			submission,
			submissionStageId,
			reviewRoundId,
			reviewAssignmentId,
		},
	});

	addFieldComponent('discussions', {
		groupId: 'actionsGroup',
		component: markRaw(DiscussionManagerReviewer),
		isInert: true,
		componentProps: {
			class: 'my-8',
			submissionId: String(submissionId),
			submissionStageId,
		},
	});

	// Reviewer Recommendation (OJS-specific)
	if (props.reviewerRecommendationOptions?.length) {
		addFieldSelect('reviewerRecommendationId', {
			label: t('reviewer.article.recommendation'),
			description: t('reviewer.article.selectRecommendation'),
			groupId: 'actionsGroup',
			isRequired: true,
			value: selectedRecommendationId || '',
			options: [
				{value: '', label: t('common.chooseOne')},
				...props.reviewerRecommendationOptions,
			],
		});
	}

	// Warn the reviewer if they try to leave with unsaved changes
	const {setInitialState} = useFormChanged(form, [], {warnOnClose: true});

	/**
	 * Build FormData from the form's field values
	 */
	function buildFormData(isSave = false) {
		const formData = new FormData();
		formData.append('csrfToken', getCSRFToken());

		if (isSave) {
			formData.append('isSave', '1');
		}

		for (const field of form.value.fields || []) {
			// Skip inert fields (FileManager, DiscussionManager) - they don't submit data
			if (field.isInert) {
				continue;
			}
			const val = field.value;
			if (Array.isArray(val)) {
				val.forEach((v) => formData.append(field.name + '[]', v));
			} else if (val !== undefined && val !== null && val !== '') {
				formData.append(field.name, val);
			}
		}

		return formData;
	}

	/**
	 * POST the form data to the legacy saveStep endpoint and navigate
	 * to the completion page on success.
	 */
	async function submitReview() {
		const formData = buildFormData(false);
		const {data, validationError, fetch} = useFetch(saveStepUrl.value, {
			method: 'POST',
			body: formData,
			expectValidationError: true,
		});
		await fetch();
		if (!validationError?.value && data.value) {
			// Reset change tracking so the unsaved-changes warning doesn't fire
			setInitialState();
			window.location.href = completedUrl.value;
		}
		return {data: data.value, validationError: validationError?.value};
	}

	/**
	 * Custom submit handler for the PkpForm
	 * Shows a confirmation dialog before submitting the review.
	 */
	async function handleSubmit() {
		const {openDialog} = useModal();

		return new Promise((resolve) => {
			openDialog({
				title: t('reviewer.submission.submitReview'),
				message: t('reviewer.confirmSubmit'),
				modalStyle: 'primary',
				actions: [
					{
						label: t('common.ok'),
						isPrimary: true,
						callback: async (close) => {
							close();
							resolve(await submitReview());
						},
					},
					{
						label: t('common.cancel'),
						callback: (close) => {
							close();
							resolve({data: null, validationError: null});
						},
					},
				],
			});
		});
	}

	/**
	 * Save the review for later without submitting
	 */
	async function saveForLater() {
		const formData = buildFormData(true);

		const {data, fetch} = useFetch(saveStepUrl.value, {
			method: 'POST',
			body: formData,
		});

		await fetch();

		if (data.value) {
			// Reset change tracking so "Go Back" doesn't prompt after a save
			setInitialState();
			// Trigger legacy notification refresh
			$('body').trigger('notifyUser');
		}

		return data.value;
	}

	/**
	 * Navigate back to step 2
	 */
	function goBack() {
		window.location.href = cancelUrl.value;
	}

	return {form, set, saveForLater, goBack};
}
