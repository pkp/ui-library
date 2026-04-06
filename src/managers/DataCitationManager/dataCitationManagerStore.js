import {computed, toRefs} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useExtender} from '@/composables/useExtender';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useDataChanged} from '@/composables/useDataChanged';
import {useDataCitationManagerConfig} from './useDataCitationManagerConfig';
import {useDataCitationManagerActions} from './useDataCitationManagerActions';
import {useOrdering} from '@/composables/useOrdering';

export const useDataCitationManagerStore = defineComponentStore(
	'dataCitationManager',
	(props) => {
		const {submission, publication} = toRefs(props);

		const {
			items: dataCitations,
			sortingEnabled,
			startSorting,
			saveSorting,
			cancelSorting,
			moveUp,
			moveDown,
		} = useOrdering({
			items: computed(() => publication.value?.dataCitations ?? []),
			onSave: async (orderedItems) => {
				const {apiUrl} = useUrl(
					`submissions/${submission.value.id}/publications/${publication.value.id}/dataCitations/order`,
				);

				const sequence = orderedItems.map((dataCitation) => dataCitation.id);

				const {fetch} = useFetch(apiUrl.value, {
					method: 'PUT',
					body: sequence,
				});

				await fetch();
				await triggerDataChange();
				return true;
			},
		});

		const extender = useExtender();
		const dataCitationManagerConfig = extender.addFns(
			useDataCitationManagerConfig(),
		);
		const columns = computed(() => dataCitationManagerConfig.getColumns());
		const topItems = computed(() => dataCitationManagerConfig.getTopItems());

		function getItemActions() {
			return dataCitationManagerConfig.getItemActions();
		}

		// Use triggerDataChange to notify parent to refetch submission/publication
		const {triggerDataChange} = useDataChanged();

		/**
		 * Actions
		 */
		const dataCitationManagerActions = useDataCitationManagerActions();

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
				triggerDataChange,
			);
		}
		function dataCitationEditDataCitation({dataCitation}) {
			dataCitationManagerActions.dataCitationEditDataCitation(
				getActionArgs({dataCitation}),
				triggerDataChange,
			);
		}
		function dataCitationDeleteDataCitation({dataCitation}) {
			dataCitationManagerActions.dataCitationDeleteDataCitation(
				getActionArgs({dataCitation}),
				triggerDataChange,
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

			sortingEnabled,
			startSorting,
			saveSorting,
			cancelSorting,
			moveUp,
			moveDown,
		};

		return store;
	},
);
