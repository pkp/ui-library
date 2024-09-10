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
	DECISION_ACCEPT: 'DECISION_ACCEPT',
	DECISION_CANCEL_REVIEW_ROUND: 'DECISION_CANCEL_REVIEW_ROUND',
	DECISION_DECLINE_SUBMISSION: 'DECISION_DECLINE_SUBMISSION',
	DECISION_EXTERNAL_REVIEW: 'DECISION_EXTERNAL_REVIEW',
	DECISION_SKIP_EXTERNAL_REVIEW: 'DECISION_SKIP_EXTERNAL_REVIEW',
	DECISION_INITIAL_DECLINE: 'DECISION_INITIAL_DECLINE',
	DECISION_SEND_TO_PRODUCTION: 'DECISION_SEND_TO_PRODUCTION',
	DECISION_BACK_FROM_COPYEDITING: 'DECISION_BACK_FROM_COPYEDITING',
	DECISION_NEW_EXTERNAL_ROUND: 'DECISION_NEW_EXTERNAL_ROUND',
	DECISION_BACK_FROM_PRODUCTION: 'DECISION_BACK_FROM_PRODUCTION',

	RECOMMEND_REVISION: 'RECOMMEND_REVISION',
	DECISION_RECOMMEND_ACCEPT: 'DECISION_RECOMMEND_ACCEPT',
	DECISION_RECOMMEND_DECLINE: 'DECISION_RECOMMEND_DECLINE',

	REQUEST_REVISION: 'REQUEST_REVISION',
	ASSIGN_REVIEWERS: 'ASSIGN_REVIEWERS',
	UNASSIGN_REVIEWER: 'UNASSIGN_REVIEWER',
	CANCEL_REVIEWER: 'CANCEL_REVIEWER',
	RESEND_REVIEW_REQUEST: 'RESEND_REVIEW_REQUEST',

	// TODO rename so its clear whats that for
	VIEW_DETAILS: 'VIEW_DETAILS',
	VIEW_UNREAD_RECOMMENDATION: 'VIEW_UNREAD_RECOMMENDATION',
	VIEW_RECOMMENDATION: 'VIEW_RECOMMENDATION',

	EDIT_DUE_DATE: 'EDIT_DUE_DATE',
	ASSIGN_TO_ISSUE: 'ASSIGN_TO_ISSUE',
	VIEW_ACTIVITY_LOG: 'VIEW_ACTIVITY_LOG',
	ASSIGN_PARTICIPANT: 'ASSIGN_PARTICIPANT',
	UPLOAD_REVISIONS: 'UPLOAD_REVISIONS',
	OPEN_REVIEW_FORM: 'OPEN_REVIEW_FORM',
	UPLOAD_REVIEWER_FILE: 'UPLOAD_REVIEWER_FILE',
	ASSIGN_TO_ISSUE_AND_SCHEULE_FOR_PUBLICATION:
		'ASSIGN_TO_ISSUE_AND_SCHEULE_FOR_PUBLICATION',
	SCHEDULE_FOR_PUBLICATION: 'SCHEDULE_FOR_PUBLICATION',
	PREVIEW_PUBLICATION: 'PREVIEW_PUBLICATION',
	UNSCHEDULE_PUBLICATION: 'UNSCHEDULE_PUBLICATION',
	UNPUBLISH_PUBLICATION: 'UNPUBLISH_PUBLICATION',
	CREATE_NEW_VERSION: 'CREATE_NEW_VERSION',
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
		} else if (actionName === Actions.ASSIGN_TO_ISSUE) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'modals.publish.AssignToIssueHandler',
				op: 'assign',
				params: {
					submissionId: submission.id,
					publicationId: selectedPublication.id,
				},
			});

			openLegacyModal({title: t('publication.selectIssue')}, finishedCallback);
		} else if (actionName === Actions.VIEW_ACTIVITY_LOG) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'informationCenter.SubmissionInformationCenterHandler',
				op: 'viewInformationCenter',
				params: {
					submissionId: submission.id,
				},
			});
			openLegacyModal(
				{title: t('submission.list.infoCenter')},
				finishedCallback,
			);
		} else if (actionName === Actions.ASSIGN_PARTICIPANT) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'grid.users.stageParticipant.StageParticipantGridHandler',
				op: 'addParticipant',
				params: {
					submissionId: submission.id,
					stageId: submission.stageId,
				},
			});

			openLegacyModal(
				{title: t('editor.submission.addStageParticipant')},
				finishedCallback,
			);
		} else if (actionName === Actions.UPLOAD_REVISIONS) {
			const activeReviewRound = getCurrentReviewRound(submission);
			const {getFileStageFromWorkflowStage} = useSubmission();

			const {openLegacyModal} = useLegacyGridUrl({
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

			openLegacyModal(
				{title: t('editor.submissionReview.uploadFile')},
				finishedCallback,
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
				console.log('trigger handleAction from issue');
				handleAction(
					Actions.SCHEDULE_FOR_PUBLICATION,
					actionArgs,
					finishedCallback,
				);
			}
		} else if (actionName === Actions.SCHEDULE_FOR_PUBLICATION) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'modals.publish.PublishHandler',
				op: 'publish',
				params: {
					submissionId: submission.id,
					publicationId: selectedPublication.id,
				},
			});

			openLegacyModal(
				{
					title: t('editor.submission.schedulePublication'),
					closeOnFormSuccessId: pkp.const.FORM_PUBLISH,
				},
				finishedCallback,
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
