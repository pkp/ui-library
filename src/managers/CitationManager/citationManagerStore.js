import {computed} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSubmission} from '@/composables/useSubmission';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useCitationManagerConfig} from '@/managers/CitationManager/useCitationManagerConfig';

export const useCitationManagerStore = defineComponentStore(
	'citationManager',
	(props) => {
		const {getCurrentPublication} = useSubmission();

		const extender = useExtender();

		const {triggerDataChange} = useDataChanged();

		const useStructuredCitations = props.publication.useStructuredCitations;
		const citations = props.publication.citations;
		const citationsRaw = props.publication.citationsRaw;

		const citationManagerConfig = extender.addFns(useCitationManagerConfig());

		const columns = computed(() =>
			citationManagerConfig.getColumns({
				submission: props.submission
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
				// redactedForAuthors: props.redactedForAuthors,
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
