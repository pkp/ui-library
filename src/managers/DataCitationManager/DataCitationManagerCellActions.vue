<template>
	<TableCellOrder
		v-if="dataCitationManagerStore.sortingEnabled"
		class="w-28"
		@up="dataCitationManagerStore.moveUp(dataCitation.id)"
		@down="dataCitationManagerStore.moveDown(dataCitation.id)"
	/>
	<TableCell v-else>
		<DropdownActions
			button-variant="ellipsis"
			:label="t('common.moreActions')"
			:actions="dataCitationManagerStore.getItemActions()"
			@action="(actionName) => handleAction(actionName, dataCitation)"
		/>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import TableCell from '@/components/Table/TableCell.vue';
import TableCellOrder from '@/components/Table/TableCellOrder.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useDataCitationManagerStore} from './dataCitationManagerStore.js';

const {t} = useLocalize();

const props = defineProps({
	dataCitation: {type: Object, required: true},
});

const dataCitation = computed(() => props.dataCitation);

const dataCitationManagerStore = useDataCitationManagerStore();

function handleAction(actionName, dataCitation) {
	dataCitationManagerStore[actionName]({dataCitation});
}
</script>
