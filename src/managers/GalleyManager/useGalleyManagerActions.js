import {useLocalize} from '@/composables/useLocalize';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
export const Actions = {
	GALLEY_ADD: 'galleyAdd',
	GALLEY_EDIT: 'galleyEdit',
	GALLEY_CHANGE_FILE: 'galleyChangeFile',
	GALLEY_DELETE: 'galleyDelete',
};

export function useGalleyManagerActions({galleyGridComponent}) {
	const {t} = useLocalize();

	function getBottomActions({canEdit}) {
		const actions = [];

		if (!canEdit) {
			return [];
		}

		actions.push({
			component: 'GalleyManagerActionButton',
			props: {label: t('grid.action.addGalley'), action: Actions.GALLEY_ADD},
			isLink: true,
		});

		return actions;
	}

	function getTopItems({canEdit}) {
		const actions = [];
		if (!canEdit) {
			return [];
		}

		actions.push({component: 'GalleyManagerSortButton'});

		return actions;
	}

	function getItemActions({canEdit}) {
		const actions = [];

		if (!canEdit) {
			return [
				{
					label: t('common.view'),
					name: Actions.GALLEY_EDIT,
					icon: 'View',
				},
			];
		}

		actions.push({
			label: t('common.edit'),
			name: Actions.GALLEY_EDIT,
			icon: 'Edit',
		});

		actions.push({
			label: t('submission.changeFile'),
			name: Actions.GALLEY_CHANGE_FILE,
			icon: 'New',
		});

		actions.push({
			label: t('common.delete'),
			name: Actions.GALLEY_DELETE,
			icon: 'Cancel',
			isWarnable: true,
		});

		return actions;
	}

	function galleyAdd({submission, publication}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: galleyGridComponent,
			op: 'addGalley',
			params: {
				submissionId: submission.id,
				publicationId: publication.id,
			},
		});

		openLegacyModal({title: t('submission.layout.newGalley')}, (closeData) => {
			if (closeData.dataChanged[0]) {
				galleyChangeFile(
					{
						submission,
						publication,
						galley: {id: closeData.dataChanged[0]},
					},
					finishedCallback,
				);
			} else {
				finishedCallback();
			}
		});
	}

	function galleyChangeFile({galley, submission}, finishedCallback) {
		// http://localhost:7002/index.php/publicknowledge/$$$call$$$/wizard/file-upload
		//file-upload-wizard/start-wizard?fileStage=10&reviewRoundId&assocType=521&assocId=8&submissionId=17&stageId=5&uploaderRoles=16-1-17-4097

		const {openLegacyModal} = useLegacyGridUrl({
			component: 'wizard.fileUpload.FileUploadWizardHandler',
			op: 'startWizard',
			params: {
				fileStage: pkp.const.SUBMISSION_FILE_PROOF,
				assocType: pkp.const.ASSOC_TYPE_REPRESENTATION,
				assocId: galley.id,
				submissionId: submission.id,
				stageId: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				// is not used anymore, but its still required, passing anything works fine for now
				uploaderRoles: pkp.const.ROLE_ID_REVIEWER,
			},
		});

		openLegacyModal({title: t('submission.upload.proof')}, finishedCallback);
	}

	function galleyEdit({submission, publication, galley}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: galleyGridComponent,
			op: 'editGalley',
			params: {
				submissionId: submission.id,
				publicationId: publication.id,
				representationId: galley.id,
			},
		});

		openLegacyModal({title: t('submission.upload.proof')}, finishedCallback);
	}

	function galleyDelete({submission, publication, galley}, finishedCallback) {
		const {openDialog, openDialogNetworkError} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: async (close) => {
						// http://localhost:7002/index.php/publicknowledge/$$$call$$$/grid/article-galleys/article-galley-grid/delete-galley
						// ?submissionId=17&publicationId=22&representationId=9
						const {url} = useLegacyGridUrl({
							component: galleyGridComponent,
							op: 'deleteGalley',
							params: {
								submissionId: submission.id,
								publicationId: publication.id,
								representationId: galley.id,
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
						finishedCallback();
					},
				},
			],
			title: t('common.delete'),
			message: t('common.confirmDelete'),
			modalStyle: 'negative',
		});
	}

	return {
		galleyChangeFile,
		galleyAdd,
		galleyEdit,
		galleyDelete,
		getItemActions,
		getBottomActions,
		getTopItems,
	};
}
