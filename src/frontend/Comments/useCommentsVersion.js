import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {ref, computed} from 'vue';
import {useUrl} from '@/frontend/composables/usePkpUrl';

export function useCommentsVersion({
	publicationId,
	itemsPerPage,
	totalPublicationComments,
}) {
	let comments = ref([]);
	const showMoreCommentsCount = ref(0);
	const currentPage = ref(0);
	const pageCount = ref(0);
	const commentText = ref('');

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

	return {
		comments,
		showMoreCommentsCount,
		currentPage,
		commentText,
		hasMoreComments,
		loadComments,
	};
}
