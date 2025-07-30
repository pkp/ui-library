import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, watch} from 'vue';

import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';

export const useDiscussionMessagesStore = defineComponentStore(
	'discussionMessages',
	(props) => {
		const extender = useExtender();

		const relativeUrl = computed(() => {
			return `messages`;
		});

		const {apiUrl: messagesApiUrl} = useUrl(relativeUrl);

		const {data: messages, fetch: fetchDiscussionMessages} =
			useFetch(messagesApiUrl);

		watch(relativeUrl, () => {
			messages.value = null;
			fetchDiscussionMessages();
		});

		fetchDiscussionMessages();

		const {triggerDataChange} = useDataChanged(() => fetchDiscussionMessages());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		const discussionMessages = computed(() => {
			if (!messages.value) {
				return [];
			}

			return messages.value;
		});

		return {
			discussionMessages,
			triggerDataChangeCallback,

			extender,
			props,
		};
	},
);
