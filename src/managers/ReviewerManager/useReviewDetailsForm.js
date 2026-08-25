import {computed, inject, ref} from 'vue';
import {useForm} from '@/composables/useForm';
import {useFormChanged} from '@/composables/useFormChanged';
import {useLocalize} from '@/composables/useLocalize';
import {useModal} from '@/composables/useModal';
import {useNotify} from '@/composables/useNotify';
import {useUrl} from '@/composables/useUrl';
import {useApp} from '@/composables/useApp';
import {useDataChangedProvider} from '@/composables/useDataChangedProvider';
import {useFetch} from '@/composables/useFetch';

import {useReviewForm} from './useReviewForm';

import ReviewDetailsInfo from './ReviewDetailsInfo.vue';
import ReviewDetailsRating from './ReviewDetailsRating.vue';
import FileManager from '@/managers/FileManager/FileManager.vue';
import FieldRichTextareaDisplay from '@/components/Form/display/FieldRichTextareaDisplay.vue';

// True once an editor has confirmed the review
export function isReviewConfirmed(reviewAssignment) {
	if (reviewAssignment?.considered === undefined) {
		return !!reviewAssignment?.dateConsidered;
	}

	return [
		pkp.const.REVIEW_ASSIGNMENT_CONSIDERED,
		pkp.const.REVIEW_ASSIGNMENT_RECONSIDERED,
	].includes(reviewAssignment.considered);
}

/**
 * Builds the Review Details form for both the read-only View modal and the editable Modify Review modal
 */
export function useReviewDetailsForm(
	{
		submission,
		submissionStageId,
		reviewRoundId,
		reviewAssignment,
		recommendations = [],
		onDataChangedFn = async () => {},
	} = {},
	{inDisplayMode = false, isLoadingAssignment = ref(false)} = {},
) {
	const {t, localize} = useLocalize();
	const {isOJS} = useApp();
	// Modals mount outside the workflow page, so the file manager needs its own provider
	const {triggerDataChange} = useDataChangedProvider();
	const {openDialog} = useModal();
	const {notify} = useNotify();
	const closeModal = inject('closeModal');

	const reviewAssignmentRef = ref(reviewAssignment);
	const reviewComments = ref('');
	const reviewContentRef = ref(null);

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		set,
		setValue,
		addFieldText,
		addFieldOptions,
		addFieldRichTextArea,
		addFieldSelect,
		addFieldComponent,
	} = useForm({}, {customSubmit: handleFormSubmission});

	const {
		addReviewFormFields,
		getReviewFormValues,
		getUnansweredRequiredFields,
	} = useReviewForm({
		addFieldText,
		addFieldSelect,
		addFieldOptions,
		addFieldRichTextArea,
	});

	const recommendationOptions = recommendations.map((recommendation) => ({
		value: recommendation.reviewerRecommendationId,
		label: localize(recommendation.title),
	}));

	const recommendationLabel = computed(() => {
		const recommendation = recommendations.find(
			(recommendation) =>
				recommendation.reviewerRecommendationId ===
				reviewAssignmentRef.value?.reviewerRecommendationId,
		);

		return recommendation ? localize(recommendation.title) : null;
	});

	function confirmWithDialog({title, message, confirmLabel}) {
		return new Promise((resolve) => {
			openDialog({
				title,
				message,
				modalStyle: 'primary',
				actions: [
					{
						label: confirmLabel,
						isPrimary: true,
						callback: (close) => {
							resolve(true);
							close();
						},
					},
					{
						label: t('common.cancel'),
						isWarnable: true,
						callback: (close) => {
							resolve(false);
							close();
						},
					},
				],
				close: () => resolve(false),
			});
		});
	}

	const {apiUrl: reviewContentApiUrl} = useUrl(
		`submissions/${encodeURIComponent(submission.id)}/reviewAssignments/${reviewAssignment.id}/review`,
	);

	const {
		fetch: fetchReviewContent,
		data: reviewContentData,
		isSuccess: isReviewContentLoaded,
		isLoading: isLoadingReviewContent,
	} = useFetch(reviewContentApiUrl);

	const isLoadingReview = computed(
		() => isLoadingAssignment.value || isLoadingReviewContent.value,
	);

	async function saveReview(formData) {
		const {
			fetch: saveReviewContent,
			data: savedReviewContent,
			validationError,
			isSuccess,
		} = useFetch(reviewContentApiUrl, {
			method: 'PUT',
			// privateComments is readonly, so it's excluded in payload
			body: {
				reviewerRecommendationId: formData.reviewerRecommendationId,
				...(isReviewFormReview.value
					? {
							reviewFormResponses: getReviewFormValues(
								reviewContentRef.value,
								formData,
							),
						}
					: {comments: formData.comments}),
			},
			expectValidationError: true,
		});
		await saveReviewContent();

		return {
			data: savedReviewContent.value,
			validationError: validationError.value,
			isSuccess: isSuccess.value,
		};
	}

	// The Modify Review modal's submit
	async function handleFormSubmission(formData) {
		// When a review has already been confirmed and OPR, saving changes should confirm before sending the request
		if (
			isReviewConfirmed(reviewAssignmentRef.value) &&
			reviewAssignmentRef.value?.isReviewPubliclyVisible
		) {
			const proceed = await confirmWithDialog({
				title: t('editor.review.saveChanges.title'),
				message: t('editor.review.saveChanges.message'),
				confirmLabel: t('common.saveChanges'),
			});
			if (!proceed) {
				return {};
			}
		}

		const result = await saveReview(formData);

		if (result.isSuccess) {
			setInitialState();
			await onDataChangedFn(result.data);

			closeModal();
		}

		return result;
	}

	const exports = {
		authorPdf: {op: 'export-pdf', authorFriendly: 1},
		authorXml: {op: 'export-xml', authorFriendly: 1},
		editorPdf: {op: 'export-pdf', authorFriendly: 0},
		editorXml: {op: 'export-xml', authorFriendly: 0},
	};

	async function downloadReview(name) {
		const {op, authorFriendly} = exports[name];
		const {apiUrl: reviewExportApiUrl} = useUrl(
			`reviews/${submission.id}/${reviewAssignmentRef.value.id}/${op}?authorFriendly=${authorFriendly}`,
		);

		const {
			fetch: requestReviewExport,
			data: reviewExport,
			isSuccess,
			validationError,
		} = useFetch(reviewExportApiUrl, {
			method: 'GET',
			expectValidationError: true,
		});
		await requestReviewExport();

		if (validationError.value) {
			notify(validationError.value.error, 'warning');
			return;
		}

		if (isSuccess.value) {
			const {apiUrl: reviewExportFileApiUrl} = useUrl(
				`reviews/${submission.id}/exports/${reviewExport.value.temporaryFileId}`,
			);

			const anchor = document.createElement('a');
			anchor.href = reviewExportFileApiUrl.value;
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
		}
	}

	// Renders the information section of the review (reviewer's name, date of activities, recommendation and download options)
	function addInfoComponent({override = false} = {}) {
		addFieldComponent(
			'reviewInfo',
			{
				component: ReviewDetailsInfo,
				componentProps: {
					reviewAssignment: reviewAssignmentRef.value,
					recommendationLabel,
					inDisplayMode,
					isLoadingReview,
					onDownload: downloadReview,
				},
				groupId: 'reviewInfo',
			},
			{override},
		);
	}

	// The ratings component where the editor can update it
	function addRatingComponent({override = false} = {}) {
		addFieldComponent(
			'quality',
			{
				component: ReviewDetailsRating,
				componentProps: {
					submissionId: submission.id,
					reviewAssignment: reviewAssignmentRef.value,
					describedBy: 'reviewRating_description',
				},
				groupId: 'reviewRating',
			},
			{override},
		);
	}

	const hasUnansweredRequiredFields = computed(
		() => getUnansweredRequiredFields(reviewContentRef.value).length > 0,
	);

	const isReviewFormReview = computed(
		() => !!reviewContentRef.value?.reviewFormConfig,
	);

	/**
	 * Either the reviewer's free-text comment or the review form's questions,
	 * only known once the content is fetched.
	 */
	function addReviewContentFields(reviewContent) {
		if (reviewContent?.reviewFormConfig) {
			const {title, description} = reviewContent.reviewFormConfig;

			addGroup(
				'reviewContent',
				{
					label: title || t('editor.review.reviewerComments'),
					description,
				},
				{override: true},
			);

			addReviewFormFields(reviewContent, {
				groupId: 'reviewContent',
				inDisplayMode,
				override: true,
			});

			return;
		}

		addFieldRichTextArea(
			'comments',
			{
				groupId: 'reviewContent',
				label: t('submission.comments.canShareWithAuthor'),
				description: inDisplayMode
					? undefined
					: t('editor.review.comments.openReviewWarning'),
				size: 'large',
				value: reviewContent?.comments ?? '',
			},
			{override: true},
		);

		// Private comment renders display component directly, so the editor-only comment stays
		// read-only in the edit modal too
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
				groupId: 'reviewContent',
			},
			{override: true},
		);
	}

	initEmptyForm(inDisplayMode ? 'reviewDetailsDisplay' : 'reviewDetailsForm', {
		showErrorFooter: true,
	});

	// View mode carries its own buttons - see ReviewDetailsModal
	addPage(
		'default',
		inDisplayMode
			? {}
			: {
					submitButton: {label: t('common.saveChanges')},
					cancelButton: {label: t('common.cancel')},
				},
	);

	addGroup('reviewInfo');
	addInfoComponent();

	addGroup('reviewContent', {label: t('editor.review.reviewerComments')});

	addGroup('reviewerFiles', {label: t('reviewer.submission.reviewerFiles')});

	addFieldComponent('reviewerFiles', {
		component: FileManager,
		componentProps: {
			namespace: inDisplayMode
				? 'REVIEWER_ATTACHMENT_FILES_READ_ONLY'
				: 'REVIEWER_ATTACHMENT_FILES',
			submission,
			submissionStageId,
			// Unused for filtering, but the legacy upload wizard requires it
			reviewRoundId,
			reviewAssignmentId: reviewAssignmentRef.value.id,
		},
		groupId: 'reviewerFiles',
	});

	if (isOJS()) {
		addGroup('reviewRecommendation', {
			label: t('editor.review.reviewerRecommendation'),
			description: inDisplayMode
				? undefined
				: t('reviewer.article.selectRecommendation.byEditor'),
		});

		addFieldSelect('reviewerRecommendationId', {
			groupId: 'reviewRecommendation',
			label: t('reviewer.article.recommendation'),
			options: recommendationOptions,
			value: reviewAssignmentRef.value.reviewerRecommendationId,
			isRequired: !inDisplayMode,
		});
	}

	// The editor's own assessment, not part of the review
	if (inDisplayMode) {
		addGroup('reviewRating', {
			label: t('editor.review.rateReviewer'),
			description: t('editor.review.rateReviewer.description'),
		});
		addRatingComponent();
	}

	const {setInitialState} = useFormChanged(form, [reviewComments], {
		warnOnClose: !inDisplayMode,
	});

	function refreshFormData(newReviewAssignment, reviewContent) {
		if (newReviewAssignment) {
			reviewAssignmentRef.value = newReviewAssignment;
			setValue(
				'reviewerRecommendationId',
				newReviewAssignment.reviewerRecommendationId,
			);
			addInfoComponent({override: true});

			if (inDisplayMode) {
				addRatingComponent({override: true});
			}
		}

		if (reviewContent !== undefined) {
			reviewContentRef.value = reviewContent;
			reviewComments.value = reviewContent?.comments ?? '';
			addReviewContentFields(reviewContent);
		}

		setInitialState();
	}

	// Get review comments/form if set
	async function loadReviewContent() {
		await fetchReviewContent();

		// A 404 means there is no content, so the fields are built empty
		if (isReviewContentLoaded.value !== null) {
			refreshFormData(null, reviewContentData.value);
		}
	}

	loadReviewContent();

	return {
		form,
		set,
		refreshFormData,
		loadReviewContent,
		isLoadingReview,
		reviewAssignmentRef,
		hasUnansweredRequiredFields,
		triggerDataChange,
	};
}
