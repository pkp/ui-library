import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch, getCSRFToken} from '@/composables/useFetch';

export const Actions = {
	FILE_LIST: 'fileList',
	FILE_UPLOAD: 'fileUpload',
	FILE_SELECT_UPLOAD: 'fileSelectUpload',
	FILE_DOWNLOAD_ALL: 'fileDownloadAll',
	FILE_EDIT: 'fileEdit',
	FILE_DELETE: 'fileDelete',
	FILE_SEE_NOTES: 'fileSeeNotes',
};

export function useFileManagerActions() {
	const {t, localize} = useLocalize();

	function fileUpload(
		{fileStage, reviewRoundId, submission, submissionStageId, wizardTitleKey},
		finishedCallback,
	) {
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
	}

	function fileSelectUpload(
		{
			gridComponent,
			fileStage,
			reviewRoundId,
			submission,
			submissionStageId,
			uploadSelectTitleKey,
		},
		finishedCallback,
	) {
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

	function fileDownloadAll({fileStage, submission, submissionStageId}) {
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
	}

	function fileEdit({file, submission, submissionStageId}, finishedCallback) {
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
	}

	function fileDelete({file, submission, submissionStageId}, finishedCallback) {
		const {openDialog, openDialogNetworkError} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
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
				{
					label: t('common.cancel'),
					callback: (close) => {
						close();
					},
				},
			],
			title: t('common.delete'),
			message: t('common.confirmDelete'),
			modalStyle: 'negative',
		});
	}

	function fileSeeNotes(
		{file, submission, submissionStageId},
		finishedCallback,
	) {
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
	}

	function getTopActions({managerConfig}) {
		const actions = [];
		const enabledActions = managerConfig.permittedActions;

		if (enabledActions.includes(Actions.FILE_UPLOAD)) {
			actions.push({
				// this might be different based on fileStage, more details in AddFileLinkAction.php
				label: t('common.upload'),
				name: Actions.FILE_UPLOAD,
			});
		}

		if (enabledActions.includes(Actions.FILE_SELECT_UPLOAD)) {
			actions.push({
				label: t('editor.submission.uploadSelectFiles'),
				name: Actions.FILE_SELECT_UPLOAD,
			});
		}

		return actions;
	}

	function getBottomActions({managerConfig, filesCount}) {
		const actions = [];
		const enabledActions = managerConfig.permittedActions;
		if (enabledActions.includes(Actions.FILE_DOWNLOAD_ALL) && filesCount) {
			actions.push({
				label: t('submission.files.downloadAll'),
				name: 'downloadAll',
			});
		}

		return actions;
	}

	function getItemActions({managerConfig}) {
		const actions = [];
		const enabledActions = managerConfig.permittedActions;
		if (enabledActions.includes(Actions.FILE_SEE_NOTES)) {
			actions.push({
				label: t('grid.action.moreInformation'),
				name: Actions.FILE_SEE_NOTES,
				icon: 'View',
			});
		}

		if (enabledActions.includes(Actions.FILE_EDIT)) {
			actions.push({
				label: t('grid.action.edit'),
				name: Actions.FILE_EDIT,
				icon: 'Edit',
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
		fileUpload,
		fileSelectUpload,
		fileDownloadAll,
		fileEdit,
		fileDelete,
		fileSeeNotes,
		getItemActions,
		getTopActions,
		getBottomActions,
	};
}
