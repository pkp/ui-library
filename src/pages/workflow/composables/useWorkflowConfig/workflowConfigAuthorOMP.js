import {useLocalize} from '@/composables/useLocalize';
import {Actions} from '../useWorkflowActions';
import {useSubmission} from '@/composables/useSubmission';
import {Actions as FileManagerActions} from '@/managers/FileManager/useFileManagerActions';

const {hasSubmissionPassedStage, getOpenReviewAssignmentsForRound} =
	useSubmission();

export function getHeaderItems({
	submission,
	selectedPublication,
	publicationSettings,
}) {
	if (!submission) {
		return [];
	}
	const {t} = useLocalize();
	const actions = [];

	actions.push({
		component: 'WorkflowActionButton',
		props: {
			label: t('editor.submissionLibrary'),
			action: Actions.WORKFLOW_VIEW_LIBRARY,
		},
	});

	return actions;
}

export const WorkflowConfig = {
	common: {},
	[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]: {
		getPrimaryItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];

			if (
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				)
			) {
				items.push({component: 'SubmissionStatus', props: {submission}});
			}

			items.push({
				component: 'FileManager',
				props: {
					namespace: 'SUBMISSION_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {submissionId: submission.id, stageId: selectedStageId},
			});

			return items;
		},
	},

	[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: {
		getPrimaryItems: ({
			submission,
			selectedStageId,
			selectedReviewRound,
			pageInitConfig,
		}) => {
			const items = [];
			if (
				getOpenReviewAssignmentsForRound(
					submission.reviewAssignments,
					selectedReviewRound.id,
				).length
			) {
				items.push({
					component: 'ReviewerManager',
					props: {
						submission: submission,
						reviewRoundId: selectedReviewRound?.id,
						redactedForAuthors: true,
						componentForms: pageInitConfig.componentForms,
					},
				});
			}
			items.push({
				component: 'FileManager',
				props: {
					namespace: 'WORKFLOW_REVIEW_REVISIONS',
					submission: submission,
					submissionStageId: selectedStageId,
					reviewRoundId: selectedReviewRound?.id,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});

			return items;
		},
		getActionItems: ({submission, selectedReviewRound}) => {
			const actions = [];
			const {t} = useLocalize();

			if (
				selectedReviewRound &&
				[
					pkp.const.REVIEW_ROUND_STATUS_REVISIONS_REQUESTED,
					pkp.const.REVIEW_ROUND_STATUS_RESUBMIT_FOR_REVIEW,
					pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED,
					pkp.const.REVIEW_ROUND_STATUS_REVISIONS_SUBMITTED,
				].includes(selectedReviewRound.statusId)
			)
				actions.push({
					component: 'WorkflowActionButton',
					props: {
						action: FileManagerActions.FILE_UPLOAD,
						label: t('workflow.uploadRevisions'),
						actionArgs: {
							submissionId: submission.id,
							fileStage: pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_REVISION,
							reviewRoundId: selectedReviewRound.id,
							wizardTitleKey: 'editor.submissionReview.uploadFile',
							submissionStageId: pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW,
						},
					},
				});
			return actions;
		},
	},
	[pkp.const.WORKFLOW_STAGE_ID_EDITING]: {
		getPrimaryItems: ({submission, selectedStageId, selectedReviewRound}) => {
			const items = [];

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});

			items.push({
				component: 'FileManager',
				props: {
					namespace: 'COPYEDITED_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});

			return items;
		},
	},
	[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: {
		getPrimaryItems: ({submission, selectedStageId}) => {
			const items = [];

			items.push({
				component: 'WorkflowNotificationDisplay',
				props: {submission: submission, selectedStageId},
			});

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});

			return items;
		},
	},
};

export const PublicationConfig = {
	chapters: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'ChapterManager',
					props: {
						submissionId: submission.id,
						publicationId: selectedPublication.id,
					},
				},
			];
		},
	},
	publicationFormats: {
		getPrimaryItems: ({
			submission,
			selectedPublication,
			pageInitConfig,
			permissions,
		}) => {
			return [
				{
					component: 'PublicationFormatManager',
					props: {
						submissionId: submission.id,
						publicationId: selectedPublication.id,
					},
				},
			];
		},
	},
};
