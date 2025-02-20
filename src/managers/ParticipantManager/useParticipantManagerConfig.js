import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useParticipantManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';

export function useParticipantManagerConfig() {
	function getTopItems({submission, submissionStageId}) {
		const {t} = useLocalize();

		const actions = [];

		const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

		const canAdminister = hasCurrentUserAtLeastOneAssignedRoleInStage(
			submission,
			submissionStageId,
			[
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_SUB_EDITOR,
			],
		);

		if (canAdminister) {
			actions.push({
				component: 'ParticipantManagerActionButton',
				props: {label: t('common.assign'), action: Actions.PARTICIPANT_ASSIGN},
			});
		}
		return actions;
	}

	function getItemActions({submission, submissionStageId, participant}) {
		const {t} = useLocalize();
		console.log('getItemActions');
		const actions = [];

		const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

		const canAdminister = hasCurrentUserAtLeastOneAssignedRoleInStage(
			submission,
			submissionStageId,
			[
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_SUB_EDITOR,
			],
		);

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

		if (participant.canLoginAs) {
			actions.push({
				label: t('grid.action.logInAs'),
				name: Actions.PARTICIPANT_LOGIN_AS,
				icon: 'LoginAs',
			});
		}

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
		getTopItems,
		getItemActions,
	};
}
