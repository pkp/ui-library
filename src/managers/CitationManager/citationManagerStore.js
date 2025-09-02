import {computed, onMounted, reactive, ref, toRefs} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSubmission} from '@/composables/useSubmission';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useCitationManagerConfig} from '@/managers/CitationManager/useCitationManagerConfig';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import CitationEditModal from '@/managers/CitationManager/modals/CitationEditModal.vue';

export const useCitationManagerStore = defineComponentStore(
	'citationManager',
	(props) => {
		const {openDialog, openSideModal} = useModal();
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
		const {apiUrl: apiUrlCitations} = useUrl(`citations`);
		const {apiUrl: apiUrlSubmissions} = useUrl(
			`submissions/${submission.value.id}/publications/${publication.value.id}/citations`,
		);

		/**
		 * constants
		 */
		const doiPrefix = 'https://doi.org';

		/**
		 * citations metadata lookup
		 */
		const citationsMetadataLookup = ref(false);
		onMounted(() => {
			if (publication.value.citationsMetadataLookup === null) {
				citationsMetadataLookup.value = false;
			} else {
				citationsMetadataLookup.value =
					publication.value.citationsMetadataLookup;
			}
		});
		function citationsMetadataLookupChanged() {
			let title = t('submission.citations.structured.disableModal.title');
			let message = t('submission.citations.structured.disableModal.confirm');
			if (citationsMetadataLookup.value) {
				title = t('submission.citations.structured.enableModal.title');
				message = t('submission.citations.structured.enableModal.confirm');
			}

			const {openDialog} = useModal();
			openDialog({
				name: 'disableCitationsMetadataLookup',
				title: title,
				message: message,
				actions: [
					{
						label: t('common.yes', {}),
						isWarnable: true,
						callback: async (close) => {
							const {fetch} = useFetch(
								`${apiUrlSubmissions.value}/metadataLookup`,
								{
									method: 'PUT',
									body: {
										citationsMetadataLookup: citationsMetadataLookup.value,
									},
								},
							);
							await fetch();
							dataUpdateCallback();
							close();
						},
					},
					{
						label: t('common.no', {}),
						isPrimary: true,
						callback: (close) => {
							citationsMetadataLookup.value = !citationsMetadataLookup.value;
							close();
						},
					},
				],
				close: () => {},
			});
		}

		/**
		 * add new raw citations
		 */
		const citationsRawToBeAdded = ref('');
		const citationsRawShowMessage = ref('');
		async function handleAddCitationsRawToList() {
			const {fetch, data} = useFetch(
				`${apiUrlSubmissions.value}/importAdditionalCitations`,
				{
					method: 'POST',
					body: {rawCitations: citationsRawToBeAdded},
				},
			);
			await fetch();
			citationsRawToBeAdded.value = data.value.trim();
			if (citationsRawToBeAdded.value) {
				citationsRawShowMessage.value = 'partial';
			} else {
				citationsRawShowMessage.value = 'success';
			}
			dataUpdateCallback();
			setTimeout(() => {
				citationsRawShowMessage.value = '';
			}, 10000);
		}

		/**
		 * status processed citations
		 */
		const totalCitations = computed(() => {
			return publication.value.citations
				? publication.value.citations.length
				: 0;
		});
		const processedCitations = computed(() => {
			return Object.entries(publication.value.citations)
				.filter(([key, value]) => value['isProcessed'] === true)
				.map(([key, value]) => ({item: key, c: value})).length;
		});

		/**
		 * delete all citations
		 */
		function citationDeleteAllCitations() {
			openDialog({
				name: 'deleteCitation',
				title: t('submission.citations.structured.deleteAllDialog.title'),
				message: t(
					'submission.citations.structured.deleteAllDialog.confirm',
					{},
				),
				actions: [
					{
						label: t('common.deleteAll'),
						isPrimary: true,
						callback: async (close) => {
							const {fetch} = useFetch(
								`${apiUrlSubmissions.value}/deleteCitationsByPublicationId`,
								{method: 'DELETE'},
							);
							await fetch();
							await dataUpdateCallback();
							close();
						},
					},
					{
						label: t('common.no'),
						isWarnable: true,
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
		const allRowsExpanded = ref(false);
		let toggleStatusRows = reactive({});
		function toggleStatusRowChanged(citationId) {
			if (typeof toggleStatusRows[citationId] === 'undefined') {
				toggleStatusRows[citationId] = false;
			}
			toggleStatusRows[citationId] = !toggleStatusRows[citationId];
		}
		function allRowsExpandedChanged() {
			allRowsExpanded.value = !allRowsExpanded.value;
			publication.value.citations.forEach((citation) => {
				toggleStatusRows[citation.id] = allRowsExpanded.value;
			});
		}

		/**
		 * Filtered citations and search phrase
		 */
		const citationsFiltered = computed(() => {
			if (searchPhrase.value) {
				return filterArrayByPhrase(
					props?.publication?.citations,
					searchPhrase.value,
				);
			} else {
				return props?.publication?.citations;
			}
		});
		const searchPhrase = ref('');
		function setSearchPhrase(value) {
			searchPhrase.value = value;
		}
		function containsSearchPhrase(obj, phrase) {
			function deepSearch(value) {
				if (value === null || value === undefined) return false;

				if (typeof value === 'string') {
					return value.toLowerCase().includes(phrase.toLowerCase());
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
			return data.filter((item) => containsSearchPhrase(item, phrase));
		}

		/**
		 * Edit citation
		 */
		function citationEditCitation({citation}) {
			if (!citation.authors) {
				citation.authors = [];
			}
			console.log('citation', citation);
			let formName = 'citationRawEditForm';
			if (props.publication.citationsMetadataLookup) {
				formName = 'citationStructuredEditForm';
			}
			const {form, set, setValues, setAction} = useForm(props[formName]);
			setValues(citation);
			setAction(`${apiUrlCitations.value}/${citation.id}`);
			openSideModal(CitationEditModal, {
				title: t('submission.citations.structured.editModal.title'),
				form: form,
				onSet: set,
				citation: citation,
				onSuccess: () => {
					dataUpdateCallback();
				},
			});
		}

		/**
		 * Delete citation
		 */
		function citationDeleteCitation({citation}) {
			openDialog({
				name: 'deleteCitation',
				title: t('submission.citations.structured.deleteDialog.title'),
				message: t('submission.citations.structured.deleteDialog.confirm', {}),
				actions: [
					{
						label: t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							const {apiUrl} = useUrl(`citations`);
							const {fetch} = useFetch(`${apiUrl.value}/${citation.id}`, {
								method: 'DELETE',
							});
							await fetch();
							await dataUpdateCallback();
							close();
						},
					},
					{
						label: t('common.no'),
						isWarnable: true,
						callback: (close) => {
							close();
						},
					},
				],
			});
		}

		return {
			columns,
			topItems,
			getItemPrimaryActions,
			getItemActions,

			submission,
			publication,

			apiUrlCitations,
			apiUrlSubmissions,

			doiPrefix,

			citationsMetadataLookup,
			citationsMetadataLookupChanged,

			citationsRawToBeAdded,
			citationsRawShowMessage,
			handleAddCitationsRawToList,

			totalCitations,
			processedCitations,

			citationDeleteAllCitations,

			allRowsExpanded,
			allRowsExpandedChanged,
			toggleStatusRows,
			toggleStatusRowChanged,

			citationsFiltered,
			searchPhrase,
			setSearchPhrase,

			citationEditCitation,
			citationDeleteCitation,
		};
	},
);
