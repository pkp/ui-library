<template>
	<TableCellOrder
		v-if="funderManagerStore.sortingEnabled"
		class="w-28"
		@up="funderManagerStore.moveUp(funder.id)"
		@down="funderManagerStore.moveDown(funder.id)"
	/>
	<TableCell v-else>
		<DropdownActions
			v-show="funderManagerStore.canEditPublication"
			button-variant="ellipsis"
			:label="t('common.moreActions')"
			:actions="funderManagerStore.getItemActions()"
			@action="(actionName) => handleAction(actionName, funder)"
		/>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import TableCell from '@/components/Table/TableCell.vue';
import TableCellOrder from '@/components/Table/TableCellOrder.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useFunderManagerStore} from './funderManagerStore.js';

const {t} = useLocalize();

const props = defineProps({
	funder: {type: Object, required: true},
});

const funder = computed(() => props.funder);

const funderManagerStore = useFunderManagerStore();

function handleAction(actionName, funder) {
	funderManagerStore[actionName]({funder});
}
</script>
