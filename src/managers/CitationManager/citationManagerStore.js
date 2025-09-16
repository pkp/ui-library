import {computed, onMounted, reactive, ref, toRefs} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from "@/composables/useUrl";
import {useModal} from '@/composables/useModal';
import {useFetch} from '@/composables/useFetch';
import {useCitationManagerConfig} from './useCitationManagerConfig';
import {useCitationManagerActions} from "./useCitationManagerActions";

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

        /**
         * constants
         */
        const doiPrefix = 'https://doi.org';
        const apiPathCitations = 'citations';
        const apiPathSubmissions = `submissions/${submission.value.id}/publications/${publication.value.id}/citations`;

        /**
         * citations metadata lookup
         */
        const currentCitationsMetadataLookup = ref(false);
        const citationsMetadataLookup = computed(
            () => publication.value.citationsMetadataLookup,
        );

        function citationsMetadataLookupChanged() {
            let title = t('submission.citations.structured.disableModal.title');
            let message = t('submission.citations.structured.disableModal.confirm');
            if (currentCitationsMetadataLookup.value) {
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
                        callback: async (close) => {
                            const {apiUrl} = useUrl(apiPathSubmissions);
                            const {fetch} = useFetch(
                                `${apiUrl.value}/metadataLookup`,
                                {
                                    method: 'PUT',
                                    body: {
                                        citationsMetadataLookup:
                                        currentCitationsMetadataLookup.value,
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
                            currentCitationsMetadataLookup.value =
                                !currentCitationsMetadataLookup.value;
                            close();
                        },
                    },
                ],
                close: () => {
                },
            });
        }

        onMounted(() => {
            if (publication.value.citationsMetadataLookup === null) {
                if (submission.value.contextCitationsMetadataLookup) {
                    currentCitationsMetadataLookup.value =
                        submission.value.contextCitationsMetadataLookup;
                    publication.value.citationsMetadataLookup =
                        submission.value.contextCitationsMetadataLookup;
                } else {
                    currentCitationsMetadataLookup.value = false;
                }
            } else {
                currentCitationsMetadataLookup.value =
                    publication.value.citationsMetadataLookup;
            }
        });

        /**
         * add new raw citations
         */
        const citationsRawToBeAdded = ref('');
        const citationsRawShowMessage = ref('');

        async function handleAddCitationsRawToList() {
            const {apiUrl} = useUrl(apiPathSubmissions);
            const {fetch, data} = useFetch(
                `${apiUrl.value}/importAdditionalCitations`,
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
                        isWarnable: true,
                        callback: async (close) => {
                            const {apiUrl} = useUrl(apiPathSubmissions);
                            const {fetch} = useFetch(
                                `${apiUrl.value}/deleteCitationsByPublicationId`,
                                {method: 'DELETE'},
                            );
                            await fetch();
                            await dataUpdateCallback();
                            close();
                        },
                    },
                    {
                        label: t('common.no'),
                        isPrimary: true,
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
            citationManagerActions.citationEditCitation(
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

            currentCitationsMetadataLookup,
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
            citationReprocessCitation,
        };
    },
);
