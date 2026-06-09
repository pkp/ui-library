<template>
	<component
		:is="isRowHeader ? 'th' : 'td'"
		v-if="!hideForRowSpan"
		:scope="scope"
		:rowspan="rowspan > 1 ? rowspan : null"
		class="border-b border-light text-start text-base-normal last:border-e last:pe-3"
		:class="classes"
	>
		<slot />
	</component>
</template>

<script setup>
import {defineProps, computed, inject, unref} from 'vue';

// True when covered by a rowspan — skip spanning cells and shift the first cell's border.
const isCoveredByRowSpan = inject('isCoveredByRowSpan', false);

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
	/** Number of rows this cell should span. When > 1, the cell renders only on the group's anchor row and is skipped on continuation rows. */
	rowspan: {
		type: Number,
		default: null,
	},
});

// A rowspan cell renders once on the anchor row, skipped on the rows it covers.
const hideForRowSpan = computed(
	() => props.rowspan > 1 && unref(isCoveredByRowSpan),
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

	// First cell on a covered row drops its start border
	if (unref(isCoveredByRowSpan)) {
		list.push('first:ps-2');
	} else {
		list.push('first:border-s first:ps-3');
	}

	return list;
});
</script>
