import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useUserAccessManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';

export function useUserAccessManagerConfig() {
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
					label: t('grid.user.logInAs'),
					icon: 'LoginAs',
					name: Actions.USER_ACCESS_LOGIN_AS,
				});

			if (user.groups.find((value) => value.dateEnd === null)) {
				actions.push({
					label: t('grid.user.remove'),
					icon: 'Cancel',
					name: Actions.USER_ACCESS_REMOVE_USER,
					isWarnable: true,
				});
			}

			actions.push({
				label: user.disabled ? t('grid.user.enable') : t('grid.user.disable'),
				icon: user.disabled ? 'User' : 'DisableUser',
				name: Actions.USER_ACCESS_DISABLE_USER,
				isWarnable: !user.disabled,
			});

			user.canMergeUsers &&
				actions.push({
					label: t('grid.action.mergeUser'),
					icon: 'MergeUser',
					name: Actions.USER_ACCESS_MERGE_USER,
				});
		}

		return actions;
	}
	/**
	 * User access table columns
	 * @returns array
	 */
	function getColumns() {
		const columns = [];

		columns.push({
			header: t('userAccess.tableHeader.name'),
			component: 'UserAccessManagerCellName',
			props: {},
		});

		columns.push({
			header: t('about.contact.email'),
			component: 'UserAccessManagerCellEmail',
			props: {},
		});

		columns.push({
			header: t('user.roles'),
			component: 'UserAccessManagerCellUserGroups',
			props: {},
		});
		columns.push({
			header: t('userAccess.tableHeader.startDate'),
			component: 'UserAccessManagerCellStartDate',
			props: {},
		});
		columns.push({
			header: t('user.affiliation'),
			component: 'UserAccessManagerCellAffiliation',
			props: {},
		});

		columns.push({
			header: t('common.moreActions'),
			component: 'UserAccessManagerCellActions',
			props: {},
			headerSrOnly: true,
		});

		return columns;
	}

	function getTopItems() {
		const items = [];
		items.push({
			component: 'UserAccessManagerActionSearch',
			props: {},
		});

		return items;
	}

	return {
		getColumns,
		getItemActions,
		// getBottomItems,
		getTopItems,
	};
}
