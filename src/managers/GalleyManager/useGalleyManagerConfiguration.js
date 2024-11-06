import {useLocalize} from '@/composables/useLocalize';

export function useGalleyManagerConfiguration() {
	const {t} = useLocalize();

	function getGalleyGridComponent() {
		if (pkp.context.app === 'ops') {
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
