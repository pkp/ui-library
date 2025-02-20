import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

export const Actions = {
	PARTICIPANT_ASSIGN: 'participantAssign',
	PARTICIPANT_REMOVE: 'participantRemove',
	PARTICIPANT_EDIT: 'participantEdit',
	PARTICIPANT_NOTIFY: 'participantNotify',
	PARTICIPANT_LOGIN_AS: 'participantLoginAs',
};

export function useParticipantManagerActions() {
	const {t} = useLocalize();

	function participantAssign(
		{submission, submissionStageId},
		finishedCallback,
	) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.stageParticipant.StageParticipantGridHandler',
			op: 'addParticipant',
			params: {
				submissionId: submission.id,
				stageId: submissionStageId,
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
					label: t('common.ok'),
					isWarnable: true,
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
				{
					label: t('common.cancel'),
					callback: (close) => {
						close();
					},
				},
			],
			title: t('editor.submission.removeStageParticipant'),
			message: t('editor.submission.removeStageParticipant.description'),
			modalStyle: 'negative',
		});
	}

	function participantNotify(
		{submission, submissionStageId, participant},
		finishedCallback,
	) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.stageParticipant.StageParticipantGridHandler',
			op: 'viewNotify',
			params: {
				submissionId: submission.id,
				stageId: submissionStageId,
				userId: participant.id,
			},
		});
		openLegacyModal(
			{title: t('submission.stageParticipants.notify')},
			finishedCallback,
		);
	}

	function participantEdit(
		{submission, submissionStageId, participant},
		finishedCallback,
	) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.users.stageParticipant.StageParticipantGridHandler',
			op: 'addParticipant',
			params: {
				submissionId: submission.id,
				stageId: submissionStageId,
				assignmentId: participant.stageAssignmentId,
			},
		});

		openLegacyModal(
			{title: t('editor.submission.editStageParticipant')},
			finishedCallback,
		);
	}

	function participantLoginAs({participant, submission}) {
		const {openDialog} = useModal();

		openDialog({
			actions: [
				{
					label: t('common.ok'),
					callback: (close) => {
						let redirectUrl = '';
						if (participant.roleId === pkp.const.ROLE_ID_AUTHOR) {
							const {pageUrl: authorRedirectUrl} = useUrl(
								`dashboard/mySubmissions?workflowSubmissionId=${submission.id}`,
							);
							redirectUrl = authorRedirectUrl.value;
						} else {
							const {pageUrl: editorialRedirectUrl} = useUrl(
								`dashboard/editorial?workflowSubmissionId=${submission.id}`,
							);
							redirectUrl = editorialRedirectUrl.value;
						}
						const {redirectToPage} = useUrl(
							`login/signInAsUser/${participant.id}?redirectUrl=${encodeURIComponent(redirectUrl)}`,
						);
						redirectToPage();
					},
				},
				{
					label: t('common.cancel'),
					isWarnable: true,
					callback: (close) => {
						close();
					},
				},
			],
			title: t('grid.action.logInAs'),
			message: t('grid.user.confirmLogInAs'),
			modalStyle: 'primary',
		});
	}

	return {
		participantAssign,
		participantRemove,
		participantNotify,
		participantEdit,
		participantLoginAs,
	};
}
