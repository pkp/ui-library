<template>
	<th
		scope="col"
		:aria-sort="props.allowsSorting ? tableContext.sortDirection : undefined"
		class="border-b border-t border-light px-2 py-4 text-start text-base-normal uppercase text-heading first:border-s first:ps-3 last:border-e last:pe-3"
		:class="{
			'whitespace-nowrap': props.noTextWrap,
			'whitespace-normal break-words': !props.noTextWrap,
		}"
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
	/** Unique column identifier, required when sorting feature is used */
	id: {type: String, required: false, default: null},
	/** Enable sorting for given column */
	allowsSorting: {type: Boolean, required: false, default: () => false},
	/** Disable text wrapping in column header, set this to false if column name is too long */
	noTextWrap: {type: Boolean, required: false, default: () => true},
});

const tableContext = inject('tableContext');

onMounted(() => {
	tableContext.columnsCount.value++;
});

onUnmounted(() => {
	tableContext.columnsCount.value--;
});
</script>
