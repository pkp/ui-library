import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSubmission} from '@/composables/useSubmission';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';

export const useCitationManagerStore = defineComponentStore(
	'citationManager',
	(props) => {
		return {};
	},
);
