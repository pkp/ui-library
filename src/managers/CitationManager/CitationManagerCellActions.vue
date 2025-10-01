<template>
	<TableCell>
		<DropdownActions
			v-show="citationStore.canEditPublication"
			button-variant="ellipsis"
			:label="t('common.moreActions')"
			:actions="citationStore.getItemActions({citation})"
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
