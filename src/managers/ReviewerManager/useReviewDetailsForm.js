import {computed, ref, watch} from 'vue';
import {useForm} from '@/composables/useForm';
import {useFormChanged} from '@/composables/useFormChanged';
import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';

import {useReviewContentFields} from './useReviewContentFields';

import ReviewDetailsInfo from './ReviewDetailsInfo.vue';
import ReviewDetailsRating from './ReviewDetailsRating.vue';
import FileManager from '@/managers/FileManager/FileManager.vue';

/**
 * Builds the Review Details form for both the read-only View modal and the editable Modify Review
 * modal. The caller owns the data and the requests; the fields are rebuilt whenever the review
 * assignment or the review content changes, and editor actions are handed back through callbacks.
 */
export function useReviewDetailsForm(
	{
		submission,
		submissionStageId,
		reviewRoundId,
		reviewAssignment,
		reviewContent,
		recommendations = [],
		isLoadingReview = ref(false),
		isSavingRating = ref(false),
		onSubmit = async () => ({}),
		onDownload = () => {},
		onRatingChange = () => {},
	} = {},
	{inDisplayMode = false} = {},
) {
	const {t, localize} = useLocalize();
	const {isOJS} = useApp();

	const {
		form,
		initEmptyForm,
		addPage,
		addGroup,
		set,
		setValue,
		setValues,
		addField,
		addFieldRichTextArea,
		addFieldSelect,
		addFieldComponent,
	} = useForm({}, {customSubmit: onSubmit});

	const {
		addReviewContentFields,
		getReviewFormValues,
		getUnansweredRequiredFields,
	} = useReviewContentFields(
		{addGroup, addField, addFieldRichTextArea, addFieldComponent, setValues},
		{inDisplayMode},
	);

	const recommendationOptions = recommendations.map((recommendation) => ({
		value: recommendation.reviewerRecommendationId,
		label: localize(recommendation.title),
	}));

	const recommendationLabel = computed(() => {
		const recommendation = recommendations.find(
			(recommendation) =>
				recommendation.reviewerRecommendationId ===
				reviewAssignment.value?.reviewerRecommendationId,
		);

		return recommendation ? localize(recommendation.title) : null;
	});

	const hasUnansweredRequiredFields = computed(
		() => getUnansweredRequiredFields(reviewContent.value).length > 0,
	);

	const isReviewFormReview = computed(
		() => !!reviewContent.value?.reviewFormConfig,
	);

	// What Modify Review sends back, read off whichever fields the reviewer's review built
	function getReviewPayload(formData) {
		return {
			reviewerRecommendationId: formData.reviewerRecommendationId,
			// Editors never edit the private comment, so it stays out of the payload
			...(isReviewFormReview.value
				? {
						reviewFormResponses: getReviewFormValues(
							reviewContent.value,
							formData,
						),
					}
				: {comments: formData.comments}),
		};
	}

	// Renders the information section of the review (reviewer's name, date of activities, recommendation and download options)
	function addInfoComponent({override = false} = {}) {
		addFieldComponent(
			'reviewInfo',
			{
				component: ReviewDetailsInfo,
				componentProps: {
					reviewAssignment: reviewAssignment.value,
					recommendationLabel,
					inDisplayMode,
					isLoadingReview,
					onDownload,
				},
				groupId: 'reviewInfo',
			},
			{override},
		);
	}

	// The editor's rating, which the caller stores when the editor picks one
	function addRatingComponent({override = false} = {}) {
		addFieldComponent(
			'quality',
			{
				component: ReviewDetailsRating,
				componentProps: {
					reviewAssignment: reviewAssignment.value,
					isSaving: isSavingRating,
					describedBy: 'reviewRating_description',
					onChange: onRatingChange,
				},
				groupId: 'reviewRating',
			},
			{override},
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
			namespace: 'REVIEWER_ATTACHMENT_FILES',
			readOnly: inDisplayMode,
			submission,
			submissionStageId,
			// Unused for filtering, but the legacy upload wizard requires it
			reviewRoundId,
			reviewAssignmentId: reviewAssignment.value.id,
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
			value: reviewAssignment.value.reviewerRecommendationId,
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

	const {setInitialState} = useFormChanged(form, [], {
		warnOnClose: !inDisplayMode,
	});

	watch(reviewAssignment, (newReviewAssignment) => {
		setValue(
			'reviewerRecommendationId',
			newReviewAssignment.reviewerRecommendationId,
		);
		addInfoComponent({override: true});

		if (inDisplayMode) {
			addRatingComponent({override: true});
		}

		setInitialState();
	});

	watch(reviewContent, (newReviewContent) => {
		addReviewContentFields(newReviewContent, {groupId: 'reviewContent'});
		setInitialState();
	});

	return {
		form,
		set,
		setInitialState,
		getReviewPayload,
		hasUnansweredRequiredFields,
	};
}
