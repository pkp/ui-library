import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useUrl} from '@/composables/useUrl';
import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import {useUrlSearchParams} from '@vueuse/core';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';

import SelectRevisionFormModal from '../components/SelectRevisionFormModal.vue';

export const Actions = {
	DECISION_ACCEPT: 'decisionAccept',
	DECISION_CANCEL_REVIEW_ROUND: 'decisionCancelReviewRound',
	DECISION_DECLINE_SUBMISSION: 'decisionDeclineSubmission',
	DECISION_EXTERNAL_REVIEW: 'decisionExternalReview',
	DECISION_SKIP_EXTERNAL_REVIEW: 'decisionSkipExternalReview',
	DECISION_INITIAL_DECLINE: 'decisionInitialDecline',
	DECISION_SEND_TO_PRODUCTION: 'decisionSendToProduction',
	DECISION_BACK_FROM_COPYEDITING: 'decisionBackFromCopyediting',
	DECISION_NEW_EXTERNAL_ROUND: 'decisionNewExternalRound',
	DECISION_BACK_FROM_PRODUCTION: 'decisionBackFromProduction',

	RECOMMEND_REVISION: 'recommendRevision',
	DECISION_RECOMMEND_ACCEPT: 'decisionRecommendAccept',
	DECISION_RECOMMEND_DECLINE: 'decisionRecommendDecline',

	REQUEST_REVISION: 'requestRevision',
	ASSIGN_REVIEWERS: 'assignReviewers',
	UNASSIGN_REVIEWER: 'unassignReviewer',
	CANCEL_REVIEWER: 'cancelReviewer',
	RESEND_REVIEW_REQUEST: 'resendReviewRequest',

	// TODO rename so its clear whats that for
	VIEW_DETAILS: 'viewDetails',
	VIEW_UNREAD_RECOMMENDATION: 'viewUnreadRecommendation',
	VIEW_RECOMMENDATION: 'viewRecommendation',

	EDIT_DUE_DATE: 'editDueDate',
	ASSIGN_TO_ISSUE: 'assignToIssue',
	VIEW_ACTIVITY_LOG: 'viewActivityLog',
	ASSIGN_PARTICIPANT: 'assignParticipant',
	UPLOAD_REVISIONS: 'uploadRevisions',
	OPEN_REVIEW_FORM: 'openReviewForm',
	UPLOAD_REVIEWER_FILE: 'uploadReviewerFile',
	ASSIGN_TO_ISSUE_AND_SCHEULE_FOR_PUBLICATION:
		'assignToIssueAndScheduleForPublication',
	SCHEDULE_FOR_PUBLICATION: 'scheduleForPublication',
	PREVIEW_PUBLICATION: 'previewPublication',
	UNSCHEDULE_PUBLICATION: 'unschedulePublication',
	UNPUBLISH_PUBLICATION: 'unpublichPublication',
	CREATE_NEW_VERSION: 'createNewVersion',
};

export function useWorkflowActions({
	selectRevisionDecisionForm,
	selectRevisionRecommendationForm,
}) {
	function handleAction(actionName, actionArgs, finishedCallback) {
		const {submission, submissionId, selectedPublication} = actionArgs;
		const {openSideModal, openDialog} = useModal();
		const {t} = useLocalize();
		const {getCurrentReviewRound, getLatestPublication} = useSubmission();

		const editorialDecisionActions = {
			[Actions.DECISION_ACCEPT]: {
				decisionId: pkp.const.DECISION_ACCEPT,
			},
			[Actions.DECISION_CANCEL_REVIEW_ROUND]: {
				decisionId: pkp.const.DECISION_CANCEL_REVIEW_ROUND,
			},
			[Actions.DECISION_DECLINE_SUBMISSION]: {
				decisionId: pkp.const.DECISION_DECLINE,
			},
			[Actions.DECISION_EXTERNAL_REVIEW]: {
				decisionId: pkp.const.DECISION_EXTERNAL_REVIEW,
			},
			[Actions.DECISION_SKIP_EXTERNAL_REVIEW]: {
				decisionId: pkp.const.DECISION_SKIP_EXTERNAL_REVIEW,
			},
			[Actions.DECISION_INITIAL_DECLINE]: {
				decisionId: pkp.const.DECISION_INITIAL_DECLINE,
			},
			[Actions.DECISION_SEND_TO_PRODUCTION]: {
				decisionId: pkp.const.DECISION_SEND_TO_PRODUCTION,
			},
			[Actions.DECISION_BACK_FROM_COPYEDITING]: {
				decisionId: pkp.const.DECISION_BACK_FROM_COPYEDITING,
			},
			[Actions.DECISION_NEW_EXTERNAL_ROUND]: {
				decisionId: pkp.const.DECISION_NEW_EXTERNAL_ROUND,
			},
			[Actions.DECISION_BACK_FROM_PRODUCTION]: {
				decisionId: pkp.const.DECISION_BACK_FROM_PRODUCTION,
			},
			//
			[Actions.DECISION_RECOMMEND_ACCEPT]: {
				decisionId: pkp.const.DECISION_RECOMMEND_ACCEPT,
			},
			[Actions.DECISION_RECOMMEND_DECLINE]: {
				decisionId: pkp.const.DECISION_RECOMMEND_DECLINE,
			},
		};

		function openDecisionPage(submission, decisionId, actionArgs) {
			const queryParamsUrl = useUrlSearchParams();

			const currentPageUrl = `dashboard/editorial?${new URLSearchParams({...queryParamsUrl, summarySubmissionId: submission.id}).toString()}`;

			const queryParams = {decision: decisionId, ret: currentPageUrl};

			if (actionArgs?.reviewRoundId) {
				queryParams.reviewRoundId = actionArgs?.reviewRoundId;
			}

			if (actionArgs?.stageId) {
				queryParams.stageId = actionArgs?.stageId;
			}

			const {redirectToPage} = useUrl(
				`decision/record/${encodeURIComponent(submission.id)}`,
				queryParams,
			);

			redirectToPage();
		}

		if (editorialDecisionActions[actionName]) {
			const editorialDecisionAction = editorialDecisionActions[actionName];

			openDecisionPage(
				submission,
				editorialDecisionAction.decisionId,
				actionArgs,
			);

			// redirect to decisions page
		}

		if (actionName === Actions.REQUEST_REVISION) {
			// open modal
			const {set, form, getValue} = useForm(selectRevisionDecisionForm);
			openSideModal(SelectRevisionFormModal, {
				formProps: form,
				onSet: set,
				onSuccess: () => {
					const decision = getValue('decision');
					openDecisionPage(submission, decision, actionArgs);
				},
			});
		} else if (actionName === Actions.RECOMMEND_REVISION) {
			// open modal
			const {set, form, getValue} = useForm(selectRevisionRecommendationForm);
			openSideModal(SelectRevisionFormModal, {
				formProps: form,
				onSet: set,
				onSuccess: () => {
					const decision = getValue('decision');
					openDecisionPage(submission, decision, actionArgs);
				},
			});
		} else if (actionName === Actions.ASSIGN_REVIEWERS) {
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
						title: t('editor.submission.addReviewer'),
						url: url.value,
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === Actions.ASSIGN_TO_ISSUE) {
			const {url} = useLegacyGridUrl({
				component: 'modals.publish.AssignToIssueHandler',
				op: 'assign',
				params: {
					submissionId: submission.id,
					publicationId: selectedPublication.id,
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
					onClose: async (returnData) => {
						console.log('returnData?:', returnData);
						finishedCallback();
					},
				},
			);
		} else if (actionName === Actions.VIEW_ACTIVITY_LOG) {
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
		} else if (actionName === Actions.ASSIGN_PARTICIPANT) {
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
					legacyOptions: {
						url,
						title: t('editor.submission.addStageParticipant'),
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === Actions.UPLOAD_REVISIONS) {
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
			// TODO there is likely better place for this action
		} else if (actionName === Actions.OPEN_REVIEW_FORM) {
			const {redirectToPage} = useUrl(
				`reviewer/submission/${encodeURIComponent(submissionId)}`,
				{},
			);

			redirectToPage();
		} else if (
			actionName === Actions.ASSIGN_TO_ISSUE_AND_SCHEULE_FOR_PUBLICATION
		) {
			if (selectedPublication.issueId === null) {
				const {url} = useLegacyGridUrl({
					component: 'modals.publish.AssignToIssueHandler',
					op: 'assign',
					params: {
						submissionId: submission.id,
						publicationId: selectedPublication.id,
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
						onClose: async ({formId, data}) => {
							if (data?.issueId) {
								handleAction(
									Actions.SCHEDULE_FOR_PUBLICATION,
									actionArgs,
									finishedCallback,
								);
							} else {
								finishedCallback();
							}
						},
					},
				);
			} else {
				handleAction(
					Actions.SCHEDULE_FOR_PUBLICATION,
					actionArgs,
					finishedCallback,
				);
			}
		} else if (actionName === Actions.SCHEDULE_FOR_PUBLICATION) {
			const {url} = useLegacyGridUrl({
				component: 'modals.publish.PublishHandler',
				op: 'publish',
				params: {
					submissionId: submission.id,
					publicationId: selectedPublication.id,
				},
			});
			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						title: t('editor.submission.schedulePublication'),
						url,
						closeOnFormSuccessId: pkp.const.FORM_PUBLISH,
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === Actions.PREVIEW_PUBLICATION) {
			const {redirectToPage} = useUrl(selectedPublication.urlPublished);

			redirectToPage();
		} else if (
			[Actions.UNSCHEDULE_PUBLICATION, Actions.UNPUBLISH_PUBLICATION].includes(
				actionName,
			)
		) {
			openDialog({
				title:
					actionName === Actions.UNSCHEDULE_PUBLICATION
						? t('publication.unschedule')
						: t('publication.unpublish'),
				message:
					actionName === Actions.UNSCHEDULE_PUBLICATION
						? t('publication.unschedule.confirm')
						: t('publication.unpublish.confirm'),
				actions: [
					{
						label:
							actionName === Actions.UNSCHEDULE_PUBLICATION
								? t('publication.unschedule')
								: t('publication.unpublish'),
						isPrimary: true,
						callback: async (close) => {
							const {apiUrl: unschedulePublicationApiUrl} = useUrl(
								`submissions/${submission.id}/publications/${selectedPublication.id}/unpublish`,
							);
							const {fetch} = useFetch(unschedulePublicationApiUrl, {
								method: 'PUT',
							});
							await fetch();
							close();
							finishedCallback();
						},
					},
					{
						label: t('common.cancel'),
						callback: (close) => close(),
					},
				],
			});
		} else if (actionName === Actions.CREATE_NEW_VERSION) {
			openDialog({
				title: t('publication.createVersion'),
				message: t('publication.version.confirm'),
				actions: [
					{
						label: t('common.yes'),
						isWarnable: true,
						callback: async (close) => {
							close();

							const latestPublication = getLatestPublication(submission);

							const {apiUrl: createNewVersionUrl} = useUrl(
								`submissions/${submission.id}/publications/${latestPublication.id}/version`,
							);
							const {fetch} = useFetch(createNewVersionUrl, {
								method: 'POST',
							});
							await fetch();
							finishedCallback();
						},
					},
					{
						label: t('common.no'),
						callback: (close) => close(),
					},
				],
			});
		}
	}

	return {handleAction};
}
