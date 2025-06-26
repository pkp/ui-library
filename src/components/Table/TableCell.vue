<template>
	<component
		:is="isRowHeader ? 'th' : 'td'"
		ref="cellRef"
		:scope="isRowHeader ? 'row' : null"
		:headers="headersAttr.length ? headersAttr : null"
		class="border-b border-light px-2 py-2 text-start text-base-normal first:border-s first:ps-3 last:border-e last:pe-3"
		:class="classes"
	>
		<slot />
	</component>
</template>

<script setup>
import {defineProps, computed, inject, ref, onMounted} from 'vue';

const props = defineProps({
	noWrap: {
		type: Boolean,
		default: false,
	},
	fullWidthTruncated: {
		type: Boolean,
		default: false,
	},
	/** Determine which column is suitable being [rowheader](https://www.w3.org/TR/wai-aria-1.1/#rowheader) */
	isRowHeader: {
		type: Boolean,
		default() {
			return false;
		},
	},
	/** Take only width as the content needs */
	fitContent: {
		type: Boolean,
		default() {
			return false;
		},
	},
});

const classes = computed(() => {
	const list = [];
	if (props.noWrap) {
		list.push('whitespace-nowrap');
	}

	if (props.fullWidthTruncated) {
		list.push('w-full max-w-0 truncate');
	}

	if (props.fitContent) {
		list.push('whitespace-nowrap w-1');
	}

	return list;
});

const tableContext = inject('tableContext');
const groupId = inject('groupId', null);
const columnIndex = ref(-1);
const cellRef = ref(null);

onMounted(() => {
	columnIndex.value = cellRef.value.cellIndex;
});

// Attach headers attribute for complex table structures (with colgroups)
const headersAttr = computed(() =>
	[groupId ? `${tableContext.tableId}_${columnIndex.value}` : '', groupId]
		.filter(Boolean)
		.join(' '),
);
</script>
