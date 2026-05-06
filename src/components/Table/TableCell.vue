<template>
	<component
		:is="isRowHeader ? 'th' : 'td'"
		v-if="!hideForRowSpan"
		ref="cellRef"
		:scope="scope"
		:rowspan="rowspan > 1 ? rowspan : null"
		class="border-b border-light text-start text-base-normal last:border-e last:pe-3"
		:class="classes"
	>
		<slot />
	</component>
</template>

<script setup>
import {defineProps, computed, ref, inject, onMounted, unref} from 'vue';

// Inject row group info from parent TableRow
const isContinuationRow = inject('isContinuationRow', false);

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
	/** Cell padding style: 'default' (p-2) or 'spacious' (p-5) */
	paddingVariant: {
		type: String,
		default: 'default',
		validator: (value) => ['default', 'spacious'].includes(value),
	},
	/** Number of rows this cell should span. When > 1, the cell renders only on the first row of the group and is omitted on continuation rows. */
	rowspan: {
		type: Number,
		default: null,
	},
});

// Cells with rowspan render once on the first row and are skipped on continuation rows
const hideForRowSpan = computed(
	() => props.rowspan > 1 && unref(isContinuationRow),
);

const scope = computed(() => {
	if (!props.isRowHeader) return null;
	return props.rowspan > 1 ? 'rowgroup' : 'row';
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

	switch (props.paddingVariant) {
		case 'spacious':
			list.push('p-5');
			break;
		default:
			list.push('p-2');
	}

	// Auto-detect if this is a continuation row (after a rowspan) - first: pseudo-class handles targeting
	if (unref(isContinuationRow)) {
		list.push('first:ps-2');
	} else {
		list.push('first:border-s first:ps-3');
	}

	return list;
});

const columnIndex = ref(-1);
const cellRef = ref(null);

onMounted(() => {
	if (cellRef.value) {
		columnIndex.value = cellRef.value.cellIndex;
	}
});
</script>
