import {useLocalize} from '@/composables/useLocalize';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useCurrentUser} from '@/composables/useCurrentUser';

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
	const {getCurrentUserId} = useCurrentUser();

	function getItemActions({user}) {
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

		if (getCurrentUserId() !== user.id) {
			user.canLoginAs &&
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
				label: user.disabled
					? t('grid.action.enable')
					: t('grid.action.disable'),
				icon: 'DisableUser',
				name: Actions.USER_ACCESS_DISABLE_USER,
				isWarnable: true,
			});

			user.canMergeUser &&
				actions.push({
					label: t('grid.action.mergeUser'),
					icon: 'MergeUser',
					name: Actions.USER_ACCESS_MERGE_USER,
				});
		}

		return actions;
	}

	function sendEmail({user}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.settings.user.UserGridHandler',
			op: 'edit-email',
			params: {
				rowId: user.id,
			},
		});

		openLegacyModal({title: t('grid.user.email')}, finishedCallback);
	}

	function disableUser({user}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.settings.user.UserGridHandler',
			op: 'edit-disable-user',
			params: {
				rowId: user.id,
				enable: user.disabled ? '1' : '',
			},
		});

		openLegacyModal({title: t('grid.user.disable')}, (closeData) => {
			finishedCallback();
		});
	}

	const {openDialog, openDialogNetworkError} = useModal();

	function removeUser({user}, finishedCallback) {
		const {url} = useLegacyGridUrl({
			component: 'grid.settings.user.UserGridHandler',
			op: 'remove-user',
			params: {
				rowId: user.id,
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

	function loginAs({user}) {
		const {redirectToPage} = useUrl(`login/signInAsUser/${user.id}`);
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

	function mergeUser({user}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: 'grid.settings.user.UserGridHandler',
			op: 'merge-users',
			params: {
				oldUserId: user.id,
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
