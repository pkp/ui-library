<template>
	<component
		:is="isRowHeader ? 'th' : 'td'"
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
const registerCell = inject('registerCell');
const columnIndex = ref(0);
const currentColGroupId = ref('');

onMounted(() => {
	if (registerCell) {
		columnIndex.value = registerCell();
	}
	currentColGroupId.value = tableContext.currentColGroupId.value;
});

// Attach headers attribute for complex table structures (with colgroups)
const headersAttr = computed(() =>
	[
		tableContext.currentColGroupId.value
			? `${tableContext.tableId}_${columnIndex.value}`
			: '',
		currentColGroupId.value,
	]
		.filter(Boolean)
		.join(' '),
);
</script>
