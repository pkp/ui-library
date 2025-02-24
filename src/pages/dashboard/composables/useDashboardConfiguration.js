import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '../dashboardPageStore';

export function useDashboardConfiguration() {
	const {t} = useLocalize();

	function getLeftControls() {
		const items = [];

		items.push({
			component: 'DashboardActionButton',
			props: {label: t('common.filter'), action: 'openFiltersModal'},
		});

		items.push({
			component: 'DashboardControlBulkActions',
			props: {},
		});

		items.push({
			component: 'DashboardControlBulkDeleteButton',
			props: {},
		});

		return items;
	}
	function getRightControls() {
		const items = [];

		items.push({component: 'DashboardControlSearch', props: {}});

		return items;
	}

	function getColumns({dashboardPage}) {
		const columns = [];
		if (dashboardPage === DashboardPageTypes.MY_REVIEW_ASSIGNMENTS) {
			columns.push({
				id: 'id',
				header: t('common.id'),
				component: 'CellReviewAssignmentId',
				sortable: true,
			});

			columns.push({
				id: 'title',
				header: t('navigation.submissions'),
				component: 'CellReviewAssignmentTitle',
				sortable: false,
			});

			columns.push({
				id: 'activity',
				header: t('stats.editorialActivity'),
				component: 'CellReviewAssignmentActivity',
				sortable: false,
			});

			columns.push({
				id: 'actions',
				header: t('admin.jobs.list.actions'),
				component: 'CellReviewAssignmentActions',
				sortable: false,
			});
		} else if (dashboardPage === DashboardPageTypes.MY_SUBMISSIONS) {
			columns.push({
				id: 'id',
				header: t('common.id'),
				component: 'CellSubmissionId',
				sortable: true,
			});

			columns.push({
				id: 'title',
				header: t('navigation.submissions'),
				component: 'CellSubmissionTitle',
				sortable: false,
			});

			columns.push({
				id: 'stage',
				header: t('workflow.stage'),
				component: 'CellSubmissionStage',
				sortable: false,
			});

			columns.push({
				id: 'activity',
				header: t('stats.editorialActivity'),
				component: 'CellSubmissionActivity',
				sortable: false,
			});

			columns.push({
				id: 'actions',
				header: t('admin.jobs.list.actions'),
				component: 'CellSubmissionActions',
				sortable: false,
			});
		} else {
			columns.push({
				id: 'id',
				header: t('common.id'),
				component: 'CellSubmissionId',
				sortable: true,
			});

			columns.push({
				id: 'title',
				header: t('navigation.submissions'),
				component: 'CellSubmissionTitle',
				sortable: false,
			});

			columns.push({
				id: 'stage',
				header: t('workflow.stage'),
				component: 'CellSubmissionStage',
				sortable: false,
			});

			columns.push({
				id: 'lastActivity',
				header: t('editor.submission.days'),
				component: 'CellSubmissionDays',
				sortable: true,
			});

			columns.push({
				id: 'activity',
				header: t('stats.editorialActivity'),
				component: 'CellSubmissionActivity',
				sortable: false,
			});

			columns.push({
				id: 'actions',
				header: t('admin.jobs.list.actions'),
				component: 'CellSubmissionActions',
				sortable: false,
			});
		}

		return columns;
	}

	return {getLeftControls, getRightControls, getColumns};
}
