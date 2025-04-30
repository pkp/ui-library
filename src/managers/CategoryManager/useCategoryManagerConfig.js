import {useLocalize} from '@/composables/useLocalize';

const Actions = {
	CATEGORY_EDIT: 'categoryEdit',
	CATEGORY_ADD: 'categoryAdd',
	CATEGORY_DELETE: 'categoryDelete',
};
export function useCategoryManagerConfig() {
	const {t} = useLocalize();

	/**
	 * Get the columns to display in the category table.
	 * @param category
	 * @returns {Array<{ header: string, component: string, headerSrOnly?: boolean, props: object}>}
	 */
	function getColumns(category) {
		const columns = [];

		columns.push({
			header: t('grid.category.categoryName'),
			component: 'CategoryManagerCellName',
			props: {},
		});

		columns.push({
			header: t('manager.category.assignedTo'),
			component: 'CategoryManagerCellAssignedTo',
			props: {},
		});
		columns.push({
			header: t('common.moreActions'),
			component: 'CategoryManagerCellMoreActions',
			headerSrOnly: true,
			props: {},
		});
		return columns;
	}

	/**
	 * Get the actions available for a category item.
	 * @return {Array<{ label: string, icon: string, name: string, isWarnable?: boolean}>} - The list of actions available for the category item.
	 */
	function getItemActions({category}) {
		const actions = [
			{
				label: t('common.add'),
				icon: 'Add',
				name: Actions.CATEGORY_ADD,
			},
			{
				label: t('common.edit'),
				icon: 'Edit',
				name: Actions.CATEGORY_EDIT,
			},
			{
				label: t('manager.category.deleteCategory'),
				icon: 'Cancel',
				name: Actions.CATEGORY_DELETE,
				isWarnable: true,
			},
		];

		return actions;
	}
	return {
		getColumns,
		getItemActions,
	};
}
