import {useLocalize} from '@/composables/useLocalize';

const Actions = {
	COMMENT_VIEW: 'commentView',
	COMMENT_DELETE: 'commentDelete',
	REPORT_DELETE: 'reportDelete',
	REPORT_VIEW: 'reportView',
};

export function useUserCommentsConfig() {
	const {t} = useLocalize();

	/**
	 * Get the columns to display in the comments table.
	 */
	function getCommentsTableColumns() {
		return [
			{
				header: t('submission.submission'),
				headerSrOnly: false,
			},
			{
				header: t('manager.userComment.comment'),
				headerSrOnly: false,
			},
			{
				header: t('common.user'),
				headerSrOnly: false,
			},
			{
				header: t('common.status'),
				headerSrOnly: false,
			},
			{
				header: t('grid.columns.actions'),
				headerSrOnly: true,
			},
		];
	}

	/**
	 * Get the columns to display in the reports table.
	 */
	function getReportsTableColumns() {
		return [
			{
				header: t('manager.userComment.reportedBy'),
				headerSrOnly: false,
			},
			{
				header: t('manager.userComment.report.reason'),
				headerSrOnly: false,
			},
			{
				header: t('manager.userComment.dateReported'),
				headerSrOnly: false,
			},
			{
				header: t('grid.columns.actions'),
				headerSrOnly: true,
			},
		];
	}

	/**
	 * Get the actions available for a comment.
	 * @returns {[{label: string, icon: string, name: string, isWarnable?: boolean}]}
	 */
	function getCommentItemActions({comment}) {
		const actions = [
			{
				label: t('manager.userComment.viewComment'),
				icon: 'View',
				name: Actions.COMMENT_VIEW,
			},
			{
				label: t('manager.userComment.deleteComment'),
				icon: 'Cancel',
				name: Actions.COMMENT_DELETE,
				isWarnable: true,
			},
		];

		return actions;
	}

	/**
	 * Get the actions available for a report.
	 * @returns {[{label: string, icon: string, name: string, isWarnable?: boolean}]}
	 */
	function getReportItemActions({report}) {
		return [
			{
				label: t('manager.userComment.viewReport'),
				icon: 'View',
				name: Actions.REPORT_VIEW,
			},
			{
				label: t('manager.userComment.deleteReport'),
				icon: 'Cancel',
				name: Actions.REPORT_DELETE,
				isWarnable: true,
			},
		];
	}

	/**
	 * Get the options for comment types(approved, needs approval, reported), to select from to view comments
	 * @returns {[{label: string, id: string}]}
	 */
	function getCommentTabOptions() {
		return [
			{
				label: t('manager.userComment.all'),
				id: 'all',
			},
			{
				label: t('manager.userComment.approved'),
				id: 'approved',
			},
			{
				label: t('manager.userComment.hiddenOrNeedsApproval'),
				id: 'needsApproval',
			},
			{
				label: t('manager.userComment.reported'),
				id: 'reported',
			},
		];
	}

	return {
		getCommentsTableColumns,
		getReportsTableColumns,
		getCommentItemActions,
		getReportItemActions,
		getCommentTabOptions,
	};
}
