<template>
	<th
		scope="col"
		:aria-sort="props.allowsSorting ? tableContext.sortDirection : undefined"
		class="bg-light px-2 py-4 text-left text-base-normal uppercase text-light first:pl-3 last:pr-3"
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
