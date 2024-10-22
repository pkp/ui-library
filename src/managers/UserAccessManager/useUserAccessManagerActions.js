import {useLocalize} from '@/composables/useLocalize';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

export const Actions = {
	USER_ACCESS_EDIT: 'editUser',
	USER_ACCESS_SEND_MAIL: 'sendEmail',
	USER_ACCESS_LOGIN_AS: 'loginAs',
	USER_ACCESS_REMOVE_USER: 'removeUser',
	USER_ACCESS_DISABLE_USER: 'disableUser',
	USER_ACCESS_MERGE_USER: 'mergeUser',
};

export function useUserAccessManagerActions() {
	const {t} = useLocalize();

	function getItemActions(userObj) {
		const actions = [];

		actions.push({
			label: t('common.edit'),
			name: Actions.USER_ACCESS_EDIT,
			icon: 'Edit',
		});

		actions.push({
			label: t('email.email'),
			icon: 'Email',
			name: Actions.USER_ACCESS_SEND_MAIL,
		});

		actions.push({
			label: t('grid.action.logInAs'),
			icon: 'LoginAs',
			name: Actions.USER_ACCESS_LOGIN_AS,
		});

		actions.push({
			label: t('grid.action.remove'),
			icon: 'Cancel',
			name: Actions.USER_ACCESS_REMOVE_USER,
			isWarnable: true,
		});

		actions.push({
			label: userObj.disabled
				? t('grid.action.enable')
				: t('grid.action.disable'),
			icon: 'DisableUser',
			name: Actions.USER_ACCESS_DISABLE_USER,
			isWarnable: true,
		});

		actions.push({
			label: t('grid.action.mergeUser'),
			icon: 'MergeUser',
			name: Actions.USER_ACCESS_MERGE_USER,
		});

		return actions;
	}

	function sendEmail(userId, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.settings.user.UserGridHandler',
			op: 'edit-email',
			params: {
				rowId: userId,
			},
		});

		openLegacyModal({title: t('grid.user.email')}, finishedCallback);
	}

	function disableUser(userId, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.settings.user.UserGridHandler',
			op: 'edit-disable-user',
			params: {
				rowId: userId,
			},
		});

		openLegacyModal({title: t('grid.user.disable')}, (closeData) => {
			if (closeData.dataChanged[0]) {
				console.log(closeData.dataChanged[0]);
				finishedCallback();
			} else {
				finishedCallback();
			}
		});
	}

	const {openDialog, openDialogNetworkError} = useModal();

	function removeUser(userId, finishedCallback) {
		const {url} = useLegacyGridUrl({
			component: 'grid.settings.user.UserGridHandler',
			op: 'remove-user',
			params: {
				rowId: userId,
			},
		});
		openDialog(
			{
				title: t('common.remove'),
				message: t('manager.people.confirmRemove'),
				actions: [
					{
						label: t('common.ok'),
						isPrimary: true,
						callback: async (close) => {
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
						isWarnable: true,
						callback: (close) => {
							close();
						},
					},
				],
			},
			finishedCallback,
		);
	}

	function loginAs(userId) {
		const {redirectToPage} = useUrl(`login/signInAsUser/${userId}`);
		openDialog({
			title: t('grid.action.logInAs'),
			message: t('grid.user.confirmLogInAs'),
			actions: [
				{
					label: t('common.ok'),
					isPrimary: true,
					callback: async (close) => {
						redirectToPage();
						close();
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
		});
	}

	function mergeUser(userId, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.settings.user.UserGridHandler',
			op: 'merge-users',
			params: {
				oldUserId: userId,
			},
		});

		openLegacyModal({title: t('grid.action.mergeUser')}, finishedCallback);
	}

	return {
		disableUser,
		sendEmail,
		loginAs,
		removeUser,
		mergeUser,
		getItemActions,
	};
}
