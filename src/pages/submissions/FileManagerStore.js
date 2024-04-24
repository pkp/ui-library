import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref} from 'vue';
//import {useFetch} from '@/composables/useFetch';
//import {useUrl} from '@/composables/useUrl';

export const useFileManagerStore = defineComponentStore(
	'fileManager',
	(initValues) => {
		const title = ref('ahoj');

		return {title};
	},
);
