<template>
	<th
		scope="col"
		:aria-sort="props.allowsSorting ? tableContext.sortDirection : undefined"
		class="border-b border-t border-table-heading px-2 py-4 text-start text-base-normal uppercase first:border-s first:ps-3 last:border-e last:pe-3"
	>
		<template v-if="props.allowsSorting">
			<button class="flex items-center" @click="tableContext.onSort(id)">
				<slot />
				<icon class="h-5 w-5 text-primary" icon="Sort" :aria-hidden="true" />
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
import {defineProps, inject} from 'vue';
const props = defineProps({
	/** Unique column identifier */
	id: {type: String, required: true},
	/** Enable sorting for given column */
	allowsSorting: {type: Boolean, required: false, default: () => false},
});

const tableContext = inject('tableContext');
</script>

<style lang="less">
@import '../../styles/_import';
</style>
