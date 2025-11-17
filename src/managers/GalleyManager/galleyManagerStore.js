import {defineComponentStore} from '@/utils/defineComponentStore';
import {computed, toRefs} from 'vue';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useGalleyManagerActions} from './useGalleyManagerActions';
import {useDataChanged} from '@/composables/useDataChanged';
import {useGalleyManagerConfig} from './useGalleyManagerConfig';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useExtender} from '@/composables/useExtender';
import {useOrdering} from '@/composables/useOrdering';

export const useGalleyManagerStore = defineComponentStore(
	'galleyManager',
	(props) => {
		const extender = useExtender();

		const {submission, publication} = toRefs(props);

		const {triggerDataChange} = useDataChanged();

		/**
		 * Sorting with useOrdering composable
		 */
		const {
			items: galleys,
			sortingEnabled,
			startSorting,
			saveSorting: saveOrderingChanges,
			moveUp: sortMoveUp,
			moveDown: sortMoveDown,
		} = useOrdering({
			items: computed(() => props?.publication?.galleys || []),
			onSave: async (orderedItems) => {
				const {openDialogNetworkError} = useModal();
				const {url} = useLegacyGridUrl({
					component: 'grid.articleGalleys.ArticleGalleyGridHandler',
					op: 'saveSequence',
					params: {
						submissionId: props.submission.id,
						publicationId: props.publication.id,
					},
				});

				const sequence = orderedItems.map((galley) => galley.id);

				const payload = {
					csrfToken: getCSRFToken(),
					data: JSON.stringify(sequence),
				};

				const body = new URLSearchParams(payload);

				const {fetch, data} = useFetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body,
				});
				await fetch();
				if (data.value.status !== true) {
					openDialogNetworkError();
					return false;
				}
				await triggerDataChange();
				return true;
			},
		});

		// Wrapper for saveSorting to maintain backwards compatibility
		async function saveSorting() {
			await saveOrderingChanges();
		}

		/** Reload files when data on screen changes */

		/** Columns */
		const galleyManagerConfig = extender.addFns(useGalleyManagerConfig());
		const columns = computed(() => galleyManagerConfig.getColumns());

		/**
		 * Configs
		 */
		const galleyConfig = computed(() =>
			galleyManagerConfig.getManagerConfig({
				submission,
				publication,
			}),
		);

		function getItemActions({galley}) {
			return galleyManagerConfig.getItemActions({galley, ...getActionArgs()});
		}

		const bottomItems = computed(() =>
			galleyManagerConfig.getBottomItems(getActionArgs()),
		);
		const topItems = computed(() =>
			galleyManagerConfig.getTopItems(getActionArgs()),
		);

		/**
		 * Actions
		 */
		const galleyManagerActions = useGalleyManagerActions({
			galleyGridComponent: galleyManagerConfig.getGalleyGridComponent(),
		});

		function getActionArgs() {
			return {
				config: galleyConfig.value,
				galleys: galleys,
				publication: publication.value,
			};
		}

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		function galleyAdd() {
			galleyManagerActions.galleyAdd(
				{
					publication: props.publication,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function galleyChangeFile({galley}) {
			galleyManagerActions.galleyChangeFile(
				{
					galley,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function galleyEdit({galley}) {
			galleyManagerActions.galleyEdit(
				{
					galley,
					publication: props.publication,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function galleyDelete({galley}) {
			galleyManagerActions.galleyDelete(
				{
					galley,
					publication: props.publication,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		return {
			submission: props.submission,
			publication: props.publication,
			galleys,

			/** Config */
			columns,
			getItemActions,
			topItems,
			bottomItems,

			/** Sorting */
			sortingEnabled,
			startSorting,
			saveSorting,
			sortMoveDown,
			sortMoveUp,

			/** Actions */
			galleyAdd,
			galleyEdit,
			galleyChangeFile,
			galleyDelete,

			/** Extender */
			extender,
			props,
		};
	},
);
