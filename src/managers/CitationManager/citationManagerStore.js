import {computed, ref, toRefs} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useFetch} from '@/composables/useFetch';
import {useCitationManagerConfig} from './useCitationManagerConfig';
import {useCitationManagerActions} from './useCitationManagerActions';

// todo: canEdit; add raw citations with useForm; localise date/volume

export const useCitationManagerStore = defineComponentStore(
	'citationManager',
	(props) => {
		const {openDialog} = useModal();
		const {t} = useLocalize();
		const extender = useExtender();
		const {triggerDataChange} = useDataChanged();

		function dataUpdateCallback() {
			triggerDataChange();
		}

		const citationManagerConfig = extender.addFns(useCitationManagerConfig());
		const columns = computed(() => citationManagerConfig.getColumns());
		const topItems = computed(() => citationManagerConfig.getTopItems());
		function getItemPrimaryActions(args) {
			return citationManagerConfig.getItemPrimaryActions(args);
		}
		function getItemActions(args) {
			return citationManagerConfig.getItemActions(args);
		}

		const {submission, publication} = toRefs(props);
		const citations = computed(() => publication.value.citations ?? []);

		/**
		 * constants
		 */
		const doiPrefix = 'https://doi.org';
		const apiPathCitations = 'citations';
		const apiPathSubmissions = `submissions/${submission.value.id}/publications/${publication.value.id}/citations`;

		/**
		 * citations metadata lookup
		 */
		const citationsMetadataLookup = computed(
			() => publication.value.citationsMetadataLookup,
		);
		async function citationsMetadataLookupChanged(newValue) {
			const {apiUrl} = useUrl(apiPathSubmissions);
			const {fetch} = useFetch(`${apiUrl.value}/metadataLookup`, {
				method: 'PUT',
				body: {
					citationsMetadataLookup: newValue,
				},
			});
			await fetch();
			dataUpdateCallback();
		}

		/**
		 * add new raw citations
		 */
		const citationsRawToBeAdded = ref('');
		const citationsRawShowMessage = ref('');
		async function handleAddCitationsRawToList() {
			if (!citationsRawToBeAdded.value) {
				citationsRawShowMessage.value = 'isEmpty';
				setTimeout(() => {
					citationsRawShowMessage.value = '';
				}, 4000);
				return;
			}
			const {apiUrl} = useUrl(apiPathSubmissions);
			const {fetch, data} = useFetch(
				`${apiUrl.value}/importAdditionalCitations`,
				{
					method: 'POST',
					body: {rawCitations: citationsRawToBeAdded.value},
				},
			);
			citationsRawShowMessage.value = 'isLoading';
			await fetch();
			citationsRawToBeAdded.value = data.value?.trim?.() ?? '';
			citationsRawShowMessage.value = citationsRawToBeAdded.value
				? 'isPartial'
				: 'isSuccess';
			dataUpdateCallback();
			setTimeout(() => {
				citationsRawShowMessage.value = '';
			}, 4000);
		}

		/**
		 * status processed citations
		 */
		const totalCitations = computed(() => citations.value?.length ?? 0);
		const processedCitations = computed(
			() =>
				(citations.value || []).filter((c) => c?.isProcessed === true).length,
		);

		/**
		 * delete all citations
		 */
		function citationDeleteAllCitations() {
			openDialog({
				title: t('submission.citations.structured.deleteAllDialog.title'),
				message: t('submission.citations.structured.deleteAllDialog.confirm'),
				modalStyle: 'negative',
				actions: [
					{
						label: t('common.ok'),
						isWarnable: true,
						callback: async (close) => {
							const {apiUrl} = useUrl(apiPathSubmissions);
							const {fetch} = useFetch(
								`${apiUrl.value}/deleteCitationsByPublicationId`,
								{method: 'DELETE'},
							);
							await fetch();
							dataUpdateCallback();
							close();
						},
					},
					{
						label: t('common.cancel'),
						isSecondary: true,
						callback: (close) => {
							close();
						},
					},
				],
			});
		}

		/**
		 * Toggle all / toggle status
		 */
		const allIdsExpanded = ref(false);
		const expandedIds = ref([]);
		function toggleItemExpansion(citation) {
			if (!expandedIds.value.includes(citation.id)) {
				expandedIds.value.push(citation.id);
			} else {
				expandedIds.value = expandedIds.value.filter(
					(id) => id !== citation.id,
				);
			}
		}
		function toggleAllItemsExpansion() {
			allIdsExpanded.value = !allIdsExpanded.value;
			if (allIdsExpanded.value) {
				citations.value.forEach((citation) => {
					if (
						allIdsExpanded.value &&
						citation.isStructured &&
						!expandedIds.value.includes(citation.id)
					) {
						expandedIds.value.push(citation.id);
					}
				});
			} else {
				expandedIds.value = [];
			}
		}
		function isExpanded(citation) {
			return expandedIds.value.includes(citation.id);
		}

		/**
		 * Filtered citations and search phrase
		 */
		const searchPhrase = ref('');
		const citationsFiltered = computed(() => {
			const data = citations.value || [];
			return searchPhrase.value
				? filterArrayByPhrase(data, searchPhrase.value)
				: data;
		});
		function setSearchPhrase(value) {
			searchPhrase.value = value;
		}
		function containsSearchPhrase(obj, phrase) {
			function deepSearch(value) {
				if (value === null || value === undefined) return false;
				if (typeof value === 'string') {
					return value
						.toLowerCase()
						.includes(String(phrase ?? '').toLowerCase());
				}
				if (Array.isArray(value)) {
					return value.some(deepSearch);
				}
				if (typeof value === 'object') {
					return Object.values(value).some(deepSearch);
				}
				return false;
			}
			return deepSearch(obj);
		}
		function filterArrayByPhrase(data, phrase) {
			return (Array.isArray(data) ? data : []).filter((item) =>
				containsSearchPhrase(item, phrase),
			);
		}

		/**
		 * Actions
		 */
		const citationManagerActions = useCitationManagerActions();
		function getActionArgs(additionalArgs = {}) {
			return {
				submission: props.submission,
				publication: props.publication,
				componentForms: props.componentForms,
				...additionalArgs,
			};
		}
		function citationEditCitation({citation}) {
			citationManagerActions.citationEditCitation(
				getActionArgs({citation}),
				dataUpdateCallback,
			);
		}
		function citationDeleteCitation({citation}) {
			citationManagerActions.citationDeleteCitation(
				getActionArgs({citation}),
				dataUpdateCallback,
			);
		}
		function citationReprocessCitation({citation}) {
			citationManagerActions.citationReprocessCitation(
				getActionArgs({citation}),
				dataUpdateCallback,
			);
		}

		return {
			columns,
			topItems,
			getItemPrimaryActions,
			getItemActions,

			submission,
			publication,

			doiPrefix,
			apiPathCitations,
			apiPathSubmissions,

			citationsMetadataLookup,
			citationsMetadataLookupChanged,

			citationsRawToBeAdded,
			citationsRawShowMessage,
			handleAddCitationsRawToList,

			totalCitations,
			processedCitations,

			citationDeleteAllCitations,

			allIdsExpanded,
			expandedIds,
			toggleItemExpansion,
			toggleAllItemsExpansion,
			isExpanded,

			citationsFiltered,
			searchPhrase,
			setSearchPhrase,

			citationEditCitation,
			citationDeleteCitation,
			citationReprocessCitation,
		};
	},
);
