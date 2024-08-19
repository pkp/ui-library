import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useFileManagerActions';
import {computed} from 'vue';
import {useCurrentUser} from '@/composables/useCurrentUser';

const {tk} = useLocalize();

export const FileManagerConfigurations = {
	SUBMISSION_FILES: ({stageId}) => ({
		permissions: [
			{
				roles: [pkp.const.ROLE_ID_AUTHOR],
				actions: [Actions.LIST, Actions.EDIT, Actions.DOWNLOAD_ALL],
			},
			{
				roles: [
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_ASSISTANT,
				],
				actions: [
					Actions.LIST,
					Actions.UPLOAD,
					Actions.DOWNLOAD_ALL,
					Actions.EDIT,
					Actions.DELETE,
					Actions.SEE_NOTES,
				],
			},
		],
		actions: [
			Actions.UPLOAD,
			Actions.DOWNLOAD_ALL,
			Actions.EDIT,
			Actions.DELETE,
			Actions.SEE_NOTES,
		],
		fileStage: pkp.const.SUBMISSION_FILE_SUBMISSION,
		titleKey: tk('dashboard.summary.deskReviewFiles'),
		descriptionKey: tk('dashboard.summary.deskReviewFilesDescription'),
		wizardTitleKey: tk('submission.submit.uploadSubmissionFile'),
	}),
	EDITOR_REVIEW_FILES: ({stageId}) => ({
		permissions: [
			{
				roles: [
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_ASSISTANT,
				],
				actions: [
					Actions.LIST,
					Actions.SELECT_UPLOAD,
					Actions.EDIT,
					Actions.DELETE,
					Actions.SEE_NOTES,
				],
			},
		],

		actions: [
			Actions.SELECT_UPLOAD,
			Actions.EDIT,
			Actions.DELETE,
			Actions.SEE_NOTES,
		],
		fileStage:
			stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
				? pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_FILE
				: pkp.const.SUBMISSION_FILE_REVIEW_FILE,
		gridComponent: 'grid.files.review.EditorReviewFilesGridHandler',
		titleKey: tk('dashboard.summary.filesForReview'),
		descriptionKey: tk('dashboard.summary.deskReviewFilesDescription'),
		uploadSelectTitleKey: tk('editor.submission.review.currentFiles'),
	}),
	WORKFLOW_REVIEW_REVISIONS: ({stageId}) => ({
		permissions: [
			{
				roles: [pkp.const.ROLE_ID_AUTHOR],
				actions: [Actions.LIST, Actions.UPLOAD, Actions.EDIT, Actions.DELETE],
			},
			{
				roles: [
					pkp.const.ROLE_ID_AUTHOR,
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_ASSISTANT,
				],
				actions: [
					Actions.LIST,
					Actions.UPLOAD,
					Actions.EDIT,
					Actions.DELETE,
					Actions.SEE_NOTES,
				],
			},
		],
		actions: [Actions.UPLOAD, Actions.EDIT, Actions.DELETE, Actions.SEE_NOTES],
		fileStage:
			stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
				? pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_REVISION
				: pkp.const.SUBMISSION_FILE_REVIEW_REVISION,
		titleKey: tk('dashboard.summary.revisionsUploaded'),
		descriptionKey: tk('dashboard.summary.revisionsUploadedDescription'),
		wizardTitleKey: tk('editor.submissionReview.uploadFile'),
	}),
	COPYEDITED_FILES: ({stageId}) => ({
		permissions: [
			{
				roles: [pkp.const.ROLE_ID_AUTHOR],
				actions: [Actions.LIST],
			},
			{
				roles: [
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_ASSISTANT,
				],
				actions: [
					Actions.LIST,
					Actions.UPLOAD,
					Actions.EDIT,
					Actions.DELETE,
					Actions.SEE_NOTES,
				],
			},
		],
		actions: [
			Actions.LIST,
			Actions.UPLOAD,
			Actions.EDIT,
			Actions.DELETE,
			Actions.SEE_NOTES,
		],
		fileStage: pkp.const.SUBMISSION_FILE_COPYEDIT,
		titleKey: tk('dashboard.summary.copyeditedFiles'),
		descriptionKey: tk('dashboard.summary.copyeditedFilesDescription'),
		gridComponent: 'grid.files.copyedit.CopyeditFilesGridHandler',
		uploadSelectTitleKey: tk('editor.submissionReview.uploadFile'),
	}),
	FINAL_DRAFT_FILES: ({stageId}) => ({
		permissions: [
			{
				roles: [
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_ASSISTANT,
				],
				actions: [
					Actions.LIST,
					Actions.SELECT_UPLOAD,
					Actions.EDIT,
					Actions.DELETE,
					Actions.SEE_NOTES,
				],
			},
		],
		actions: [
			Actions.LIST,
			Actions.SELECT_UPLOAD,
			Actions.EDIT,
			Actions.DELETE,
			Actions.SEE_NOTES,
		],
		fileStage: pkp.const.SUBMISSION_FILE_FINAL,
		titleKey: tk('dashboard.summary.draftFiles'),
		descriptionKey: tk('dashboard.summary.draftFilesDescription'),
		gridComponent: 'grid.files.final.FinalDraftFilesGridHandler',
		uploadSelectTitleKey: tk('editor.submission.uploadSelectFiles'),
	}),
	PRODUCTION_READY_FILES: ({stageId}) => ({
		permissions: [
			{
				roles: [
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_ASSISTANT,
				],
				actions: [
					Actions.LIST,
					Actions.UPLOAD,
					Actions.EDIT,
					Actions.DELETE,
					Actions.SEE_NOTES,
				],
			},
		],
		actions: [
			Actions.LIST,
			Actions.UPLOAD,
			Actions.EDIT,
			Actions.DELETE,
			Actions.SEE_NOTES,
		],
		fileStage: pkp.const.SUBMISSION_FILE_PRODUCTION_READY,
		titleKey: tk('dashboard.summary.productionReadyFiles'),
		descriptionKey: tk('dashboard.summary.productionReadyFilesDescription'),
		wizardTitleKey: tk('submission.upload.productionReady'),
	}),
};

export function useFileManagerConfig({configName, submissionStageId}) {
	const {t} = useLocalize();

	const {hasCurrentUserAtLeastOneRole} = useCurrentUser();

	const managerConfig = computed(() => {
		const config = FileManagerConfigurations[configName]({
			stageId: submissionStageId,
		});

		const permittedActions = config.actions.filter((action) => {
			return config.permissions.some((perm) => {
				return (
					perm.actions.includes(action) &&
					hasCurrentUserAtLeastOneRole(perm.roles)
				);
			});
		});

		return {
			fileStage: config.fileStage,
			permittedActions,
			title: t(config.titleKey),
			description: t(config.descriptionKey),
			wizardTitleKey: config.wizardTitleKey,
			uploadSelectTitleKey: config.uploadSelectTitleKey,
			gridComponent: config.gridComponent,
		};
	});

	return {managerConfig};
}
