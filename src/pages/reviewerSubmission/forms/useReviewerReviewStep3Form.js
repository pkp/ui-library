import {markRaw, ref} from 'vue';
import {useForm} from '@/composables/useForm';
import {useFormChanged} from '@/composables/useFormChanged';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import FileManager from '@/managers/FileManager/FileManager.vue';
import DiscussionManagerReviewer from '@/managers/DiscussionManager/DiscussionManagerReviewer.vue';
import ReviewGuidelinesButton from './ReviewGuidelinesButton.vue';

export function useReviewerReviewStep3Form({submissionId}) {
	const {t} = useLocalize();

	const {apiUrl: reviewAssignmentUrl} = useUrl(
		`reviews/${submissionId}/reviewAssignment`,
	);
	const {apiUrl: reviewFormUrl} = useUrl(`reviews/${submissionId}/reviewForm`);
	const {apiUrl: reviewerRecommendationOptionsUrl} = useUrl(
		`reviews/${submissionId}/reviewerRecommendationOptions`,
	);
	const {apiUrl: reviewGuidelinesUrl} = useUrl(
		`reviews/${submissionId}/reviewGuidelines`,
	);
	const {apiUrl: reviewerCommentsUrl} = useUrl(
		`reviews/${submissionId}/reviewerComments`,
	);

	const {data: reviewAssignment, fetch: fetchReviewAssignment} =
		useFetch(reviewAssignmentUrl);
	const {data: reviewForm, fetch: fetchReviewForm} = useFetch(reviewFormUrl);
	const {
		data: reviewerRecommendationOptions,
		fetch: fetchReviewerRecommendationOptions,
	} = useFetch(reviewerRecommendationOptionsUrl);
	const {data: reviewGuidelines, fetch: fetchReviewGuidelines} =
		useFetch(reviewGuidelinesUrl);
	const {data: reviewerComments, fetch: fetchReviewerComments} =
		useFetch(reviewerCommentsUrl);

	// Build page URLs from submissionId
	const {pageUrl: saveStepUrl} = useUrl(`reviewer/saveStep/${submissionId}`, {
		step: 3,
	});
	const {pageUrl: cancelUrl} = useUrl(`reviewer/submission/${submissionId}`, {
		step: 2,
	});
	const {pageUrl: completedUrl} = useUrl(
		`reviewer/submission/${submissionId}`,
		{
			step: 4,
		},
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

	// Warn the reviewer if they try to leave with unsaved changes
	const {setInitialState} = useFormChanged(form, [], {warnOnClose: true});

	// Build the form after the fetches - the review form decides which fields exist
	const isLoading = ref(true);

	async function loadAndBuildForm() {
		await Promise.all([
			fetchReviewAssignment(),
			fetchReviewForm(),
			fetchReviewerRecommendationOptions(),
			fetchReviewGuidelines(),
			fetchReviewerComments(),
		]);

		if (reviewAssignment.value) {
			buildForm();
			setInitialState();
		}

		isLoading.value = false;
	}

	loadAndBuildForm();

	function buildForm() {
		const assignment = reviewAssignment.value;
		const reviewIsClosed = !!assignment.dateCompleted || !!assignment.cancelled;

		const {
			id: reviewAssignmentId,
			reviewRoundId,
			stageId: submissionStageId,
			reviewerRecommendationId: selectedRecommendationId,
		} = assignment;

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

		const guidelines = reviewGuidelines.value?.reviewGuidelines;
		if (guidelines) {
			addFieldComponent('reviewGuidelines', {
				groupId: 'reviewFilesGroup',
				isInert: true,
				component: markRaw(ReviewGuidelinesButton),
				componentProps: {
					class: 'mt-4',
					guidelines,
				},
			});
		}

		// --- Review Form or Default Comments ---
		if (reviewForm.value && reviewForm.value.elements?.length) {
			addGroup('reviewFormGroup', {
				label: reviewForm.value.title,
				description: reviewForm.value.description,
			});

			for (const element of reviewForm.value.elements) {
				const fieldName = `reviewFormResponses[${element.id}]`;
				const existingValue = element.value ?? '';
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
				value: reviewerComments.value?.comments || '',
			});

			addFieldRichTextArea('commentsPrivate', {
				label: t('submission.comments.cannotShareWithAuthor'),
				groupId: 'commentsGroup',
				value: reviewerComments.value?.commentsPrivate || '',
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
		if (reviewerRecommendationOptions.value?.length) {
			addFieldSelect('reviewerRecommendationId', {
				label: t('reviewer.article.recommendation'),
				description: t('reviewer.article.selectRecommendation'),
				groupId: 'actionsGroup',
				isRequired: true,
				value: selectedRecommendationId || '',
				options: [
					{value: '', label: t('common.chooseOne')},
					...reviewerRecommendationOptions.value,
				],
			});
		}
	}

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

	return {
		form,
		set,
		saveForLater,
		goBack,
		isLoading,
	};
}
