import {defineComponentStore} from '@/utils/defineComponentStore';

export const usePkpCommentsStore = defineComponentStore('comments', (props) => {
	return {
		publicationIds: props.publicationIds,
		latestPublicationId: props.latestPublicationId,
		itemsPerPage: props.itemsPerPage,
		loginUrl: props.loginUrl,
	};
});
