import {defineComponentStore} from '@/utils/defineComponentStore';
import {ref, computed, toRefs} from 'vue';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useGalleyManagerActions} from './useGalleyManagerActions';
import {useDataChanged} from '@/composables/useDataChanged';
import {useGalleyManagerConfiguration} from './useGalleyManagerConfiguration';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
export const useGalleyManagerStore = defineComponentStore(
	'galleyManager',
	(props) => {
		const {submission, publication} = toRefs(props);

		const galleys = computed(() => {
			return sortingEnabled.value
				? galleysOrdered.value
				: props?.publication?.galleys || [];
		});

		/** Reload files when data on screen changes */

		/** Columns */
		const _galleyConfigurationFns = useGalleyManagerConfiguration({
			submission,
			publication,
		});
		const columns = computed(() => _galleyConfigurationFns.getColumns());

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
		const _galleyActionsFns = useGalleyManagerActions({
			galleyGridComponent: _galleyConfigurationFns.getGalleyGridComponent(),
		});
		function getActionArgs() {
			return {
				config: _galleyConfigurationFns.config.value,
				galleys: galleys,
				publication: publication.value,
			};
		}

		const itemActions = computed(() =>
			_galleyActionsFns.getItemActions(getActionArgs()),
		);
		const bottomActions = computed(() =>
			_galleyActionsFns.getBottomActions(getActionArgs()),
		);
		const topItems = computed(() =>
			_galleyActionsFns.getTopItems(getActionArgs()),
		);

		const {triggerDataChange} = useDataChanged();

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		function galleyAdd() {
			_galleyActionsFns.galleyAdd(
				{
					publication: props.publication,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function galleyChangeFile({galley}) {
			_galleyActionsFns.galleyChangeFile(
				{
					galley,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function galleyEdit({galley}) {
			_galleyActionsFns.galleyEdit(
				{
					galley,
					publication: props.publication,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function galleyDelete({galley}) {
			_galleyActionsFns.galleyDelete(
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

			/** columns */
			columns,
			_galleyConfigurationFns,
			/** items */
			galleys,

			/** sorting */
			sortingEnabled,
			startSorting,
			saveSorting,
			sortMoveDown,
			sortMoveUp,

			/** actions */
			itemActions,
			topItems,
			bottomActions,
			_galleyActionsFns,
			galleyAdd,
			galleyEdit,
			galleyChangeFile,
			galleyDelete,
		};
	},
);
