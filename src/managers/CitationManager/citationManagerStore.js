import {computed, onUnmounted, ref, toRefs} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useFetch} from '@/composables/useFetch';
import {useCitationManagerConfig} from './useCitationManagerConfig';
import {useCitationManagerActions} from './useCitationManagerActions';
import {useCitationManagerFormAddRawCitation} from './useCitationManagerFormAddRawCitation';

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

		function getItemActions({citation}) {
			return citationManagerConfig.getItemActions({
				citation,
				store,
			});
		}

		const {
			submission,
			publication,
			citationsMetadataLookup,
			canEdit: canEditPublication,
		} = toRefs(props);
		const citations = computed(() => publication.value.citations ?? []);

		/**
		 * constants
		 */
		const arxivUrlPrefix = 'https://arxiv.org/abs/';
		const doiUrlPrefix = 'https://doi.org/';
		const handleUrlPrefix = 'https://hdl.handle.net/';
		const apiPathCitations = 'citations';
		const apiPathSubmissions = `submissions/${submission.value.id}/publications/${publication.value.id}/citations`;

		/**
		 * add new raw citations
		 */
		const {form: formAddRawCitations} = useCitationManagerFormAddRawCitation({
			apiPathSubmissions,
			canEditPublication,
			onSuccess: () => {
				dataUpdateCallback();
			},
		});

		/**
		 * status processed citations
		 */
		const totalCitations = computed(() => citations.value?.length ?? 0);
		const processedCitations = computed(
			() =>
				(citations.value || []).filter((c) => c?.isProcessed === true).length,
		);

		/**
		 * Reload publication until all citations are processed
		 */
		const reloadIntervalId = setInterval(() => {
			if (
				citationsMetadataLookup.value &&
				processedCitations.value < totalCitations.value
			) {
				// simple way to refresh publication
				triggerDataChange();
			}
		}, 7000);

		onUnmounted(() => {
			clearInterval(reloadIntervalId);
		});

		/**
		 * delete all citations
		 */
		function deleteAllCitations() {
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
		 * reprocess all citations
		 */
		function reprocessAllCitations() {
			openDialog({
				title: t('submission.citations.structured.reprocessAllCitations.title'),
				message: t(
					'submission.citations.structured.reprocessAllCitations.confirm',
				),
				modalStyle: 'negative',
				actions: [
					{
						label: t('common.ok'),
						isWarnable: true,
						callback: async (close) => {
							const {apiUrl} = useUrl(apiPathSubmissions);
							const {fetch} = useFetch(
								`${apiUrl.value}/reprocessCitationsByPublicationId`,
								{
									method: 'POST',
								},
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
			const searchWords = searchPhrase.value
				? searchPhrase.value.toLowerCase().split(' ')
				: [];

			return searchWords.length > 0
				? data.filter((citation) => {
						// remove all keys from object and search in values only
						let values = Object.values(citation).map((value) => {
							if (Array.isArray(value)) {
								return value.map((innerObj) => Object.values(innerObj));
							}
							return value;
						});
						return searchWords.every((word) => {
							return JSON.stringify(values).toLowerCase().includes(word);
						});
					})
				: data;
		});
		function setSearchPhrase(value) {
			searchPhrase.value = value;
		}

		/**
		 * Actions
		 */
		const citationManagerActions = useCitationManagerActions();
		function getActionArgs(additionalArgs = {}) {
			return {
				submission: props.submission,
				publication: props.publication,
				citationsMetadataLookup: props.citationsMetadataLookup,
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

		const store = {
			columns,
			topItems,
			getItemActions,

			submission,
			publication,
			canEditPublication,

			arxivUrlPrefix,
			doiUrlPrefix,
			handleUrlPrefix,
			apiPathCitations,
			apiPathSubmissions,

			citationsMetadataLookup,

			formAddRawCitations,

			totalCitations,
			processedCitations,

			deleteAllCitations,

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
			reprocessAllCitations,
			citationReprocessCitation,
		};

		return store;
	},
);
