import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed, ref, watch} from 'vue';
import {useModal} from '@/composables/useModal';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useLocalize} from '@/composables/useLocalize';
import {useUserCommentsConfig} from '@/pages/userComments/useUserCommentsConfig';
import {useExtender} from '@/composables/useExtender';

import UserCommentDetailModal from '@/pages/userComments/UserCommentDetailModal.vue';
import UserCommentReportDetailModal from '@/pages/userComments/UserCommentReportDetailModal.vue';
const {t} = useLocalize();

const CommentStatusMap = {
	approved: t('manager.userComment.approved'),
	needsApproval: t('manager.userComment.hiddenOrNeedsApproval'),
	reported: t('manager.userComment.reported'),
	all: t('manager.userComment.all'),
};

export const useUserCommentStore = defineComponentStore(
	'userCommentStore',
	(props) => {
		const extender = useExtender();
		const userCommentsConfig = extender.addFns(useUserCommentsConfig());

		const activeTab = ref('all');
		const itemsPerPage = props.itemsPerPage;
		const currentCommentReportsPage = ref(1);
		const currentCommentsPage = ref(1);
		const currentComment = ref({});
		const {apiUrl} = useUrl('comments');

		// Used to track the last paginated page visited for comments of given status.
		const trackedCommentPaginationPageHistory = ref({});

		const commentsTableColumns = computed(() =>
			userCommentsConfig.getCommentsTableColumns(),
		);

		const reportsTableColumns = computed(() =>
			userCommentsConfig.getReportsTableColumns(),
		);

		const commentsUrl = computed(() => {
			let queryParams = '';

			if (activeTab.value === 'approved') {
				queryParams += `?isApproved=${true}`;
			} else if (activeTab.value === 'needsApproval') {
				queryParams += `?isApproved=${false}`;
			} else if (activeTab.value === 'reported') {
				queryParams += `?isReported=${true}`;
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
			fetch: _fetchComments,
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
			const {openDialog, closeSideModal, isSideModalOpened} = useModal();

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

								if (isSideModalOpened(UserCommentReportDetailModal)) {
									closeSideModal(UserCommentReportDetailModal);
								} else {
									await fetchCommentReports();
								}
							}

							close();
						},
					},
					{
						label: t('common.cancel'),
						callback: (close) => close(),
					},
				],
			});
		}

		/**
		 * Toggle the approval status of a comment.
		 * @param {boolean} isApproved - Whether the comment is approved or not.
		 */
		async function commentToggleApproval(isApproved) {
			// Don't proceed if the current comment is already in the desired approval state.
			if (currentComment.value.isApproved === isApproved) {
				return;
			}

			const {isSuccess, fetch} = useFetch(
				`${apiUrl.value}/${currentComment.value.id}/setApproval`,
				{
					method: 'PUT',
					body: {
						approved: isApproved,
					},
				},
			);

			await fetch();

			if (isSuccess.value) {
				pkp.eventBus.$emit(
					'notify',
					t('manager.userComment.commentUpdated'),
					'success',
				);

				const {closeSideModal} = useModal();
				closeSideModal(UserCommentDetailModal);
			}
		}

		/**
		 * Fetches the comments.
		 */
		async function fetchComments() {
			await _fetchComments();
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
		 * Get the actions available for a comment.
		 * @returns {[{label: string, icon: string, name: string, isWarnable?: boolean}]}
		 */
		function getCommentItemActions({comment}) {
			return userCommentsConfig.getCommentItemActions({comment});
		}

		/**
		 * Get the actions available for a report.
		 * @returns {[{label: string, icon: string, name: string, isWarnable?: boolean}]}
		 */
		function getReportItemActions({report}) {
			return userCommentsConfig.getReportItemActions({report});
		}

		/**
		 * Set the current page for the comment reports table.
		 * @param {number} _currentPage - The page number to set as current.
		 */
		function setCurrentReportsPage(_currentPage) {
			currentCommentReportsPage.value = _currentPage;
		}

		/**
		 * Set the current page for the comments table.
		 * @param {number} _currentPage - The page number to set as current.
		 */
		function setCurrentCommentsPage(_currentPage) {
			currentCommentsPage.value = _currentPage;
		}

		/**
		 * Set the current comment to be displayed in the UserCommentDetail modal.
		 * @param {object} comment - The comment to set as current.
		 */
		function setCurrentComment(comment) {
			currentComment.value = comment;
		}

		/**
		 * Open the comment detail modal for a specific comment.
		 * @param {object} comment - The comment to open in detail view.
		 */
		function commentView(comment) {
			setCurrentComment(comment);
			const {openSideModal} = useModal();

			openSideModal(
				UserCommentDetailModal,
				{},
				{
					onClose: async () => {
						await fetchComments();
					},
				},
			);
		}

		/**
		 * Handle the change of the tab selection for comment status.
		 * @param {string} tabId - The selected tab ID.
		 */
		function onTabUpdate(tabId) {
			// Track the current page for each comment table.
			// This is useful when the user is switching between tables for different comments(approved, reported, needs approval).
			// Instead of always starting from page 1 of the paginated table, we start from the last visited page for that comment table, defaulting to page 1 if there is no previous history.
			const pageToStartFrom =
				trackedCommentPaginationPageHistory.value[tabId] ?? 1;

			trackedCommentPaginationPageHistory.value[activeTab.value] =
				currentCommentsPage.value;
			activeTab.value = tabId;

			setCurrentCommentsPage(pageToStartFrom);
		}

		/**
		 * Delete a comment.
		 * @param {object} comment - The comment to delete.
		 */
		function commentDelete(comment) {
			const {openDialog, closeSideModal, isSideModalOpened} = useModal();
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

								/**
								 * Comments can be deleted from the actions options in comments list or from the comment detail modal.
								 * If the comment was deleted from the modal, then we don't need to call `fetchComments`, as closure of the modal triggers refresh of the comments list.
								 */
								if (isSideModalOpened(UserCommentDetailModal)) {
									closeSideModal(UserCommentDetailModal);
								} else {
									await fetchComments();
								}
							}

							close();
						},
					},
					{
						label: t('common.cancel'),
						callback: (close) => close(),
					},
				],
			});
		}

		const commentTabOptions = computed(() =>
			userCommentsConfig.getCommentTabOptions(),
		);

		/**
		 * Open the report detail modal for a specific report.
		 * @param {object} report - The report to open in detail view.
		 */
		function reportView(report) {
			const {openSideModal} = useModal();
			openSideModal(
				UserCommentReportDetailModal,
				{
					report,
				},
				{
					onClose: async () => await fetchCommentReports(),
				},
			);
		}

		/**
		 * Get the status text for a comment.
		 * @param comment - The comment to get the status text for.
		 * @returns {string}
		 */
		function getCommentStatusText(comment) {
			let status = [];

			// If user is viewing all comments then show all statuses that the comment has.
			if (activeTab.value === 'all') {
				if (comment.isApproved) {
					status.push(t('manager.userComment.approved'));
				} else {
					status.push(t('manager.userComment.hiddenOrNeedsApproval'));
				}
				if (comment.isReported) {
					status.push(t('manager.userComment.reported'));
				}

				status = status.join(t('common.commaListSeparator'));
			} else {
				status = CommentStatusMap[activeTab.value];
			}

			return status;
		}

		return {
			reportDelete,
			commentToggleApproval,
			getCommentItemActions,
			setCurrentCommentsPage,
			commentDelete,
			getReportItemActions,
			setCurrentReportsPage,
			reportView,
			getCommentStatusText,
			onTabUpdate,
			commentView,
			itemsPerPage,
			commentsTableColumns,
			comments,
			currentComment,
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
