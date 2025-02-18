import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useFileManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';

const {tk} = useLocalize();

export const FileManagerConfigurations = {
	SUBMISSION_FILES: ({stageId}) => ({
		permissions: [
			{
				roles: [pkp.const.ROLE_ID_AUTHOR],
				actions: [
					Actions.FILE_LIST,
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

export function useFileManagerConfig() {
	const {t} = useLocalize();

	const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

	function getManagerConfig({namespace, submissionStageId, submission}) {
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
	}

	function getColumns() {
		const columns = [];
		columns.push({
			header: t('common.numero'),
			component: 'FileManagerCellNumero',
			props: {},
		});
		columns.push({
			header: t('common.fileName'),
			component: 'FileManagerCellFileName',
			props: {},
		});
		columns.push({
			header: t('common.dateUploaded'),
			component: 'FileManagerCellDateUploaded',
			props: {},
		});
		columns.push({
			header: t('common.type'),
			component: 'FileManagerCellType',
			props: {},
		});

		columns.push({
			headerSrOnly: true,
			header: t('common.moreActions'),
			component: 'FileManagerCellMoreActions',
			props: {},
		});

		return columns;
	}

	function getTopItems({managerConfig}) {
		const actions = [];
		const enabledActions = managerConfig.permittedActions;

		if (enabledActions.includes(Actions.FILE_UPLOAD)) {
			actions.push({
				component: 'FileManagerActionButton',
				props: {
					label: t('common.upload'),
					action: Actions.FILE_UPLOAD,
				},
			});
		}

		if (enabledActions.includes(Actions.FILE_SELECT_UPLOAD)) {
			actions.push({
				component: 'FileManagerActionButton',
				props: {
					label: t('editor.submission.uploadSelectFiles'),
					action: Actions.FILE_SELECT_UPLOAD,
				},
			});
		}

		return actions;
	}

	function getBottomItems({managerConfig, filesCount}) {
		const actions = [];
		const enabledActions = managerConfig.permittedActions;
		if (enabledActions.includes(Actions.FILE_DOWNLOAD_ALL) && filesCount) {
			actions.push({
				component: 'FileManagerActionButton',
				props: {
					label: t('submission.files.downloadAll'),
					action: Actions.FILE_DOWNLOAD_ALL,
					isLink: true,
				},
			});
		}

		return actions;
	}

	function getItemActions({managerConfig}) {
		const actions = [];
		const enabledActions = managerConfig.permittedActions;

		if (enabledActions.includes(Actions.FILE_EDIT)) {
			actions.push({
				label: t('grid.action.edit'),
				name: Actions.FILE_EDIT,
				icon: 'Edit',
			});
		}

		if (enabledActions.includes(Actions.FILE_SEE_NOTES)) {
			actions.push({
				label: t('grid.action.moreInformation'),
				name: Actions.FILE_SEE_NOTES,
				icon: 'View',
			});
		}

		if (enabledActions.includes(Actions.FILE_DELETE)) {
			actions.push({
				label: t('grid.action.delete'),
				name: Actions.FILE_DELETE,
				isWarnable: true,
				icon: 'Cancel',
			});
		}

		return actions;
	}

	return {
		getManagerConfig,
		getColumns,
		getBottomItems,
		getTopItems,
		getItemActions,
	};
}
