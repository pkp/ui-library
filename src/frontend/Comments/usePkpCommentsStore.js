import {defineComponentStore} from '@/utils/defineComponentStore';
import {useCommentsVersion} from './usePkpComments';

export const usePkpCommentsStore = defineComponentStore('comments', (props) => {
	const apiPerVersion = {};
	console.log('usePkpCOmmentsStore:', props);
	props.publicationIds.forEach((publicationId) => {
		apiPerVersion[publicationId] = useCommentsVersion({
			publicationId,
			itemsPerPage: props.itemsPerPage,
			totalPublicationComments:
				props.commentsCountPerPublication[publicationId],
			isLatestPublication: publicationId === props.latestPublicationId,
		});

		apiPerVersion[publicationId].loadComments();
	});

	function getApiPerVersion(publicationId) {
		return apiPerVersion[publicationId];
	}

	/**
	 * Redirects the user to the login page.
	 */
	function login() {
		window.location = props.loginUrl;
	}

	return {
		getApiPerVersion,
		publicationIds: props.publicationIds,
		login,
	};
});
