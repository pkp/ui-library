import {useLocalize} from '@/composables/useLocalize';
import {DashboardPageTypes} from '../dashboardPageStore';

export function useDashboardConfig() {
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
				component: 'DashboardCellReviewAssignmentId',
				sortable: true,
			});

			columns.push({
				id: 'title',
				header: t('navigation.submissions'),
				component: 'DashboardCellReviewAssignmentTitle',
				sortable: false,
			});

			columns.push({
				id: 'activity',
				header: t('stats.editorialActivity'),
				component: 'DashboardCellReviewAssignmentActivity',
				sortable: false,
			});

			columns.push({
				id: 'actions',
				header: t('admin.jobs.list.actions'),
				component: 'DashboardCellReviewAssignmentActions',
				sortable: false,
			});
		} else if (dashboardPage === DashboardPageTypes.MY_SUBMISSIONS) {
			columns.push({
				id: 'id',
				header: t('common.id'),
				component: 'DashboardCellSubmissionId',
				sortable: true,
			});

			columns.push({
				id: 'title',
				header: t('navigation.submissions'),
				component: 'DashboardCellSubmissionTitle',
				sortable: false,
			});

			columns.push({
				id: 'stage',
				header: t('workflow.stage'),
				component: 'DashboardCellSubmissionStage',
				sortable: false,
			});

			columns.push({
				id: 'activity',
				header: t('stats.editorialActivity'),
				component: 'DashboardCellSubmissionActivity',
				sortable: false,
			});

			columns.push({
				id: 'actions',
				header: t('admin.jobs.list.actions'),
				component: 'DashboardCellSubmissionActions',
				sortable: false,
			});
		} else {
			columns.push({
				id: 'id',
				header: t('common.id'),
				component: 'DashboardCellSubmissionId',
				sortable: true,
			});

			columns.push({
				id: 'title',
				header: t('navigation.submissions'),
				component: 'DashboardCellSubmissionTitle',
				sortable: false,
			});

			columns.push({
				id: 'stage',
				header: t('workflow.stage'),
				component: 'DashboardCellSubmissionStage',
				sortable: false,
			});

			columns.push({
				id: 'lastActivity',
				header: t('editor.submission.days'),
				component: 'DashboardCellSubmissionDays',
				sortable: true,
			});

			columns.push({
				id: 'activity',
				header: t('stats.editorialActivity'),
				component: 'DashboardCellSubmissionActivity',
				sortable: false,
			});

			columns.push({
				id: 'actions',
				header: t('admin.jobs.list.actions'),
				component: 'DashboardCellSubmissionActions',
				sortable: false,
			});
		}

		return columns;
	}

	return {getLeftControls, getRightControls, getColumns};
}
