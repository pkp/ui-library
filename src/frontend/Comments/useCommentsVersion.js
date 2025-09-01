import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {ref, reactive, computed} from 'vue';
import {useUrl} from '@/frontend/composables/usePkpUrl';
import {usePkpModal} from '@/frontend/composables/usePkpModal';
import {usePkpFetch} from '@/frontend/composables/usePkpFetch';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

export function useCommentsVersion({
	publicationId,
	itemsPerPage,
	totalPublicationComments,
	isLatestPublication,
}) {
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
		const {apiUrl} = useUrl(`comments/public?publicationIds=${publicationId}`);

		currentPage.value = refresh ? 1 : currentPage.value + 1;
		const {items, pagination, fetch} = useFetchPaginated(apiUrl, {
			currentPage,
			pageSize: itemsPerPage,
		});

		await fetch();

		comments.value = refresh
			? items.value
			: [...comments.value, ...items.value];

		pageCount.value = pagination.value.pageCount;

		showMoreCommentsCount.value =
			totalPublicationComments -
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
		const actions = [];

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

	return reactive({
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
	});
}
