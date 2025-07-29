import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed, ref, watch} from 'vue';
import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useLocalize} from '@/composables/useLocalize';
import UserCommentDetail from '@/pages/userComments/userCommentDetail.vue';
import UserCommentReportDetail from '@/pages/userComments/UserCommentReportDetail.vue';

const Actions = {
	COMMENT_DELETE: 'commentDelete',
	REPORT_DELETE: 'reportDelete',
	COMMENT_PUBLICATION_VIEW: 'commentPublicationView',
};
export const useUserCommentStore = defineComponentStore(
	'userCommentStore',
	(props) => {
		const {t} = useLocalize();

		const activeTab = ref('approved');
		const itemsPerPage = props.itemsPerPage;
		const currentCommentReportsPage = ref(1);
		const currentCommentsPage = ref(1);
		const currentComment = ref(null);
		const {apiUrl} = useUrl('comments');
		const trackedCommentPaginationPageHistory = ref({});

		const commentApprovalOptions = ref([
			{
				label: t('manager.userComment.approveThisComment'),
			},
		]);

		const commentsPageColumns = computed(() => {
			return [
				{
					header: t('manager.userComment.comment'),
					headerSrOnly: false,
				},
				{
					header: t('user.role.author'),
					headerSrOnly: false,
				},
				{
					header: t('common.status'),
					headerSrOnly: false,
				},
				{
					header: t('common.view'),
					headerSrOnly: true,
				},
				{
					header: t('grid.columns.actions'),
					headerSrOnly: true,
				},
			];
		});
		const reportsTableColumns = computed(() => {
			return [
				{
					header: t('manager.userComment.report.reason'),
					headerSrOnly: false,
				},
				{
					header: t('manager.userComment.reportedBy'),
					headerSrOnly: false,
				},
				{
					header: t('manager.userComment.dateReported'),
					headerSrOnly: false,
				},
				{
					header: t('common.view'),
					headerSrOnly: true,
				},
				{
					header: t('grid.columns.actions'),
					headerSrOnly: true,
				},
			];
		});

		const commentsUrl = computed(() => {
			let queryParams = '';
			switch (activeTab.value) {
				case 'approved':
					queryParams += `?isApproved=${true}`;
					break;
				case 'needsApproval':
					queryParams += `?isApproved=${false}`;
					break;
				case 'reported':
					queryParams += `?isReported=${true}`;
					break;
				default:
					queryParams += `?isApproved=${true}`;
			}
			return apiUrl.value + queryParams;
		});

		const reportsUrl = computed(() => {
			return currentComment.value?.id
				? `${apiUrl.value}/${currentComment.value.id}/reports`
				: '';
		});

		const {
			items: comments,
			pagination: commentsPagination,
			isLoading: isCommentsLoading,
			fetch: fetchComments,
		} = useFetchPaginated(commentsUrl, {
			currentPage: currentCommentsPage,
			pageSize: itemsPerPage,
		});

		const {
			items: currentCommentReports,
			pagination: currentCommentReportsPagination,
			fetch: _fetchCommentReports,
		} = useFetchPaginated(reportsUrl, {
			currentPage: currentCommentReportsPage,
			pageSize: itemsPerPage,
		});

		watch(
			[commentsUrl, currentCommentsPage],
			async () => await fetchComments(),
			{
				immediate: true,
			},
		);

		watch(
			[currentCommentReportsPage, reportsUrl],
			async () => await fetchCommentReports(),
		);

		/**
		 * Delete a comment report.
		 * @param {object} report - The report to delete.
		 */
		async function reportDelete(report) {
			const {openDialog} = useModal();

			openDialog({
				title: t('manager.userComment.deleteReport'),
				message: t('manager.userComment.deleteReport.confirm'),
				actions: [
					{
						label: t('common.delete'),
						isWarnable: true,
						callback: async (close) => {
							const {isSuccess, fetch: deleteReport} = useFetch(
								`${apiUrl.value}/${report.userCommentId}/reports/${report.id}`,
								{
									method: 'DELETE',
								},
							);

							await deleteReport();

							if (isSuccess.value) {
								pkp.eventBus.$emit(
									'notify',
									t('manager.userComment.deleteReport.success'),
									'success',
								);
								await fetchCommentReports();
							}

							close();
						},
					},
					{
						label: t('common.cancel'),
						callback: (close) => {
							close();
						},
					},
				],
			});
		}

		/**
		 * Toggle the approval status of a comment.
		 * @param {boolean} isApproved - Whether the comment is approved or not.
		 * @param {object} comment - The comment to toggle approval for.
		 */
		async function toggleCommentApproval(isApproved) {
			const {apiUrl} = useUrl(
				`comments/${currentComment.value.id}/setApproval`,
			);
			const form = new FormData();
			form.set('approved', isApproved);
			const {isSuccess, fetch} = useFetch(apiUrl, {
				method: 'PUT',
				body: form,
			});
			await fetch();

			if (isSuccess.value) {
				pkp.eventBus.$emit(
					'notify',
					t('manager.userComment.commentUpdated'),
					'success',
				);
			}
		}

		/**
		 * Fetches the reports for comment currently selected for detailed view.
		 */
		async function fetchCommentReports() {
			if (reportsUrl.value && currentComment.value?.isReported) {
				await _fetchCommentReports();
			}
		}

		/**
		 * Get the actions available for a comment item.
		 * @param {object} comment - The comment to get actions for.
		 * @returns {[{label: string, icon: string, name: string, isWarnable: boolean}]}
		 */
		function getCommentItemActions(comment) {
			const actions = [
				{
					label: t('manager.userComment.viewPublication'),
					icon: 'View',
					name: Actions.COMMENT_PUBLICATION_VIEW,
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
		 * Get the actions available for a report item.
		 * @param {object} report - The report to get actions for.
		 * @returns {[{label: string, icon: string, name: string, isWarnable: boolean}]}
		 */
		function getReportItemActions(report) {
			return [
				{
					label: t('manager.userComment.deletedReport'),
					icon: 'Cancel',
					name: Actions.REPORT_DELETE,
					isWarnable: true,
				},
			];
		}

		/**
		 * Set the current page for the comment reports table.
		 * @param {number} _currentReportsPage - The page number to set as current.
		 */
		function setCurrentReportsPage(_currentReportsPage) {
			currentCommentReportsPage.value = _currentReportsPage;
		}

		/**
		 * Set the current page for the comments table.
		 * @param {number} _currentPage - The page number to set as current.
		 */
		function setCurrentCommentsPage(_currentPage) {
			currentCommentsPage.value = _currentPage;
		}

		/**
		 * Set the current comment to be displayed in the detail view.
		 * @param {object} comment - The comment to set as current.
		 */
		function setCurrentComment(comment) {
			currentComment.value = comment;
		}

		/**
		 * Open the comment detail modal for a specific comment.
		 * @param {object} comment - The comment to open in detail view.
		 */
		function openCommentDetail(comment) {
			setCurrentComment(comment);
			const {openSideModal} = useModal();
			openSideModal(
				UserCommentDetail,
				{
					comment,
				},
				{
					onClose: async () => await fetchComments(),
				},
			);
		}

		/**
		 * Handle the change of the tab selection for comment status.
		 * @param {string} tabId - The selected tab Id.
		 */
		function onTabUpdate(tabId) {
			// Track the current page for each comment table.
			// This is useful when the user is switching between tables for different comments(approved, reported, needs approval).
			// Instead of always starting from page 1 of the paginated table, we start from the last visited page for that comment table, defaulting to page 1 if there is no previous history.
			const pageToStartFrom = trackedCommentPaginationPageHistory[tabId] ?? 1;
			trackedCommentPaginationPageHistory[activeTab.value] =
				currentCommentsPage.value;
			activeTab.value = tabId;

			setCurrentCommentsPage(pageToStartFrom);
		}

		/**
		 * Delete a comment.
		 * @param {object} comment - The comment to delete.
		 */
		function commentDelete(comment) {
			const {openDialog} = useModal();
			openDialog({
				title: t('manager.userComment.deleteComment'),
				message: t('manager.userComment.deleteComment.confirm'),
				actions: [
					{
						label: t('common.delete'),
						isWarnable: true,
						callback: async (close) => {
							const {isSuccess, fetch} = useFetch(
								`${apiUrl.value}/${comment.id}`,
								{
									method: 'DELETE',
								},
							);
							await fetch();
							if (isSuccess.value) {
								pkp.eventBus.$emit(
									'notify',
									t('manager.userComment.deleteComment.success'),
									'success',
								);
								await fetchComments();
							}

							close();
						},
					},
					{
						label: t('common.cancel'),
						callback: (close) => {
							close();
						},
					},
				],
			});
		}

		/**
		 * Get the options for comment types(approved, needs approval, reported), to select from to view comments
		 */
		const commentTabOptions = computed(() => {
			return [
				{
					label: t('manager.userComment.approved'),
					id: 'approved',
				},
				{
					label: t('manager.userComment.needsApproval'),
					id: 'needsApproval',
				},
				{
					label: t('manager.userComment.reported'),
					id: 'reported',
				},
			];
		});

		/**
		 * Open the report detail modal for a specific report.
		 * @param {object} report - The report to open in detail view.
		 */
		function openReport(report) {
			const {openSideModal} = useModal();
			openSideModal(UserCommentReportDetail, {
				report,
				comment: comments.value.find((c) => c.id === report.userCommentId),
			});
		}

		/**
		 * Get the status text for a comment.
		 * @param comment
		 * @returns {string}
		 */
		function getCommentStatusText(comment) {
			const status = [];
			if (comment.isApproved) {
				status.push(t('manager.userComment.approved'));
			} else {
				status.push(t('manager.userComment.needsApproval'));
			}
			if (comment.isReported) {
				status.push(t('manager.userComment.reported'));
			}
			return status.join(', ');
		}

		/**
		 * Open the publication a given comment was made for.
		 * @param comment
		 */
		function commentPublicationView(comment) {
			window.open(comment.publicationUrl, '_blank');
		}

		return {
			reportDelete,
			toggleCommentApproval,
			getCommentItemActions,
			openCommentDetail,
			setCurrentCommentsPage,
			commentDelete,
			getReportItemActions,
			setCurrentReportsPage,
			openReport,
			getCommentStatusText,
			commentPublicationView,
			onTabUpdate,
			commentApprovalOptions,
			itemsPerPage,
			commentsPageColumns,
			comments,
			commentsPagination,
			currentCommentReports,
			currentCommentReportsPagination,
			reportsTableColumns,
			commentTabOptions,
			isCommentsLoading,
			activeTab,
		};
	},
);
