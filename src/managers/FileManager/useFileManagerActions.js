import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
export function useReviewerManagerActions() {
	function getAvailableActions() {
		const actions = [];

		// TODO add logic when to enable individual actions
		actions.push({
			label: 'More information',
			name: 'moreInformationFile',
		});
		actions.push({
			label: 'Edit',
			name: 'editFile',
		});
		actions.push({
			label: 'Delete',
			name: 'deleteFile',
			isWarnable: true,
		});

		return actions;
	}

	function handleAction(actionName, {file, submissionId, submissionStageId}) {
		console.log('handle file action:', actionName);
		const {t} = useLocalize();

		// /information-center/file-information-center/view-information-center?submissionFileId=31&submissionId=12&stageId=3

		if (actionName === 'moreInformationFile') {
			const {url} = useLegacyGridUrl({
				component: 'informationCenter.SubmissionInformationCenterHandler',
				op: 'viewInformationCenter',
				params: {
					submissionFileId: file.id,
					submissionId,
					stageId: submissionStageId,
				},
			});
			const {openSideModal} = useModal();

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						title: t('informationCenter.informationCenter'),
						url,
					},
				},
				{
					onClose: async () => {
						//finishedCallback();
					},
				},
			);
		} else if (actionName === 'editFile') {
			const {url} = useLegacyGridUrl({
				component: 'api.file.ManageFileApiHandler',
				op: 'editMetadata',
				params: {
					submissionFileId: file.id,
					submissionId,
					stageId: submissionStageId,
				},
			});
			const {openSideModal} = useModal();

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						title: t('grid.action.editFile'),
						url,
					},
				},
				{
					onClose: async () => {
						//finishedCallback();
					},
				},
			);
		} else if (actionName === 'deleteFile') {
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
									submissionId,
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

							if (data.status !== true) {
								openDialogNetworkError();
							}
						},
					},
				],
				title: t('common.delete'),
				message: t('common.confirmDelete'),
			});
		}
	}
	return {getAvailableActions, handleAction};
}
