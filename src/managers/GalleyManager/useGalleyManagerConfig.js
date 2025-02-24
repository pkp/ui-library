import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';
import {Actions} from './useGalleyManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';

export const GalleyManagerConfiguration = {
	permissions: [
		{
			roles: [pkp.const.ROLE_ID_AUTHOR],
			actions: [Actions.GALLEY_LIST],
		},
		{
			roles: [
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_ASSISTANT,
			],
			actions: [
				Actions.GALLEY_LIST,
				Actions.GALLEY_ADD,
				Actions.GALLEY_CHANGE_FILE,
				Actions.GALLEY_DELETE,
				Actions.GALLEY_EDIT,
				Actions.GALLEY_SORT,
			],
		},
	],
	actions: [
		Actions.GALLEY_LIST,
		Actions.GALLEY_ADD,
		Actions.GALLEY_CHANGE_FILE,
		Actions.GALLEY_DELETE,
		Actions.GALLEY_EDIT,
		Actions.GALLEY_SORT,
	],
	actionsRequiresUnpublishedState: [
		Actions.GALLEY_ADD,
		Actions.GALLEY_CHANGE_FILE,
		Actions.GALLEY_DELETE,
		Actions.GALLEY_SORT,
	],
};

export function useGalleyManagerConfig() {
	const {t} = useLocalize();
	const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

	const {isOPS} = useApp();
	function getGalleyGridComponent() {
		if (isOPS()) {
			return 'grid.preprintGalleys.PreprintGalleyGridHandler';
		} else {
			return 'grid.articleGalleys.ArticleGalleyGridHandler';
		}
	}

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('common.name'),
			component: 'GalleyManagerCellName',
			props: {},
		});

		columns.push({
			header: t('common.language'),

			component: 'GalleyManagerCellLanguage',
			props: {},
		});

		columns.push({
			header: t('common.moreActions'),
			headerSrOnly: true,
			component: 'GalleyManagerCellActions',
			props: {},
		});

		return columns;
	}

	function getManagerConfig({submission, publication}) {
		const permittedActions = GalleyManagerConfiguration.actions
			.filter((action) => {
				if (
					publication.value.status === pkp.const.STATUS_PUBLISHED &&
					GalleyManagerConfiguration.actionsRequiresUnpublishedState.includes(
						action,
					)
				) {
					return false;
				}

				return true;
			})
			.filter((action) => {
				return GalleyManagerConfiguration.permissions.some((perm) => {
					return (
						perm.actions.includes(action) &&
						hasCurrentUserAtLeastOneAssignedRoleInStage(
							submission.value,
							pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
							perm.roles,
						)
					);
				});
			});
		return {permittedActions};
	}

	function getBottomItems({config}) {
		const actions = [];

		if (config.permittedActions.includes(Actions.GALLEY_ADD)) {
			actions.push({
				component: 'GalleyManagerActionButton',
				props: {label: t('grid.action.addGalley'), action: Actions.GALLEY_ADD},
				isLink: true,
			});
		}

		return actions;
	}

	function getTopItems({config, galleys}) {
		const actions = [];

		if (
			config.permittedActions.includes(Actions.GALLEY_SORT) &&
			galleys.value.length
		) {
			actions.push({component: 'GalleyManagerSortButton'});
		}
		return actions;
	}

	function getItemActions({config, publication}) {
		const actions = [];

		if (config.permittedActions.includes(Actions.GALLEY_EDIT)) {
			const label =
				publication.status === pkp.const.STATUS_PUBLISHED
					? t('common.view')
					: t('common.edit');

			const icon =
				publication.status === pkp.const.STATUS_PUBLISHED ? 'View' : 'Edit';

			actions.push({
				label,
				name: Actions.GALLEY_EDIT,
				icon,
			});
		}

		if (config.permittedActions.includes(Actions.GALLEY_CHANGE_FILE)) {
			actions.push({
				label: t('submission.changeFile'),
				name: Actions.GALLEY_CHANGE_FILE,
				icon: 'New',
			});
		}

		if (config.permittedActions.includes(Actions.GALLEY_DELETE)) {
			actions.push({
				label: t('common.delete'),
				name: Actions.GALLEY_DELETE,
				icon: 'Cancel',
				isWarnable: true,
			});
		}

		return actions;
	}

	return {
		getColumns,
		getItemActions,
		getBottomItems,
		getTopItems,
		getGalleyGridComponent,
		getManagerConfig,
	};
}
