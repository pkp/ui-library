import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useCurrentUser} from '@/composables/useCurrentUser';

export const Actions = {
	ASSIGN: 'assign',
	REMOVE: 'remove',
	EDIT: 'edit',
	NOTIFY: 'notify',
	LOGIN_AS: 'loginAs',
};

export function useParticipantManagerActions() {
	function handleAction(actionName, {submission}, finishedCallback) {
		const {t} = useLocalize();

		if (actionName === Actions.ASSIGN) {
			const {openSideModal} = useModal();

			const {url} = useLegacyGridUrl({
				component: 'grid.users.stageParticipant.StageParticipantGridHandler',
				op: 'addParticipant',
				params: {
					submissionId: submission.id,
					stageId: submission.stageId,
				},
			});

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						url,
						title: t('editor.submission.addStageParticipant'),
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		}
	}

	function getItemActions() {
		const actions = [];

		// [Role::ROLE_ID_MANAGER, Role::ROLE_ID_SITE_ADMIN, Role::ROLE_ID_SUB_EDITOR],
		const {hasCurrentUserAtLeastOneRole} = useCurrentUser();

		const canAdminister = hasCurrentUserAtLeastOneRole([
			pkp.const.ROLE_ID_MANAGER,
			pkp.const.ROLE_ID_SITE_ADMIN,
			pkp.const.ROLE_ID_SUB_EDITOR,
		]);

		if (canAdminister) {
			actions.push({
				label: 'Edit (t)',
				name: Actions.EDIT,
				icon: 'Edit',
			});
		}

		actions.push({
			label: 'Notify (t)',
			name: Actions.NOTIFY,
			icon: 'Email',
		});

		// TODO https://github.com/pkp/pkp-lib/issues/10290
		actions.push({
			label: 'Login As (t)',
			name: Actions.LOGIN_AS,
			icon: 'LoginAs',
		});

		if (canAdminister) {
			actions.push({
				label: 'Remove (t)',
				name: Actions.REMOVE,
				icon: 'Cancel',
				isWarnable: true,
			});
		}
		/*if (enabledActions.includes(Actions.SEE_NOTES)) {
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
		}*/

		return actions;
	}

	function handleItemAction(
		actionName,
		{submission, submissionStageId, participant},
		finishedCallback,
	) {
		const {t} = useLocalize();

		if (actionName === Actions.REMOVE) {
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
							// http://localhost:7002/index.php/publicknowledge/
							// $$$call$$$/grid/users/stage-participant/stage-participant-grid/delete-participant?submissionId=13&stageId=3&assignmentId=62
							// $$$call$$$/grid/users/stage-participant/stage-participant-grid/delete-participant?submissionId=16&stageId=1&assignmentId=63

							const {url} = useLegacyGridUrl({
								component:
									'grid.users.stageParticipant.StageParticipantGridHandler',
								op: 'deleteParticipant',
								params: {
									submissionId: submission.id,
									stageId: submissionStageId,
									// TODO refine once thats in the API
									assignmentId: participant.stageAssignmentId || 98,
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
				title: t('editor.submission.removeStageParticipant'),
				message: t('editor.submission.removeStageParticipant.description'),
			});
		} else if (actionName === Actions.NOTIFY) {
			//http://localhost:7002/index.php/publicknowledge/
			//$$$call$$$/grid/users/stage-participant/stage-participant-grid/view-notify?submissionId=13&stageId=3&userId=4

			const {url} = useLegacyGridUrl({
				component: 'grid.users.stageParticipant.StageParticipantGridHandler',
				op: 'viewNotify',
				params: {
					submissionId: submission.id,
					stageId: submission.stageId,
					userId: participant.id,
				},
			});
			const {openSideModal} = useModal();

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						title: t('submission.stageParticipants.notify'),
						url,
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === Actions.EDIT) {
			// http://localhost:7002/index.php/publicknowledge
			// $$$call$$$/grid/users/stage-participant/stage-participant-grid/add-participant?submissionId=15&stageId=5&assignmentId=71

			const {url} = useLegacyGridUrl({
				component: 'grid.users.stageParticipant.StageParticipantGridHandler',
				op: 'addParticipant',
				params: {
					submissionId: submission.id,
					stageId: submission.stageId,
					// TODO refine once thats in the API
					assignmentId: participant.stageAssignmentId || 63,
				},
			});
			const {openSideModal} = useModal();

			openSideModal(
				'LegacyAjax',
				{
					legacyOptions: {
						title: t('editor.submission.editStageParticipant'),
						url,
					},
				},
				{
					onClose: async () => {
						finishedCallback();
					},
				},
			);
		} else if (actionName === Actions.LOGIN_AS) {
			const {openDialog} = useModal();

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
						callback: (close) => {
							const {redirectToPage} = useUrl(
								`login/signInAsUser/${participant.id}`,
							);
							redirectToPage();
						},
					},
				],
				title: t('grid.action.logInAs'),
				message: t('grid.user.confirmLogInAs'),
			});
		}
	}
	return {
		getItemActions,
		handleAction,
		handleItemAction,
	};
}
