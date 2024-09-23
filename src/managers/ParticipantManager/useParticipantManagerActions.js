import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useCurrentUser} from '@/composables/useCurrentUser';

export const Actions = {
	PARTICIPANT_ASSIGN: 'participantAssign',
	PARTICIPANT_REMOVE: 'participantRemove',
	PARTICIPANT_EDIT: 'participantEdit',
	PARTICIPANT_NOTIFY: 'participantNotify',
	PARTICIPANT_LOGIN_AS: 'participantLoginAs',
};

export function useParticipantManagerActions() {
	const {t} = useLocalize();

	function participantAssign({submission}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.stageParticipant.StageParticipantGridHandler',
			op: 'addParticipant',
			params: {
				submissionId: submission.id,
				stageId: submission.stageId,
			},
		});

		openLegacyModal(
			{title: t('editor.submission.addStageParticipant')},
			finishedCallback,
		);
	}

	function participantRemove(
		{submission, participant, submissionStageId},
		finishedCallback,
	) {
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
								assignmentId: participant.stageAssignmentId,
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
	}

	function participantNotify({submission, participant}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.stageParticipant.StageParticipantGridHandler',
			op: 'viewNotify',
			params: {
				submissionId: submission.id,
				stageId: submission.stageId,
				userId: participant.id,
			},
		});
		openLegacyModal(
			{title: t('submission.stageParticipants.notify')},
			finishedCallback,
		);
	}

	function participantEdit({submission, participant}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.stageParticipant.StageParticipantGridHandler',
			op: 'addParticipant',
			params: {
				submissionId: submission.id,
				stageId: submission.stageId,
				assignmentId: participant.stageAssignmentId,
			},
		});

		openLegacyModal(
			{title: t('editor.submission.editStageParticipant')},
			finishedCallback,
		);
	}

	function participantLoginAs({participant}) {
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

	function getItemActions() {
		const {t} = useLocalize();

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
				label: t('common.edit'),
				name: Actions.PARTICIPANT_EDIT,
				icon: 'Edit',
			});
		}

		actions.push({
			label: t('submission.stageParticipants.notify'),
			name: Actions.PARTICIPANT_NOTIFY,
			icon: 'Email',
		});

		// TODO https://github.com/pkp/pkp-lib/issues/10290
		actions.push({
			label: t('grid.action.logInAs'),
			name: Actions.PARTICIPANT_LOGIN_AS,
			icon: 'LoginAs',
		});

		if (canAdminister) {
			actions.push({
				label: t('common.remove'),
				name: Actions.PARTICIPANT_REMOVE,
				icon: 'Cancel',
				isWarnable: true,
			});
		}

		return actions;
	}

	return {
		getItemActions,
		participantAssign,
		participantRemove,
		participantNotify,
		participantEdit,
		participantLoginAs,
	};
}
