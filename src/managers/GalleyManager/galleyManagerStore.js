import {defineComponentStore} from '@/utils/defineComponentStore';
import {ref, computed, toRefs} from 'vue';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useGalleyManagerActions} from './useGalleyManagerActions';
import {useDataChanged} from '@/composables/useDataChanged';
import {useGalleyManagerConfig} from './useGalleyManagerConfig';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useExtender} from '@/composables/useExtender';

export const useGalleyManagerStore = defineComponentStore(
	'galleyManager',
	(props) => {
		const extender = useExtender();

		const {submission, publication} = toRefs(props);

		const galleys = computed(() => {
			return sortingEnabled.value
				? galleysOrdered.value
				: props?.publication?.galleys || [];
		});

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

		const itemActions = computed(() =>
			galleyManagerConfig.getItemActions(getActionArgs()),
		);
		const bottomItems = computed(() =>
			galleyManagerConfig.getBottomItems(getActionArgs()),
		);
		const topItems = computed(() =>
			galleyManagerConfig.getTopItems(getActionArgs()),
		);

		/**
		 * Sorting
		 */
		const galleysOrdered = ref([]);
		const sortingEnabled = ref(false);
		function startSorting() {
			galleysOrdered.value = [...props.publication.galleys];
			sortingEnabled.value = true;
		}
		async function saveSorting() {
			const {openDialogNetworkError} = useModal();
			const {url} = useLegacyGridUrl({
				component: 'grid.articleGalleys.ArticleGalleyGridHandler',
				op: 'saveSequence',
				params: {
					submissionId: props.submission.id,
					publicationId: props.publication.id,
				},
			});

			const sequence = galleysOrdered.value.map((galley) => galley.id);

			const formData = new FormData();
			formData.append('csrfToken', getCSRFToken());
			formData.append('data', sequence);

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
			}
			await triggerDataChange();
			sortingEnabled.value = false;
		}

		function sortMoveDown(itemId) {
			const index = galleysOrdered.value.findIndex(
				(galley) => galley.id === itemId,
			);

			if (index === galleysOrdered.value.length - 1) {
				return;
			}

			const tempArray = [...galleysOrdered.value];
			const tempItem = tempArray[index];
			tempArray[index] = tempArray[index + 1];
			tempArray[index + 1] = tempItem;

			galleysOrdered.value = tempArray;
		}

		function sortMoveUp(itemId) {
			const index = galleysOrdered.value.findIndex(
				(galley) => galley.id === itemId,
			);

			if (index === 0) {
				return;
			}

			const temp = galleysOrdered.value[index];
			galleysOrdered.value[index] = galleysOrdered.value[index - 1];
			galleysOrdered.value[index - 1] = temp;
		}

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

		const {triggerDataChange} = useDataChanged();

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
			itemActions,
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
		};
	},
);
