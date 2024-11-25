import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';

export function useGalleyManagerConfiguration() {
	const {t} = useLocalize();
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

	return {getColumns, getGalleyGridComponent};
}
