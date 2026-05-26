import {computed, toRefs} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useExtender} from '@/composables/useExtender';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useDataChanged} from '@/composables/useDataChanged';
import {useFunderManagerConfig} from './useFunderManagerConfig';
import {useFunderManagerActions} from './useFunderManagerActions';
import {useOrdering} from '@/composables/useOrdering';

export const useFunderManagerStore = defineComponentStore(
	'funderManager',
	(props) => {
		const {submission, publication, canEdit: canEditPublication} = toRefs(props);

		const {
			items: funders,
			sortingEnabled,
			startSorting,
			saveSorting,
			cancelSorting,
			moveUp,
			moveDown,
		} = useOrdering({
			items: computed(() => publication.value?.funders ?? []),
			onSave: async (orderedItems) => {
				const {apiUrl} = useUrl(
					`submissions/${submission.value.id}/publications/${publication.value.id}/funders/order`,
				);

				const sequence = orderedItems.map((funder) => funder.id);

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
		const funderManagerConfig = extender.addFns(
			useFunderManagerConfig(),
		);
		const columns = computed(() => funderManagerConfig.getColumns());
		const topItems = computed(() => funderManagerConfig.getTopItems());

		function getItemActions() {
			return funderManagerConfig.getItemActions();
		}

		// Use triggerDataChange to notify parent to refetch submission/publication
		const {triggerDataChange} = useDataChanged();

		/**
		 * Actions
		 */
		const funderManagerActions = useFunderManagerActions();

		function getActionArgs(additionalArgs = {}) {
			return {
				submission: props.submission,
				publication: props.publication,
				funderEditForm: props.funderEditForm,
				...additionalArgs,
			};
		}
		function fundersAddFunder() {
			funderManagerActions.fundersAddFunder(
				getActionArgs({}),
				triggerDataChange,
			);
		}
		function fundersEditFunder({funder}) {
			funderManagerActions.fundersEditFunder(
				getActionArgs({funder}),
				triggerDataChange,
			);
		}
		function fundersDeleteFunder({funder}) {
			funderManagerActions.fundersDeleteFunder(
				getActionArgs({funder}),
				triggerDataChange,
			);
		}

		const store = {
			columns,
			topItems,
			getItemActions,

			submission,
			publication,
			canEditPublication,

			funders,
			fundersAddFunder,
			fundersEditFunder,
			fundersDeleteFunder,

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
