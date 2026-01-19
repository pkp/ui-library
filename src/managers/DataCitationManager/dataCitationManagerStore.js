import {computed, toRefs} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useExtender} from '@/composables/useExtender';
import {useDataChanged} from '@/composables/useDataChanged';
import {useDataCitationManagerConfig} from './useDataCitationManagerConfig';
import {useDataCitationManagerActions} from './useDataCitationManagerActions';

export const useDataCitationManagerStore = defineComponentStore(
	'dataCitationManager',
	(props) => {
		const extender = useExtender();
		const dataCitationManagerConfig = extender.addFns(
			useDataCitationManagerConfig(),
		);
		const columns = computed(() => dataCitationManagerConfig.getColumns());
		const topItems = computed(() => dataCitationManagerConfig.getTopItems());

		function getItemActions() {
			return dataCitationManagerConfig.getItemActions();
		}

		const {submission, publication} = toRefs(props);

		// Get data citations directly from publication prop
		const dataCitations = computed(
			() => publication.value?.dataCitations ?? [],
		);

		// Use triggerDataChange to notify parent to refetch submission/publication
		const {triggerDataChange} = useDataChanged();

		/**
		 * Actions
		 */
		const dataCitationManagerActions = useDataCitationManagerActions();

		function dataUpdateCallback() {
			triggerDataChange();
		}

		function getActionArgs(additionalArgs = {}) {
			return {
				submission: props.submission,
				publication: props.publication,
				dataCitationEditForm: props.dataCitationEditForm,
				...additionalArgs,
			};
		}
		function dataCitationAddDataCitation() {
			dataCitationManagerActions.dataCitationAddDataCitation(
				getActionArgs({}),
				dataUpdateCallback,
			);
		}
		function dataCitationEditDataCitation({dataCitation}) {
			dataCitationManagerActions.dataCitationEditDataCitation(
				getActionArgs({dataCitation}),
				dataUpdateCallback,
			);
		}
		function dataCitationDeleteDataCitation({dataCitation}) {
			dataCitationManagerActions.dataCitationDeleteDataCitation(
				getActionArgs({dataCitation}),
				dataUpdateCallback,
			);
		}

		const store = {
			columns,
			topItems,
			getItemActions,

			submission,
			publication,

			dataCitations,
			dataCitationAddDataCitation,
			dataCitationEditDataCitation,
			dataCitationDeleteDataCitation,
		};

		return store;
	},
);
