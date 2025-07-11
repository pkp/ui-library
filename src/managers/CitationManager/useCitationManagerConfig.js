import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useCitationManagerActions';

export function useCitationManagerConfig() {
	const {t} = useLocalize();

	function getColumns(submission, publication) {
		const columns = [];

		const props = {submission, publication};

		columns.push({
			header: t('submission.citations.structured'),
			component: 'CitationManagerCellCitation',
			props,
		});

		columns.push({
			header: t('submission.citations.structured.expandAll'),
			component: 'CitationManagerCellToggle',
			props,
		});

		columns.push({
			header: t('grid.columns.actions'),
			component: 'CitationManagerCellPrimaryActions',
			props,
		});

		return columns;
	}

	function getTopItems() {
		const items = [];

		items.push({
			component: 'CitationManagerSearchField',
			props: {
				label: t('submission.citations.structured.expandAll'),
				action: Actions.CITATION_SEARCH_CITATION,
			},
		});

		return items;
	}

	function getItemActions({}) {
		const actions = [];

		return actions;
	}

	function getItemPrimaryActions() {
		const actions = [];

		actions.push({
			label: t('common.edit'),
			name: Actions.CITATION_EDIT_CITATION,
			icon: 'Edit',
		});

		actions.push({
			label: t('common.delete'),
			name: Actions.CITATION_DELETE_CITATION,
			icon: 'Delete',
		});

		return actions;
	}

	return {
		getTopItems,
		getItemActions,
		getItemPrimaryActions,
		getColumns,
	};
}
