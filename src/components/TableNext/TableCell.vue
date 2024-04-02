<template>
	<component
		:is="isRowHeader ? 'th' : 'td'"
		:scope="isRowHeader ? 'row' : false"
		class="border-b border-t border-light px-2 py-2 text-start first:border-s first:ps-3 last:border-e last:pe-3"
	>
		<slot />
	</component>
</template>

<script setup>
import {defineProps} from 'vue';

defineProps({
	/** Determine which column is suitable being [rowheader](https://www.w3.org/TR/wai-aria-1.1/#rowheader) */
	isRowHeader: {
		type: Boolean,
		default() {
			return false;
		},
	},
});
</script>
