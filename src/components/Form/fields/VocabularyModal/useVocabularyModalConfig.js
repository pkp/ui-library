import {useLocalize} from '@/composables/useLocalize';

export function useVocabularyModalConfig() {
	const {t} = useLocalize();

	/**
	 * Get the columns to display in the vocabulary modal table
	 *
	 * @returns {Array<{ header: string, component: string, headerSrOnly?: boolean, props?: Object }>}
	 */
	function getColumns() {
		const columns = [];

		columns.push({
			header: t('common.name'),
			component: 'VocabularyModalCellName',
			props: {},
		});

		return columns;
	}

	return {
		getColumns,
	};
}
