<template>
	<tbody class="">
		<slot></slot>
		<tr v-if="!tableContext.rowCount.value">
			<TableCell
				:colspan="tableContext.columnsCount.value"
				padding-variant="spacious"
			>
				<slot v-if="slots['no-content']" name="no-content" />
				<span v-else>{{ emptyText }}</span>
			</TableCell>
		</tr>
	</tbody>
</template>

<script setup>
import {useSlots, computed, inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import TableCell from './TableCell.vue';

const props = defineProps({
	emptyText: {type: String, default: ''},
});
const slots = useSlots();

const {t} = useLocalize();

const tableContext = inject('tableContext');

const emptyText = computed(() => {
	return props.emptyText || t('grid.noItems');
});
</script>
