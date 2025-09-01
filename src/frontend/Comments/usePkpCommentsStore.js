import {defineComponentStore} from '@/utils/defineComponentStore';
import {useCommentsVersion} from './useCommentsVersion';
import {reactive} from 'vue';

export const usePkpCommentsStore = defineComponentStore('comments', (props) => {
	const apiPerVersion = reactive({});
	console.log('usePkpCOmmentsStore:', props);
	props.publicationIds.forEach((publicationId) => {
		apiPerVersion[publicationId] = useCommentsVersion({
			publicationId,
			itemsPerPage: props.itemsPerPage,
			totalPublicationComments:
				props.commentsCountPerPublication[publicationId],
		});

		apiPerVersion[publicationId].loadComments();
	});

	function getApiPerVersion(publicationId) {
		return apiPerVersion[publicationId];
	}

	return {getApiPerVersion, publicationIds: props.publicationIds};
});
