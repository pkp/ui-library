import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref, toRefs, computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';
import {Actions, useFileManagerActions} from './useFileManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';

const {tk} = useLocalize();

export const FileManagerConfigurations = {
	EDITOR_SUBMISSION_FILES: ({stageId}) => ({
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
		actions: [Actions.UPLOAD, Actions.EDIT, Actions.DELETE, Actions.SEE_NOTES],
		fileStage:
			stageId === pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW
				? pkp.const.SUBMISSION_FILE_INTERNAL_REVIEW_REVISION
				: pkp.const.SUBMISSION_FILE_REVIEW_REVISION,
		titleKey: tk('dashboard.summary.revisionsSubmitted'),
		descriptionKey: tk('dashboard.summary.revisionsSubmittedDescription'),
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

export const useFileManagerStore = defineComponentStore(
	'fileManager',
	(props) => {
		const {t} = useLocalize();

		const submissionId = ref(props.submission.id);

		const {apiUrl: filesApiUrl} = useUrl(
			`submissions/${submissionId.value}/files`,
		);

		/** Expose file manager configuration */
		const {hasCurrentUserAtLeastOneRole} = useCurrentUser();

		const managerConfiguration = computed(() => {
			const config = FileManagerConfigurations[props.configName]({
				stageId: props.submissionStageId,
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

		const {data, fetch: fetchFiles} = useFetch(filesApiUrl, {
			query: {
				fileStages: managerConfiguration.value.fileStage,
				reviewRoundId: props.reviewRoundId ? props.reviewRoundId : undefined,
			},
		});

		const files = computed(() => data.value?.items || []);

		fetchFiles();

		/** Handling Actions */

		const {
			getItemActions: _getItemActions,
			getBottomActions: _getBottomActions,
			getTopActions: _getTopActions,
			handleAction: _handleAction,
			handleItemAction: _handleItemAction,
		} = toRefs(useFileManagerActions());

		const topActions = computed(() =>
			_getTopActions.value({
				managerConfiguration: managerConfiguration.value,
			}),
		);

		const bottomActions = computed(() =>
			_getBottomActions.value({
				managerConfiguration: managerConfiguration.value,
				filesCount: files.value.length,
			}),
		);

		const itemActions = computed(() =>
			_getItemActions.value({
				managerConfiguration: managerConfiguration.value,
			}),
		);

		function handleItemAction(actionName, {file}) {
			_handleItemAction.value(
				actionName,
				{
					file,
					submissionStageId: props.submissionStageId,
					reviewRoundId: props.reviewRoundId,
					submission: props.submission,
				},
				() => {
					fetchFiles();

					// delete actions creates legacy notifications
					// calling explicitely to check for it
					if (actionName === Actions.DELETE) {
						$('body').trigger('notifyUser');
					}
				},
			);
		}

		function handleAction(actionName) {
			_handleAction.value(
				actionName,
				{
					submissionStageId: props.submissionStageId,
					reviewRoundId: props.reviewRoundId,
					submission: props.submission,
					fileStage: managerConfiguration.value.fileStage,
					wizardTitleKey: managerConfiguration.value.wizardTitleKey,
					uploadSelectTitleKey: managerConfiguration.value.uploadSelectTitleKey,
					gridComponent: managerConfiguration.value.gridComponent,
				},
				() => fetchFiles(),
			);
		}

		return {
			title: props.title,
			files,
			fetchFiles,
			managerConfiguration,
			_handleAction,
			_handleItemAction,
			_getItemActions,
			_getBottomActions,
			_getTopActions,
			topActions,
			bottomActions,
			itemActions,
			handleItemAction,
			handleAction,
		};
	},
);
