import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';
import {Actions} from './useGalleyManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';
import {computed} from 'vue';

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

export function useGalleyManagerConfiguration({submission, publication}) {
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

	const config = computed(() => {
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
	});

	return {getColumns, getGalleyGridComponent, config};
}
