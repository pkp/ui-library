<template>
	<tbody class="">
		<slot></slot>
		<slot v-if="slots['no-content'] && noContent" name="no-content" />
		<tr v-else-if="noContent" class="">
			<td
				:colspan="tableContext.columnsCount.value"
				class="border-x border-b border-light p-4 text-center text-base-normal"
			>
				{{ emptyText }}
			</td>
		</tr>
	</tbody>
</template>

<script setup>
import {useSlots, computed, inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	emptyText: {type: String, default: ''},
});
const slots = useSlots();

const {t} = useLocalize();

const tableContext = inject('tableContext');

const noContent = computed(() => {
	const defaultSlot = slots.default();

	return !defaultSlot?.[0]?.children?.length;
});

const emptyText = computed(() => {
	return props.emptyText || t('grid.noItems');
});
</script>
