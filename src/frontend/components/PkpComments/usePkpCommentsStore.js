import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useUrl} from '@/frontend/composables/usePkpUrl';
import {usePkpFetch} from '@/frontend/composables/usePkpFetch';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {useDate} from '@/composables/useDate';
import {formatShortDate} from '@/utils/dateUtils';

export const usePkpCommentsStore = defineStore('pkpComments', () => {
	// Global state
	const submissionId = ref(0);
	const publications = ref([]);
	const latestPublicationId = ref(null);
	const itemsPerPage = ref(25);
	const loginUrl = ref('');
	const comments = ref([]);
	const allCommentsCount = ref(0);
	const commentText = ref('');
	const reportText = ref('');
	const isCommentSubmitting = ref(false);
	const nestedStyles = ref({});
	const currentPage = ref(0);
	const pageCount = ref(0);
	const showMoreCommentsCount = ref(0);

	/**
	 * Initialize the store with global configuration
	 * @param {Object} props - Configuration object
	 * @param {Array<Object>} [props.publications=[]] - Array of publication objects with id, version, and URL
	 * @param {number|null} props.latestPublicationId - ID of the latest publication
	 * @param {number} [props.itemsPerPage=10] - Number of items per page
	 * @param {string} props.loginUrl - URL for login redirect
	 * @param {number} [props.allCommentsCount=0] - Total comments count across all publications
	 */
	function initialize(
		{
			submissionId: _submissionId = 0,
			publications: _publications = [],
			latestPublicationId: _latestPublicationId,
			itemsPerPage: _itemsPerPage = 10,
			loginUrl: _loginUrl,
			allCommentsCount: _allCommentsCount = 0,
		},
		_nestedStyles = {},
	) {
		submissionId.value = _submissionId || 0;
		// Set publications array
		publications.value = _publications || [];

		latestPublicationId.value = _latestPublicationId;
		itemsPerPage.value = _itemsPerPage;
		loginUrl.value = _loginUrl;
		allCommentsCount.value = _allCommentsCount;
		nestedStyles.value = _nestedStyles;

		// Load comments for all publications
		loadComments();
	}

	// Get current user (global)
	function getCurrentUser() {
		return pkp.currentUser;
	}

	// Login redirect (global)
	function login() {
		window.location = loginUrl.value;
	}

	// Update comment text
	function updateCommentText(value) {
		commentText.value = value;
	}

	// Get version label for a specific publication
	function getVersionLabel(publicationId) {
		// Try to find the publication object to get its version
		const publication = getPublication(publicationId);
		return publication ? publication.version : publicationId;
	}

	// Get publication object by ID
	function getPublication(publicationId) {
		return publications.value.find((pub) => pub.id === publicationId);
	}

	// Check if a publication is the latest
	function isLatestPublication(publicationId) {
		return publicationId === latestPublicationId.value;
	}

	// Check if this is the first comment on an old version
	function isFirstCommentOnOldVersion(comment, commentIndex) {
		const isOldComment = !isLatestPublication(comment.publicationId);
		if (!isOldComment) {
			return;
		}
		const previousComment = comments.value[commentIndex - 1];
		return (
			!previousComment || isLatestPublication(previousComment.publicationId)
		);
	}

	// Check if there are more comments to load
	function hasMoreComments() {
		return showMoreCommentsCount.value > 0;
	}

	// Get a translated string with the comment date and version label
	function getCommentedOn(comment) {
		const {t} = usePkpLocalize();
		const {formatLongDateTime} = useDate();
		const publication = getPublication(comment.publicationId);
		return t('userComment.commentedOn', {
			dateTime: formatLongDateTime(comment.createdAt),
			date: getDisplayDate(comment),
			versionUrl: publication.url,
			versionLabel: getVersionLabel(comment.publicationId),
		});
	}

	// Get the formatted date of the comment for display
	// If the comment is less than a week old, we display
	// a relative date (eg - 3 days ago)
	function getDisplayDate(comment) {
		const {relativeStringTimeFromNow} = useDate();
		const dateTime = new Date(comment.createdAt);
		const msWeek = 605800000;
		const moreThanWeekOld =
			new Date().getTime() - dateTime.toTimeString() > msWeek;
		return moreThanWeekOld
			? formatShortDate(comment.createdAt)
			: relativeStringTimeFromNow(dateTime.getTime());
	}

	// Was this comment created by the current user?
	function isCurrentUserComment(comment) {
		const currentUser = getCurrentUser();
		return currentUser && currentUser.id === comment.userId;
	}

	// Load comments for this submission
	async function loadComments(refresh = false) {
		if (!submissionId.value) {
			return;
		}

		const {apiUrl} = useUrl(
			`comments/public?submissionIds=${submissionId.value}`,
		);

		currentPage.value = refresh ? 1 : currentPage.value + 1;

		const {items, pagination, fetch} = useFetchPaginated(apiUrl, {
			currentPage: currentPage.value,
			pageSize: itemsPerPage.value,
		});

		await fetch();

		comments.value = refresh
			? items.value
			: [...comments.value, ...items.value];

		pageCount.value = pagination.value.pageCount;
		allCommentsCount.value = pagination.value.itemCount;
		showMoreCommentsCount.value =
			allCommentsCount.value - comments.value.length;
	}

	// Add a comment for a specific publication
	async function addComment() {
		if (
			!getCurrentUser() ||
			!commentText.value.trim() ||
			isCommentSubmitting.value
		) {
			return;
		}

		isCommentSubmitting.value = true;

		const {apiUrl} = useUrl('comments');

		const {fetch: submitComment, isSuccess} = usePkpFetch(apiUrl, {
			method: 'POST',
			body: {
				submissionId: submissionId.value,
				commentText: commentText.value,
			},
		});

		await submitComment();

		if (isSuccess.value) {
			commentText.value = '';
			await loadComments(true);
		}

		isCommentSubmitting.value = false;
	}

	// Delete a comment
	async function deleteComment(comment) {
		if (!isCurrentUserComment(comment)) {
			throw new Error('Only the comment author can delete the comment');
		}

		const {apiUrl} = useUrl(`comments/${comment.id}`);

		const {fetch, isSuccess} = usePkpFetch(apiUrl, {
			method: 'DELETE',
		});

		await fetch();

		if (isSuccess.value) {
			const newComments = comments.value.filter((c) => c.id !== comment.id);
			comments.value = newComments;
		}

		return isSuccess.value;
	}

	// Reoport the comment
	async function reportComment(comment, reportText) {
		const currentUser = getCurrentUser();

		if (!currentUser || !reportText.trim()) {
			return;
		}

		const {apiUrl} = useUrl(`comments/${comment.id}/reports`);

		const {fetch: postReport, isSuccess} = usePkpFetch(apiUrl, {
			method: 'POST',
			body: {
				note: reportText,
			},
		});

		await postReport();

		if (isSuccess.value) {
			const newComments = comments.value.map((c) => {
				if (c.id === comment.id) {
					return {...c, isReported: true};
				}
				return c;
			});
			comments.value = newComments;
		}

		return isSuccess.value;
	}

	return {
		// Global state
		submissionId,
		publications,
		latestPublicationId,
		itemsPerPage,
		loginUrl,
		comments,
		allCommentsCount,
		currentPage,
		pageCount,
		showMoreCommentsCount,
		commentText,
		reportText,
		updateCommentText,
		isCommentSubmitting,

		// Global actions
		initialize,
		getCurrentUser,
		login,

		// Getters
		getVersionLabel,
		getPublication,
		isLatestPublication,
		hasMoreComments,
		isFirstCommentOnOldVersion,
		getCommentedOn,
		isCurrentUserComment,

		// Actions
		loadComments,
		addComment,
		deleteComment,
		reportComment,
	};
});
