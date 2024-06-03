import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';
import {useUrlSearchParams} from '@vueuse/core';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';

import SelectRevisionRecommendationFormModal from '../components/SelectRevisionRecommendationFormModal.vue';
export function useHandleActions({selectRevisionDecisionForm}) {
	function handleSubmissionAction(
		submission,
		actionName,
		actionArgs,
		finishedCallback,
	) {
		console.log('handleItemAction', submission.id, actionName, actionArgs);

		const {openSideModal} = useModal();
		const {t, localize} = useLocalize();
		const {getCurrentReviewRound} = useSubmission();

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

			const {getCurrentReviewRound} = useSubmission();
			const activeReviewRound = getCurrentReviewRound(submission);

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
			const activeReviewRound = getCurrentReviewRound(submission);

			const {url} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'showReviewerForm',
				params: {
					selectionType: pkp.const.REVIEWER_SELECT_ADVANCED_SEARCH,
					submissionId: submission.id,
					stageId: submission.stageId,
					reviewRoundId: activeReviewRound.id,
				},
			});

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						title: t('editor.submission.addStageParticipant'),
						url: url.value,
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (['unassignReviewer', 'cancelReviewer'].includes(actionName)) {
			const {url} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'unassignReviewer',
				params: {
					selectionType: pkp.const.REVIEWER_SELECT_ADVANCED_SEARCH,
					submissionId: submission.id,
					stageId: submission.stageId,
					reviewAssignmentId: actionArgs.reviewAssignmentId,
				},
			});

			const modalTitle =
				actionName === 'unassignReviewer'
					? t('editor.review.unassignReviewer')
					: t('editor.review.cancelReviewer');

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {title: modalTitle, url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'resendReviewRequest') {
			const {url} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'resendRequestReviewer',
				params: {
					submissionId: submission.id,
					stageId: submission.stageId,
					reviewAssignmentId: actionArgs.reviewAssignmentId,
				},
			});

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {title: t('editor.review.resendRequestReviewer'), url},
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
			const {url} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'readReview',
				params: {
					submissionId: submission.id,
					stageId: submission.stageId,
					reviewAssignmentId: actionArgs.reviewAssignmentId,
				},
			});

			const {getCurrentPublication} = useSubmission();

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
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
			const {url} = useLegacyGridUrl({
				component: 'grid.users.reviewer.ReviewerGridHandler',
				op: 'editReview',
				params: {
					submissionId: submission.id,
					stageId: submission.stageId,
					reviewAssignmentId: actionArgs.reviewAssignmentId,
				},
			});

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {title: t('editor.submissionReview.editReview'), url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'assignToIssue') {
			const {getCurrentPublication} = useSubmission();
			const {url} = useLegacyGridUrl({
				component: 'modals.publish.AssignToIssueHandler',
				op: 'assign',
				params: {
					submissionId: submission.id,
					publicationId: getCurrentPublication(submission).id,
				},
			});

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						title: t('publication.selectIssue'),
						url,
						closeOnFormSuccessId: pkp.const.FORM_ASSIGN_TO_ISSUE,
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'viewActivityLog') {
			const {url} = useLegacyGridUrl({
				component: 'informationCenter.SubmissionInformationCenterHandler',
				op: 'viewInformationCenter',
				params: {
					submissionId: submission.id,
				},
			});

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {title: t('submission.list.infoCenter'), url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'assignParticipant') {
			const {url} = useLegacyGridUrl({
				component: 'grid.users.stageParticipant.StageParticipantGridHandler',
				op: 'addParticipant',
				params: {
					submissionId: submission.id,
					stageId: submission.stageId,
				},
			});

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {url},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'uploadRevisions') {
			const activeReviewRound = getCurrentReviewRound(submission);
			const {getFileStageFromWorkflowStage} = useSubmission();

			const {url} = useLegacyGridUrl({
				component: 'wizard.fileUpload.FileUploadWizardHandler',
				op: 'startWizard',
				params: {
					submissionId: submission.id,
					stageId: submission.stageId,
					uploaderRoles: pkp.const.ROLE_ID_AUTHOR,
					fileStage: getFileStageFromWorkflowStage(submission),
					reviewRoundId: activeReviewRound.id,
				},
			});

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {url, title: t('editor.submissionReview.uploadFile')},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'openReviewForm') {
			const {redirectToPage} = useUrl(
				`reviewer/submission/${encodeURIComponent(submission.id)}`,
				{},
			);

			redirectToPage();
		} else if (actionName === 'uploadReviewerFile') {
			const activeReviewRound = getCurrentReviewRound(submission);
			// fileStage=5&reviewRoundId=8&assocType=517&assocId=28&submissionId=10&stageId=3&uploaderRoles=16-1-17-4096
			const {url} = useLegacyGridUrl({
				component: 'wizard.fileUpload.FileUploadWizardHandler',
				op: 'startWizard',
				params: {
					fileStage: pkp.const.SUBMISSION_FILE_REVIEW_ATTACHMENT,
					reviewRoundId: activeReviewRound.id,
					assocType: pkp.const.ASSOC_TYPE_REVIEW_ASSIGNMENT,
					assocId: actionArgs.reviewAssignmentId,
					submissionId: submission.id,
					stageId: submission.stageId,
					uploaderRoles: pkp.const.ROLE_ID_REVIEWER,
				},
			});

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						url,
						title: t('editor.submissionReview.uploadAttachment'),
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === 'declineReviewAssignment') {
			//publicknowledge/en/reviewer/showDeclineReview/5
			const {pageUrl} = useUrl(`reviewer/showDeclineReview/${submission.id}`);

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						title: t('reviewer.submission.declineReview'),
						url: pageUrl,
					},
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
