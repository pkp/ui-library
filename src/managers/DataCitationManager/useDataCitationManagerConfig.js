import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useDataCitationManagerActions';

export function useDataCitationManagerConfig() {
	const {t} = useLocalize();

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('submission.dataCitations.title'),
			component: 'DataCitationManagerCellCitation',
		});

		columns.push({
			header: t('common.moreActions'),
			headerSrOnly: true,
			component: 'DataCitationManagerCellActions',
			props: {},
		});

		return columns;
	}

	function getTopItems() {
		const items = [];

		items.push({
			component: 'DataCitationManagerActionButton',
			props: {
				label: t('grid.action.addDataCitation'),
				action: Actions.DATA_CITATION_ADD_DATA_CITATION,
			},
		});

		items.push({
			component: 'DataCitationManagerSortButton',
		});

		return items;
	}

	function getItemActions() {
		const actions = [];

		actions.push({
			label: t('common.edit'),
			name: Actions.DATA_CITATION_EDIT_DATA_CITATION,
			icon: 'Edit',
		});

		actions.push({
			label: t('common.delete'),
			name: Actions.DATA_CITATION_DELETE_DATA_CITATION,
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
