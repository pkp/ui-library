import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useCitationManagerActions';

export function useCitationManagerConfig() {
	const {t} = useLocalize();

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('submission.citations.structured'),
			component: 'CitationManagerCellCitation',
			props: {},
		});

		columns.push({
			header: 'CitationManagerToggleAll',
			component: 'CitationManagerCellToggle',
			props: {},
			isHeaderComponent: true,
		});

		columns.push({
			header: '',
			component: 'CitationManagerCellActions',
			props: {},
		});

		return columns;
	}

	function getTopItems() {
		const items = [];

		items.push({
			component: 'CitationManagerSearchField',
			props: {
				label: t('submission.citations.structured.expandAll'),
				action: '',
			},
		});

		return items;
	}

	function getItemActions({citation, store}) {
		const actions = [];

		actions.push({
			label: t('common.edit'),
			name: Actions.CITATION_EDIT_CITATION,
			icon: 'Edit',
		});

		actions.push({
			label: t('common.delete'),
			name: Actions.CITATION_DELETE_CITATION,
			icon: 'Cancel',
			isWarnable: true,
		});

		if (store.citationsMetadataLookup.value) {
			if (!citation.isStructured) {
				actions.push({
					label: t('admin.citation.reprocess'),
					name: Actions.CITATION_REPROCESS_CITATION,
					icon: 'Add',
				});
			}
		}

		return actions;
	}

	return {
		getColumns,
		getTopItems,
		getItemActions,
	};
}
