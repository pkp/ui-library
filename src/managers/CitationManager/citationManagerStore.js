import {computed, ref} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSubmission} from '@/composables/useSubmission';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useCitationManagerConfig} from '@/managers/CitationManager/useCitationManagerConfig';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';

export const useCitationManagerStore = defineComponentStore(
	'citationManager',
	(props) => {
		const {getCurrentPublication} = useSubmission();
		const {t} = useLocalize();
		const extender = useExtender();
		const {triggerDataChange} = useDataChanged();

		const citationManagerConfig = extender.addFns(useCitationManagerConfig());

		const {apiUrl: publicationApiUrlFormat} = useUrl(
			`submissions/${props.submission.id}/publications/__publicationId__`,
		);

		const useStructuredCitations = computed({
			get: () => props.publication.useStructuredCitations,
			set: (newVal) => (props.publication.useStructuredCitations = newVal),
		});
		const citations = computed({
			get: () => props.publication.citations,
			set: (newVal) => (props.publication.citations = newVal),
		});
		const citationsRaw = computed({
			get: () => props.publication.citationsRaw,
			set: (newVal) => (props.publication.citationsRaw = newVal),
		});

		const isAllRowsExpanded = ref(false);
		const citationsRawToBeAdded = ref('');

		const columns = computed(() =>
			citationManagerConfig.getColumns({
				submission: props.submission,
				publication: props.publication,
			}),
		);

		function dataUpdateCallback() {
			triggerDataChange();
		}

		function getCellStatusItems(args) {
			return citationManagerConfig.getCellStatusItems(args);
		}

		function getItemActions(args) {
			return citationManagerConfig.getItemActions(args);
		}

		function getItemPrimaryActions(args) {
			return citationManagerConfig.getItemPrimaryActions(args);
		}

		const topItems = computed(() =>
			citationManagerConfig.getTopItems({
				submission: props.submission,
				publication: props.publication,
			}),
		);

		function toggleAllExpanded() {
			isAllRowsExpanded.value = !isAllRowsExpanded.value;
		}

		function updateUseStructuredCitations() {
			if (!useStructuredCitations.value) {
				const {openDialog} = useModal();
				openDialog({
					name: 'disableUseStructuredCitations',
					title: t('submission.citations.structured.disableModal.title', {}),
					message: t(
						'submission.citations.structured.disableModal.message',
						{},
					),
					actions: [
						{
							label: t('common.yes', {}),
							isWarnable: true,
							callback: async (close) => {
								// dataUpdateCallback(); // todo: not working
								close();
							},
						},
						{
							label: t('common.no', {}),
							isPrimary: true,
							callback: (close) => {
								useStructuredCitations.value = true;
								close();
							},
						},
					],
					close: () => {},
				});
			} else {
				// dataUpdateCallback(); // todo: not working
			}
		}

		function handleAddCitationsRawToList() {
			// split rows by EOL
			// add to citationStore.citations
			// save new lines to database
			citationsRawToBeAdded.value = '';
			console.log(citationsRawToBeAdded.value);
		}

		function citationEditCitation(){
			console.log('citationEditCitation');
		}

		function citationDeleteCitation(){
			console.log('citationDeleteCitation');
		}

		return {
			/** Variables */
			useStructuredCitations,
			citations,
			citationsRaw,
			isAllRowsExpanded,
			citationsRawToBeAdded,

			/** Config */
			getCellStatusItems,
			columns,
			getItemActions,
			getItemPrimaryActions,
			topItems,

			/** Actions */
			citationEditCitation,
			citationDeleteCitation,

			/** Extender */
			extender,
			props,

			/** Functions */
			updateUseStructuredCitations,
			handleAddCitationsRawToList,
			toggleAllExpanded,
		};
	},
);
