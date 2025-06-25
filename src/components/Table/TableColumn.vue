<template>
	<th
		:id="columnId"
		scope="col"
		:aria-sort="props.allowsSorting ? tableContext.sortDirection : undefined"
		class="whitespace-nowrap border-b border-t border-light px-2 py-4 text-start text-base-normal uppercase text-heading first:border-s first:ps-3 last:border-e last:pe-3"
	>
		<template v-if="props.allowsSorting">
			<button
				class="flex items-center uppercase"
				@click="tableContext.onSort(id)"
			>
				<slot />
				<Icon class="h-5 w-5 text-primary" icon="Sort" :aria-hidden="true" />
				<span class="-screenReader">
					{{ t('grid.action.sort') }}
				</span>
			</button>
		</template>
		<template v-else>
			<slot />
		</template>
	</th>
</template>

<script setup>
import {defineProps, inject, onMounted, onUnmounted, ref, computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	/** Unique column identifier, required when sorting feature is used */
	id: {type: String, required: false, default: null},
	/** Enable sorting for given column */
	allowsSorting: {type: Boolean, required: false, default: () => false},
});

const tableContext = inject('tableContext');
const currentColumnId = ref('');

// Generate a columnId only if the table is using a complex structure (with colgroups).
// This is used for accessibility attributes like <th :id="..." /> and <td headers="..." />.
const columnId = computed(() => {
	return tableContext.hasGroups.value ? currentColumnId.value : undefined;
});

onMounted(() => {
	currentColumnId.value = `${tableContext.tableId}_${tableContext.columnsCount.value}`;
	tableContext.columnsCount.value++;
});

onUnmounted(() => {
	tableContext.columnsCount.value--;
});
</script>
