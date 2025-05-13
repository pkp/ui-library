import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import {Actions} from './useCitationManagerActions';
import _dummyComponent from './_dummyComponent.vue';

export function useCitationManagerConfig() {
	const {t} = useLocalize();
	const {formatShortDate} = useDate();

	function getColumns(submission, publication) {
		const columns = [];

		const props = {submission, publication};

		columns.push({
			header: t('submission.citations.structured'),
			component: '_dummyComponent',
			props,
		});

		columns.push({
			header: t('submission.citations.structured.expandAll'),
			component: '_dummyComponent',
			props,
		});

		columns.push({
			header: t('grid.columns.actions'),
			component: '_dummyComponent',
			props,
		});

		return columns;
	}

	function getTopItems() {
		const items = [];

		items.push({
			component: '_dummyComponent',
			props: {
				label: t('submission.citations.structured.expandAll'),
				action: Actions.CITATION_TOGGLE_ALL_CITATION,
			},
		});

		return items;
	}

	function getItemPrimaryActions() {
		const actions = [];

		actions.push({
			label: t('common.edit'),
			name: Actions.CITATION_EDIT_CITATION,
			icon: 'Edit',
		});

		return actions;
	}

	function getItemActions({}) {
		const actions = [];

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
