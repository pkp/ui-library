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
				actions: [
					Actions.FILE_FILE_LIST,
					Actions.FILE_EDIT,
					Actions.FILE_DOWNLOAD_ALL,
				],
			},
			{
				roles: [
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_ASSISTANT,
				],
				actions: [
					Actions.FILE_LIST,
					Actions.FILE_UPLOAD,
					Actions.FILE_DOWNLOAD_ALL,
					Actions.FILE_EDIT,
					Actions.FILE_DELETE,
					Actions.FILE_SEE_NOTES,
				],
			},
		],
		actions: [
			Actions.FILE_UPLOAD,
			Actions.FILE_DOWNLOAD_ALL,
			Actions.FILE_EDIT,
			Actions.FILE_DELETE,
			Actions.FILE_SEE_NOTES,
		],
		fileStage: pkp.const.SUBMISSION_FILE_SUBMISSION,
		titleKey: tk('submission.submit.submissionFiles'),
		descriptionKey: tk('fileManager.submissionFilesDescription'),
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
					Actions.FILE_LIST,
					Actions.FILE_SELECT_UPLOAD,
					Actions.FILE_EDIT,
					Actions.FILE_DELETE,
					Actions.FILE_SEE_NOTES,
				],
			},
		],

		actions: [
			Actions.FILE_SELECT_UPLOAD,
			Actions.FILE_EDIT,
			Actions.FILE_DELETE,
			Actions.FILE_SEE_NOTES,
		],
		fileStage:
			stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
				? pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_FILE
				: pkp.const.SUBMISSION_FILE_REVIEW_FILE,
		gridComponent: 'grid.files.review.EditorReviewFilesGridHandler',
		titleKey: tk('fileManager.filesForReview'),
		descriptionKey: tk('fileManager.filesForReviewDescription'),
		uploadSelectTitleKey: tk('editor.submission.review.currentFiles'),
	}),
	WORKFLOW_REVIEW_REVISIONS: ({stageId}) => ({
		permissions: [
			{
				roles: [pkp.const.ROLE_ID_AUTHOR],
				actions: [
					Actions.FILE_LIST,
					Actions.FILE_UPLOAD,
					Actions.FILE_EDIT,
					Actions.FILE_DELETE,
				],
			},
			{
				roles: [
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_ASSISTANT,
				],
				actions: [
					Actions.FILE_LIST,
					Actions.FILE_UPLOAD,
					Actions.FILE_EDIT,
					Actions.FILE_DELETE,
					Actions.FILE_SEE_NOTES,
				],
			},
		],
		actions: [
			Actions.FILE_UPLOAD,
			Actions.FILE_EDIT,
			Actions.FILE_DELETE,
			Actions.FILE_SEE_NOTES,
		],
		fileStage:
			stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
				? pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_REVISION
				: pkp.const.SUBMISSION_FILE_REVIEW_REVISION,
		titleKey: tk('fileManager.revisionsUploaded'),
		descriptionKey: tk('fileManager.revisionsUploadedDescription'),
		wizardTitleKey: tk('editor.submissionReview.uploadFile'),
	}),
	COPYEDITED_FILES: ({stageId}) => ({
		permissions: [
			{
				roles: [pkp.const.ROLE_ID_AUTHOR],
				actions: [Actions.FILE_LIST],
			},
			{
				roles: [
					pkp.const.ROLE_ID_SUB_EDITOR,
					pkp.const.ROLE_ID_MANAGER,
					pkp.const.ROLE_ID_SITE_ADMIN,
					pkp.const.ROLE_ID_ASSISTANT,
				],
				actions: [
					Actions.FILE_LIST,
					Actions.FILE_SELECT_UPLOAD,
					Actions.FILE_EDIT,
					Actions.FILE_DELETE,
					Actions.FILE_SEE_NOTES,
				],
			},
		],
		actions: [
			Actions.FILE_LIST,
			Actions.FILE_SELECT_UPLOAD,
			Actions.FILE_EDIT,
			Actions.FILE_DELETE,
			Actions.FILE_SEE_NOTES,
		],
		fileStage: pkp.const.SUBMISSION_FILE_COPYEDIT,
		titleKey: tk('fileManager.copyeditedFiles'),
		descriptionKey: tk('fileManager.copyeditedFilesDescription'),
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
					Actions.FILE_LIST,
					Actions.FILE_SELECT_UPLOAD,
					Actions.FILE_EDIT,
					Actions.FILE_DELETE,
					Actions.FILE_SEE_NOTES,
				],
			},
		],
		actions: [
			Actions.FILE_LIST,
			Actions.FILE_SELECT_UPLOAD,
			Actions.FILE_EDIT,
			Actions.FILE_DELETE,
			Actions.FILE_SEE_NOTES,
		],
		fileStage: pkp.const.SUBMISSION_FILE_FINAL,
		titleKey: tk('submission.finalDraft'),
		descriptionKey: tk('fileManager.draftFilesDescription'),
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
					Actions.FILE_LIST,
					Actions.FILE_UPLOAD,
					Actions.FILE_EDIT,
					Actions.FILE_DELETE,
					Actions.FILE_SEE_NOTES,
					Actions.FILE_DOWNLOAD_ALL,
				],
			},
		],
		actions: [
			Actions.FILE_LIST,
			Actions.FILE_UPLOAD,
			Actions.FILE_EDIT,
			Actions.FILE_DELETE,
			Actions.FILE_SEE_NOTES,
			Actions.FILE_DOWNLOAD_ALL,
		],
		fileStage: pkp.const.SUBMISSION_FILE_PRODUCTION_READY,
		titleKey: tk('editor.submission.production.productionReadyFiles'),
		descriptionKey: tk('fileManager.productionReadyFilesDescription'),
		wizardTitleKey: tk('submission.upload.productionReady'),
	}),
};

export function useFileManagerConfig({
	namespace,
	submissionStageId,
	submission,
}) {
	const {t} = useLocalize();

	const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

	const managerConfig = computed(() => {
		const config = FileManagerConfigurations[namespace.value]({
			stageId: submissionStageId.value,
		});

		const permittedActions = config.actions.filter((action) => {
			return config.permissions.some((perm) => {
				return (
					perm.actions.includes(action) &&
					hasCurrentUserAtLeastOneAssignedRoleInStage(
						submission.value,
						submissionStageId.value,
						perm.roles,
					)
				);
			});
		});

		return {
			fileStage: config.fileStage,
			permittedActions,
			title: t(config.titleKey),
			titleKey: config.titleKey,
			description: t(config.descriptionKey),
			wizardTitleKey: config.wizardTitleKey,
			uploadSelectTitleKey: config.uploadSelectTitleKey,
			gridComponent: config.gridComponent,
		};
	});

	return {managerConfig};
}
