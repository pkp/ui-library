<template>
	<th
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
import {defineProps, inject, onMounted, onUnmounted} from 'vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	/** Unique column identifier */
	id: {type: String, required: true},
	/** Enable sorting for given column */
	allowsSorting: {type: Boolean, required: false, default: () => false},
});

const tableContext = inject('tableContext');

onMounted(() => {
	tableContext.columnsCount.value++;
});

onUnmounted(() => {
	tableContext.columnsCount.value--;
});
</script>
