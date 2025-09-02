<template>
	<TableCell>
		<DropdownActions
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			@action="(actionName) => handleAction(actionName, citation)"
		/>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useCitationManagerStore} from './citationManagerStore';
import {Actions} from '@/managers/CitationManager/useCitationManagerActions';

const {t} = useLocalize();

const props = defineProps({
	citation: {type: Object, required: true},
});

const citation = computed(() => props.citation);

const citationStore = useCitationManagerStore();

const itemActions = computed(() => {
	const actions = citationStore.getItemActions();
	if (citationStore.citationsMetadataLookup) {
		return actions;
	} else {
		let newActions = [];
		actions.forEach((action) => {
			if (action.name !== Actions.CITATION_ADD_JOB) {
				newActions.push(action);
			}
		});
		return newActions;
	}
});

function handleAction(actionName, citation) {
	citationStore[actionName]({citation});
}
</script>
