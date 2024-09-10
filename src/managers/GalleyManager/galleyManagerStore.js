import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed} from 'vue';
import {useGalleyManagerActions} from './useGalleyManagerActions';
import {useDataChanged} from '@/composables/useDataChanged';

export const useGalleyManagerStore = defineComponentStore(
	'galleyManager',
	(props) => {
		const galleys = computed(() => {
			return props?.publication?.galleys || [];
		});

		/** Reload files when data on screen changes */

		/**
		 * Actions
		 */
		const _galleyActionsFns = useGalleyManagerActions();

		const itemActions = computed(() => _galleyActionsFns.getItemActions());
		const bottomActions = computed(() => _galleyActionsFns.getBottomActions());

		const {triggerDataChange} = useDataChanged();

		function handleAction(actionName, _args = {}) {
			_galleyActionsFns.handleAction(
				actionName,
				{
					..._args,
					submission: props.submission,
					publication: props.publication,
				},
				() => {
					triggerDataChange();
				},
			);
		}
		return {
			galleys,
			itemActions,
			bottomActions,
			_galleyActionsFns,
			handleAction,
		};
	},
);
