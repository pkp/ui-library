import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';
import {useUrlSearchParams} from '@vueuse/core';

import SelectRevisionRecommendationFormModal from '../components/SelectRevisionRecommendationFormModal.vue';
export function useHandleActions({
	addReviewerUrl,
	unassignReviewerUrl,
	resendRequestReviewerUrl,
	reviewDetailsUrl,
	editReviewUrl,
	assignToIssueUrl,
	selectRevisionDecisionForm,
	viewActivityLogUrl,
	assignParticipantUrl,
	fileUploadWizardUrl,
}) {
	function handleSubmissionAction(
		submission,
		actionName,
		actionArgs,
		finishedCallback,
	) {
		console.log('handleItemAction', submission.id, actionName, actionArgs);

		const {openSideModal} = useModal();
		const {t, localize} = useLocalize();
		const {getActiveReviewRound} = useSubmission();

		const editorialDecisionActions = {
			requestRevisions: {},
			acceptSubmission: {
				decisionId: pkp.const.DECISION_ACCEPT,
			},
			cancelReviewRound: {
				decisionId: pkp.const.DECISION_CANCEL_REVIEW_ROUND,
			},
			declineSubmission: {
				decisionId: pkp.const.DECISION_DECLINE,
			},
		};

		function openDecisionPage(submission, decisionId) {
			const queryParamsUrl = useUrlSearchParams();

			const {getActiveReviewRound} = useSubmission();
			const activeReviewRound = getActiveReviewRound(submission);

			const currentPageUrl = `dashboard/editorial?${new URLSearchParams({...queryParamsUrl, summarySubmissionId: submission.id}).toString()}`;

			const {redirectToPage} = useUrl(
				`decision/record/${encodeURIComponent(submission.id)}`,
				{
					reviewRoundId: activeReviewRound.id,
					decision: decisionId,
					ret: currentPageUrl,
				},
			);

			redirectToPage();
		}

		if (editorialDecisionActions[actionName]) {
			if (actionName === 'requestRevisions') {
				// open modal
				const {set, form, getValue} = useForm(selectRevisionDecisionForm);
				openSideModal(SelectRevisionRecommendationFormModal, {
					formProps: form,
					onSet: set,
					onSuccess: () => {
						const decision = getValue('decision');
						openDecisionPage(submission, decision);
					},
				});

				return;
			}

			const editorialDecisionAction = editorialDecisionActions[actionName];

			openDecisionPage(submission, editorialDecisionAction.decisionId);

			// redirect to decisions page
		}

		if (actionName === 'assignReviewers') {
			const activeReviewRound = getActiveReviewRound(submission);

			const url = addReviewerUrl
				.replace('__id__', submission.id)
				.replace('__stageId__', submission.stageId)
				.replace('__reviewRoundId__', activeReviewRound.id);

			openSideModal(
				'LegacyAjax',
				{
					options: {
						title: t('editor.submission.addStageParticipant'),
						url,
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (['unassignReviewer', 'cancelReviewer'].includes(actionName)) {
			const url = unassignReviewerUrl
				.replace('__id__', submission.id)
				.replace('__stageId__', submission.stageId)
				.replace('__reviewAssignmentId__', actionArgs.reviewAssignmentId);

			const modalTitle =
				actionName === 'unassignReviewer'
					? t('editor.review.unassignReviewer')
					: t('editor.review.cancelReviewer');

			openSideModal(
				'LegacyAjax',
				{
					options: {title: modalTitle, url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'resendReviewRequest') {
			const url = resendRequestReviewerUrl
				.replace('__id__', submission.id)
				.replace('__stageId__', submission.stageId)
				.replace('__reviewAssignmentId__', actionArgs.reviewAssignmentId);

			openSideModal(
				'LegacyAjax',
				{
					options: {title: t('editor.review.resendRequestReviewer'), url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (
			[
				'viewDetails',
				'viewUnreadRecommendation',
				'viewRecommendation',
			].includes(actionName)
		) {
			const url = reviewDetailsUrl
				.replace('__id__', submission.id)
				.replace('__stageId__', submission.stageId)
				.replace('__reviewAssignmentId__', actionArgs.reviewAssignmentId);

			const {getCurrentPublication} = useSubmission();

			openSideModal(
				'LegacyAjax',
				{
					options: {
						title: `${t('editor.review.reviewDetails')}: ${localize(getCurrentPublication(submission).fullTitle)}`,
						url,
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'editDueDate') {
			const url = editReviewUrl
				.replace('__id__', submission.id)
				.replace('__stageId__', submission.stageId)
				.replace('__reviewAssignmentId__', actionArgs.reviewAssignmentId);

			openSideModal(
				'LegacyAjax',
				{
					options: {title: t('editor.submissionReview.editReview'), url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'assignToIssue') {
			const {getCurrentPublication} = useSubmission();

			const url = assignToIssueUrl
				.replace('__id__', submission.id)
				.replace('__publicationId__', getCurrentPublication(submission).id);

			openSideModal(
				'LegacyAjax',
				{
					options: {title: t('publication.selectIssue'), url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'viewActivityLog') {
			const url = viewActivityLogUrl.replace('__id__', submission.id);

			openSideModal(
				'LegacyAjax',
				{
					options: {title: t('submission.list.infoCenter'), url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'assignParticipant') {
			const url = assignParticipantUrl
				.replace('__id__', submission.id)
				.replace('__stageId__', submission.stageId);

			openSideModal(
				'LegacyAjax',
				{
					options: {url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'uploadRevisions') {
			const activeReviewRound = getActiveReviewRound(submission);
			const {getFileStageFromWorkflowStage} = useSubmission();

			const url = fileUploadWizardUrl
				.replace('__id__', submission.id)
				.replace('__stageId__', submission.stageId)
				.replace('__fileStage__', getFileStageFromWorkflowStage(submission))
				.replace('__reviewRoundId__', activeReviewRound.id);

			openSideModal(
				'LegacyAjax',
				{
					options: {url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		}
	}

	return {handleSubmissionAction};
}
