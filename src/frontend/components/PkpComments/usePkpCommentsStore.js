import {defineStore} from 'pinia';
import {ref, reactive} from 'vue';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useUrl} from '@/frontend/composables/usePkpUrl';
import {usePkpModal} from '@/frontend/composables/usePkpModal';
import {usePkpFetch} from '@/frontend/composables/usePkpFetch';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

export const usePkpCommentsStore = defineStore('pkpComments', () => {
	// Global state
	const publications = ref([]);
	const latestPublicationId = ref(null);
	const itemsPerPage = ref(10);
	const loginUrl = ref('');
	const commentsCountPerPublication = ref({});
	const allCommentsCount = ref(0);

	// Version-specific state stored in a Map
	const versionStates = ref({});

	/**
	 * Initialize the store with global configuration
	 * @param {Object} props - Configuration object
	 * @param {Array<Object>} [props.publications=[]] - Array of publication objects with id and version
	 * @param {number|null} props.latestPublicationId - ID of the latest publication
	 * @param {number} [props.itemsPerPage=10] - Number of items per page
	 * @param {string} props.loginUrl - URL for login redirect
	 * @param {Object} [props.commentsCountPerPublication={}] - Comments count per publication
	 * @param {number} [props.allCommentsCount=0] - Total comments count across all publications
	 */
	function initialize({
		publications: _publications = [],
		latestPublicationId: _latestPublicationId,
		itemsPerPage: _itemsPerPage = 10,
		loginUrl: _loginUrl,
		commentsCountPerPublication: _commentsCountPerPublication = {},
		allCommentsCount: _allCommentsCount = 0,
	}) {
		// Set publications array
		publications.value = _publications || [];

		latestPublicationId.value = _latestPublicationId;
		itemsPerPage.value = _itemsPerPage;
		loginUrl.value = _loginUrl;
		commentsCountPerPublication.value = _commentsCountPerPublication;
		allCommentsCount.value = _allCommentsCount;
	}

	// Get current user (global)
	function getCurrentUser() {
		return pkp.currentUser;
	}

	// Login redirect (global)
	function login() {
		window.location = loginUrl.value;
	}

	// Get or create version-specific state
	function getVersionState(publicationId) {
		if (!versionStates.value[publicationId]) {
			versionStates.value[publicationId] = reactive({
				comments: [],
				showMoreCommentsCount: 0,
				currentPage: 0,
				pageCount: 0,
				commentText: '',
				reportText: '',
			});
		}
		return versionStates.value[publicationId];
	}


	// Get comments for a specific publication
	function getComments(publicationId) {
		return getVersionState(publicationId).comments;
	}

	// Get comment text for a specific publication
	function getCommentText(publicationId) {
		return getVersionState(publicationId).commentText;
	}

	// Update comment text for a specific publication
	function updateCommentText(publicationId, value) {
		getVersionState(publicationId).commentText = value;
	}

	// Get version label for a specific publication
	function getVersionLabel(publicationId) {
		const {t} = usePkpLocalize();
		const commentsInThisVersion =
			commentsCountPerPublication.value[publicationId] || 0;

		// Try to find the publication object to get its version
		const publication = publications.value.find(
			(pub) => pub.id === publicationId,
		);
		const version = publication ? publication.version : publicationId;

		return t('userComment.versionWithCount', {
			version: version,
			versionCommentsCount: commentsInThisVersion,
		});
	}

	// Get publication object by ID
	function getPublication(publicationId) {
		return publications.value.find((pub) => pub.id === publicationId);
	}

	// Check if a publication is the latest
	function isLatestPublication(publicationId) {
		return publicationId === latestPublicationId.value;
	}

	// Check if there are more comments to load
	function hasMoreComments(publicationId) {
		const versionState = getVersionState(publicationId);
		return versionState.pageCount > versionState.currentPage;
	}

	// Load comments for a specific publication
	async function loadComments(publicationId, refresh = false) {
		const versionState = getVersionState(publicationId);
		const {apiUrl} = useUrl(`comments/public?publicationIds=${publicationId}`);

		versionState.currentPage = refresh ? 1 : versionState.currentPage + 1;
		const {items, pagination, fetch} = useFetchPaginated(apiUrl, {
			currentPage: versionState.currentPage,
			pageSize: itemsPerPage.value,
		});

		await fetch();

		versionState.comments = refresh
			? items.value
			: [...versionState.comments, ...items.value];

		versionState.pageCount = pagination.value.pageCount;

		const commentsInThisVersion =
			commentsCountPerPublication.value[publicationId] || 0;
		versionState.showMoreCommentsCount =
			commentsInThisVersion -
			versionState.comments.filter((c) => c.isApproved).length;
	}

	// Add a comment for a specific publication
	async function addComment(publicationId) {
		const versionState = getVersionState(publicationId);

		if (
			!isLatestPublication(publicationId) ||
			!getCurrentUser() ||
			!versionState.commentText.trim()
		) {
			return;
		}

		const {openDialogNetworkError} = usePkpModal();
		const {apiUrl} = useUrl('comments');

		const {fetch: submitComment, isSuccess} = usePkpFetch(apiUrl, {
			method: 'POST',
			body: {
				publicationId: publicationId,
				commentText: versionState.commentText,
			},
		});

		await submitComment();

		if (isSuccess.value) {
			versionState.commentText = '';
			await loadComments(publicationId, true);
		} else {
			openDialogNetworkError();
		}
	}

	// Get available actions for a comment
	function getCommentActions(publicationId, comment) {
		const {t} = usePkpLocalize();
		const actions = [];
		const currentUser = getCurrentUser();

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

	// Delete a comment
	function commentDelete(publicationId, comment) {
		const currentUser = getCurrentUser();

		if (!currentUser || currentUser.id !== comment.userId) {
			throw new Error('Only the comment author can delete the comment');
		}

		const {t} = usePkpLocalize();
		const {openDialog, openDialogNetworkError} = usePkpModal();
		openDialog({
			title: t('userComment.deleteComment'),
			message: t('userComment.deleteCommentConfirmation', {
				comment: comment.commentText,
			}),
			modalStyle: 'negative',
			actions: [
				{
					label: t('common.delete'),
					isDisabled: true,
					callback: async (close) => {
						const {apiUrl} = useUrl(`comments/${comment.id}`);
						const {fetch: deleteComment, isSuccess} = usePkpFetch(apiUrl, {
							method: 'DELETE',
						});
						await deleteComment();
						if (isSuccess.value) {
							// Remove the comment from the list
							const versionState = getVersionState(publicationId);
							versionState.comments = versionState.comments.filter(
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

	// Report a comment
	function commentReport(publicationId, comment) {
		const {t} = usePkpLocalize();
		const {openDialog} = usePkpModal();
		const versionState = getVersionState(publicationId);
		versionState.reportText = '';

		openDialog({
			title: t('userComment.reportComment'),
			comment,
			bodyComponent: pkp.registry.getComponent('PkpCommentReportDialog'),
			bodyProps: {
				comment,
				reportText: versionState.reportText,
				'onUpdate:reportText': (value) => {
					versionState.reportText = value;
				},
			},
			actions: [
				{
					label: t('form.submit'),
					isPrimary: true,
					callback: async (close) => {
						if (versionState.reportText.trim() === '') {
							return;
						}
						await performCommentReport(
							publicationId,
							comment,
							versionState.reportText,
						);
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

	// Perform the actual comment report
	async function performCommentReport(publicationId, comment, reportText) {
		const currentUser = getCurrentUser();

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
			const versionState = getVersionState(publicationId);
			versionState.comments.forEach((comment) => {
				if (comment.id === commentId) {
					comment.isReported = true;
				}
			});
		}
		closeTopDialog();
	}

	return {
		// Global state
		publications,
		latestPublicationId,
		itemsPerPage,
		loginUrl,
		commentsCountPerPublication,
		allCommentsCount,

		// Global actions
		initialize,
		getCurrentUser,
		login,

		// Version-specific getters
		getComments,
		getCommentText,
		getVersionLabel,
		getPublication,
		isLatestPublication,
		hasMoreComments,

		// Version-specific actions
		updateCommentText,
		loadComments,
		addComment,
		getCommentActions,
		commentDelete,
		commentReport,
	};
});
