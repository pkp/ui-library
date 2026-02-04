<template>
	<th
		v-if="!isContinuationRow"
		scope="rowgroup"
		:rowspan="rowspan > 1 ? rowspan : null"
		class="border-b border-light p-2 text-start text-base-normal first:border-s first:ps-3 last:border-e last:pe-3"
	>
		<slot />
	</th>
</template>

<script setup>
import {inject} from 'vue';

const isContinuationRow = inject('isContinuationRow', false);

defineProps({
	/** Number of rows this cell should span */
	rowspan: {
		type: Number,
		default: null,
	},
});
</script>
