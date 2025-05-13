import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSubmission} from '@/composables/useSubmission';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useCitationManagerConfig} from '@/managers/CitationManager/useCitationManagerConfig';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';

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

		const useStructuredCitations = props.publication.useStructuredCitations;
		const citations = props.publication.citations;
		const citationsRaw = props.publication.citationsRaw;

		const columns = computed(() =>
			citationManagerConfig.getColumns({
				submission: props.submission,
				publication: props.publication
			}),
		);

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
				publication: props.publication
			}),
		);

		return {
			useStructuredCitations,
			citations,
			citationsRaw,

			/** Config */
			getCellStatusItems,
			columns,
			getItemActions,
			getItemPrimaryActions,
			topItems,

			/** Extender */
			extender,
			props,
		};
	},
);
