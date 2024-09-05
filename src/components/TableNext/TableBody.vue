<template>
	<tbody class="">
		<slot></slot>
		<tr v-if="noContent">
			<td
				:colspan="tableContext.columnsCount.value"
				class="border-x border-b border-light p-5 text-base-normal"
			>
				<slot v-if="slots['no-content']" name="no-content" />
				<span v-else>{{ emptyText }}</span>
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
