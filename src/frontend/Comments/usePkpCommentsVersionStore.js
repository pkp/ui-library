import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {ref, computed} from 'vue';
import {useUrl} from '@/frontend/composables/usePkpUrl';
import {usePkpModal} from '@/frontend/composables/usePkpModal';
import {usePkpFetch} from '@/frontend/composables/usePkpFetch';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {usePkpCommentsStore} from './usePkpCommentsStore';
export const usePkpCommentsVersionStore = defineComponentStore(
	'commentsVersion',
	({publicationId}) => {
		const commentsStore = usePkpCommentsStore();
		const isLatestPublication =
			publicationId === commentsStore.latestPublicationId;

		const {t} = usePkpLocalize();

		let comments = ref([]);
		const showMoreCommentsCount = ref(0);
		const currentPage = ref(0);
		const pageCount = ref(0);
		const commentText = ref('');

		/* * Updates the comment text.
		 * @param value
		 */
		function updateCommentText(value) {
			commentText.value = value;
		}

		const hasMoreComments = computed(() => pageCount.value > currentPage.value);

		/**
		 * Loads more comments for publication.
		 * @param refresh - Whether to refresh the comments list or append to it. When true, this will refresh the list with the first page of comments.
		 */
		async function loadComments(refresh = false) {
			const {apiUrl} = useUrl(
				`comments/public?publicationIds=${publicationId}`,
			);

			currentPage.value = refresh ? 1 : currentPage.value + 1;
			const {items, pagination, fetch} = useFetchPaginated(apiUrl, {
				currentPage,
				pageSize: commentsStore.itemsPerPage,
			});

			await fetch();

			comments.value = refresh
				? items.value
				: [...comments.value, ...items.value];

			pageCount.value = pagination.value.pageCount;

			showMoreCommentsCount.value =
				commentsStore.totalPublicationComments -
				comments.value.filter((c) => c.isApproved).length;
		}

		const currentUser = pkp.currentUser;

		/**
		 * Creates a new comment for the publication.
		 */
		async function commentAdd() {
			if (!isLatestPublication || !currentUser || !commentText.value.trim()) {
				return;
			}

			const {openDialogNetworkError} = usePkpModal();
			const {apiUrl} = useUrl('comments');

			const {fetch: submitComment, isSuccess} = usePkpFetch(apiUrl, {
				method: 'POST',
				body: {
					publicationId: publicationId,
					commentText: commentText.value,
				},
			});

			await submitComment();

			if (isSuccess.value) {
				commentText.value = '';
				await loadComments(true);
			} else {
				openDialogNetworkError();
			}
		}

		/**
		 * Returns the actions available for a comment.
		 * @param comment
		 * @returns {Array<{label: string, name: string, disabled?: boolean}>} - An array of available actions */
		function getCommentActions(comment) {
			console.log('getCommentActions');
			const actions = [];

			console.log('getCommentActions:', currentUser.id, comment.userId);
			if (currentUser && currentUser.id !== comment.userId) {
				actions.push({
					label: t('userComment.report'),
					name: 'commentReport',
				});
			}

			if (currentUser && currentUser.id === comment.userId) {
				actions.push({
					label: t('userComment.deleteComment'),
					name: 'commentDelete',
				});
			}

			return actions;
		}

		/**
		 * Deletes a comment.
		 * @param comment - The comment to be deleted.
		 */
		function commentDelete(comment) {
			if (!currentUser || currentUser.id !== comment.userId) {
				throw new Error('Only the comment author can delete the comment');
			}

			const {openDialog, openDialogNetworkError} = usePkpModal();
			console.log('wtf', t);
			console.log('delete comment:', t('userComment.deleteComment'));
			openDialog({
				title: t('userComment.deleteComment'),
				message: t('userComment.deleteCommentConfirmation', {
					comment: comment.commentText,
				}),
				modalStyle: 'negative',
				actions: [
					{
						label: t('common.delete'),
						callback: async (close) => {
							const {apiUrl} = useUrl(`comments/${comment.id}`);
							const {fetch: deleteComment, isSuccess} = usePkpFetch(apiUrl, {
								method: 'DELETE',
							});
							await deleteComment();
							if (isSuccess.value) {
								// Remove the comment from the list
								comments.value = comments.value.filter(
									(c) => c.id !== comment.id,
								);
							} else {
								openDialogNetworkError();
							}

							close();
						},
					},
					{
						label: t('common.cancel'),
						isSecondary: true,
						callback: (close) => close(),
					},
				],
			});
		}

		/**
		 * Reports a comment.
		 * @param comment - The comment to be reported.
		 */
		const reportText = ref('');
		function commentReport(comment) {
			const {openDialog} = usePkpModal();
			reportText.value = '';
			openDialog({
				title: t('userComment.reportComment'),
				comment,
				bodyComponent: pkp.registry.getComponent('PkpCommentReportDialog'),
				bodyProps: {
					comment,
					reportText: reportText,
					'onUpdate:reportText': (value) => {
						reportText.value = value;
					},
				},
				actions: [
					{
						label: t('form.submit'),
						isPrimary: true,
						callback: async (close) => {
							await performCommentReport(comment, reportText.value);
							close();
						},
					},
					{
						label: t('common.cancel'),
						isSecondary: true,
						callback: (close) => close(),
					},
				],
			});
		}

		/**
		 * Performs the comment report action.
		 * @param comment - The comment to be reported.
		 * @param reportText - The text of the report.
		 */
		async function performCommentReport(comment, reportText) {
			if (!currentUser || !reportText.trim()) {
				return;
			}

			const commentId = comment.id;
			const {apiUrl} = useUrl(`comments/${commentId}/reports`);
			const {closeTopDialog} = usePkpModal();

			const {fetch: postReport, isSuccess} = usePkpFetch(apiUrl, {
				method: 'POST',
				body: {
					note: reportText,
				},
			});

			await postReport();

			if (isSuccess.value) {
				comments.value.forEach((comment) => {
					if (comment.id === commentId) {
						comment.isReported = true;
					}
				});
			}
			closeTopDialog();
		}

		const versionLabel = computed(() => {
			return t('userComment.versionWithCount', {
				version: publicationId,
				versionCommentsCount: commentsStore.totalPublicationComments || 0,
			});
		});

		/**
		 * Redirects the user to the login page.
		 */
		function login() {
			window.location = commentsStore.loginUrl;
		}

		loadComments();
		return {
			versionLabel,
			isLatestPublication,
			currentUser,
			comments,
			showMoreCommentsCount,
			currentPage,
			commentText,
			hasMoreComments,
			updateCommentText,
			loadComments,
			commentAdd,
			getCommentActions,
			commentDelete,
			commentReport,
			login,
		};
	},
	{requireNamespace: true},
);
