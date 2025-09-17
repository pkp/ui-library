<template>
	<TableCell>
		<DropdownActions
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="citationStore.getItemActions({citationStore, citation})"
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

const {t} = useLocalize();

const props = defineProps({
	citation: {type: Object, required: true},
});

const citation = computed(() => props.citation);

const citationStore = useCitationManagerStore();

function handleAction(actionName, citation) {
	citationStore[actionName]({citation});
}
</script>
