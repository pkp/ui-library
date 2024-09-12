import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch, getCSRFToken} from '@/composables/useFetch';

export const Actions = {
	LIST: 'LIST',
	UPLOAD: 'UPLOAD',
	SELECT_UPLOAD: 'SELECT_UPLOAD',
	DOWNLOAD_ALL: 'DOWNLOAD_ALL',
	EDIT: 'EDIT',
	DELETE: 'DELETE',
	SEE_NOTES: 'SEE_NOTES',
};

export function useFileManagerActions() {
	function handleAction(
		actionName,
		{
			submission,
			reviewRoundId,
			submissionStageId,
			fileStage,
			wizardTitleKey,
			uploadSelectTitleKey,
			gridComponent,
			file,
		},
		finishedCallback,
	) {
		const {t, localize} = useLocalize();

		if (actionName === Actions.SEE_NOTES) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'informationCenter.FileInformationCenterHandler',
				op: 'viewInformationCenter',
				params: {
					submissionFileId: file.id,
					submissionId: submission.id,
					stageId: submissionStageId,
				},
			});

			openLegacyModal(
				{
					title: `${t('informationCenter.informationCenter')}: ${localize(file.name)}`,
				},
				finishedCallback,
			);
		} else if (actionName === Actions.EDIT) {
			const {openLegacyModal} = useLegacyGridUrl({
				component: 'api.file.ManageFileApiHandler',
				op: 'editMetadata',
				params: {
					submissionFileId: file.id,
					submissionId: submission.id,
					stageId: submissionStageId,
				},
			});

			openLegacyModal({title: t('grid.action.editFile')}, finishedCallback);
		} else if (actionName === Actions.DELETE) {
			// http://localhost:7003/index.php/publicknowledge/$$$call$$$/api/file/manage-file-api/delete-file?submissionFileId=31&submissionId=12&stageId=3

			const {openDialog, openDialogNetworkError} = useModal();
			openDialog({
				actions: [
					{
						label: t('common.cancel'),
						isWarnable: true,
						callback: (close) => {
							close();
						},
					},
					{
						label: t('common.ok'),
						callback: async (close) => {
							const {url} = useLegacyGridUrl({
								component: 'api.file.ManageFileApiHandler',
								op: 'deleteFile',
								params: {
									submissionFileId: file.id,
									submissionId: submission.id,
									stageId: submissionStageId,
								},
							});
							const formData = new FormData();
							formData.append('csrfToken', getCSRFToken());

							const {fetch, data} = useFetch(url, {
								method: 'POST',
								body: formData,
							});
							await fetch();
							close();
							finishedCallback();

							if (data.value.status !== true) {
								openDialogNetworkError();
							}
						},
					},
				],
				title: t('common.delete'),
				message: t('common.confirmDelete'),
			});
		} else if (actionName === Actions.DOWNLOAD_ALL) {
			// http://localhost:7003/index.php/publicknowledge/$$$call$$$/api/file/file-api/download-all-files?nameLocaleKey=editor.submission.production.productionReadyFiles&fileStage=11&submissionId=19&stageId=5
			// $router->url($request, null, 'api.file.FileApiHandler', 'downloadAllFiles', null, $actionArgs)
			const {url} = useLegacyGridUrl({
				component: 'api.file.FileApiHandler',
				op: 'downloadAllFiles',
				params: {
					// TODO this needs to be different for different grids
					nameLocaleKey: 'editor.submission.production.productionReadyFiles',
					fileStage,
					submissionId: submission.id,
					stageId: submissionStageId,
				},
			});

			window.location.href = url.value;
		} else if (actionName === Actions.UPLOAD) {
			// http://localhost:7003/index.php/publicknowledge/$$$call$$$/wizard/file-upload/file-upload-wizard/start-wizard?fileStage=15&reviewRoundId=13&submissionId=19&stageId=3&uploaderRoles=16-1-17-4097

			const {openLegacyModal} = useLegacyGridUrl({
				component: 'wizard.fileUpload.FileUploadWizardHandler',
				op: 'startWizard',
				params: {
					fileStage,
					reviewRoundId: reviewRoundId,
					//assocType: pkp.const.ASSOC_TYPE_REVIEW_ASSIGNMENT,
					//assocId: actionArgs.reviewAssignmentId,
					submissionId: submission.id,
					stageId: submissionStageId,
					// is not used anymore, but its still required, passing anything works fine for now
					uploaderRoles: pkp.const.ROLE_ID_REVIEWER,
				},
			});
			openLegacyModal({title: t(wizardTitleKey)}, finishedCallback);
		} else if (actionName === Actions.SELECT_UPLOAD) {
			// http://localhost:7003/index.php/publicknowledge/$$$call$$$/grid/files/review/editor-review-files-grid/
			//select-files?submissionId=13&stageId=3&reviewRoundId=14
			const {openLegacyModal} = useLegacyGridUrl({
				component: gridComponent,
				op: 'selectFiles',
				params: {
					fileStage,
					reviewRoundId: reviewRoundId,
					//assocType: pkp.const.ASSOC_TYPE_REVIEW_ASSIGNMENT,
					//assocId: actionArgs.reviewAssignmentId,
					submissionId: submission.id,
					stageId: submissionStageId,
					// is not used anymore, but its still required, passing anything works fine for now
					uploaderRoles: pkp.const.ROLE_ID_REVIEWER,
				},
			});

			const reviewRound =
				reviewRoundId &&
				submission.reviewRounds.find(
					(reviewRound) => reviewRound.id === reviewRoundId,
				);

			openLegacyModal(
				{
					title: t(uploadSelectTitleKey, {round: reviewRound?.round}),
				},
				finishedCallback,
			);
		}
	}

	function getTopActions({managerConfig}) {
		const actions = [];
		const enabledActions = managerConfig.permittedActions;

		if (enabledActions.includes(Actions.UPLOAD)) {
			actions.push({
				// this might be different based on fileStage, more details in AddFileLinkAction.php
				label: 'Upload',
				name: Actions.UPLOAD,
			});
		}

		if (enabledActions.includes(Actions.SELECT_UPLOAD)) {
			actions.push({
				label: 'Select/Upload',
				name: Actions.SELECT_UPLOAD,
			});
		}

		return actions;
	}

	function getBottomActions({managerConfig, filesCount}) {
		const actions = [];
		const enabledActions = managerConfig.permittedActions;
		if (enabledActions.includes(Actions.DOWNLOAD_ALL) && filesCount) {
			actions.push({
				label: 'Download All Files',
				name: 'downloadAll',
			});
		}

		return actions;
	}

	function getItemActions({managerConfig}) {
		const actions = [];
		const enabledActions = managerConfig.permittedActions;
		if (enabledActions.includes(Actions.SEE_NOTES)) {
			actions.push({
				label: 'More information',
				name: Actions.SEE_NOTES,
				icon: 'View',
			});
		}

		if (enabledActions.includes(Actions.EDIT)) {
			actions.push({
				label: 'Edit',
				name: Actions.EDIT,
				icon: 'Edit',
			});
		}

		if (enabledActions.includes(Actions.DELETE)) {
			actions.push({
				label: 'Delete',
				name: Actions.DELETE,
				isWarnable: true,
				icon: 'Cancel',
			});
		}

		return actions;
	}

	return {
		handleAction,
		getItemActions,
		getTopActions,
		getBottomActions,
	};
}
