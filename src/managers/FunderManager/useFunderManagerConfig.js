import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useFunderManagerActions';

export function useFunderManagerConfig() {
	const {t} = useLocalize();

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('submission.funders.column.name'),
			component: 'FunderManagerCellFunder',
		});

		columns.push({
			header: t('common.moreActions'),
			headerSrOnly: true,
			component: 'FunderManagerCellActions',
			props: {},
		});

		return columns;
	}

	function getTopItems() {
		const items = [];

		items.push({
			component: 'FunderManagerActionButton',
			props: {
				label: t('submission.funders.action.addFunder'),
				action: Actions.FUNDERS_ADD_FUNDER,
			},
		});

		items.push({
			component: 'FunderManagerSortButton',
		});

		return items;
	}

	function getItemActions() {
		const actions = [];

		actions.push({
			label: t('common.edit'),
			name: Actions.FUNDERS_EDIT_FUNDER,
			icon: 'Edit',
		});

		actions.push({
			label: t('common.delete'),
			name: Actions.FUNDERS_DELETE_FUNDER,
			icon: 'Cancel',
			isWarnable: true,
		});

		return actions;
	}

	return {
		getColumns,
		getTopItems,
		getItemActions,
	};
}
