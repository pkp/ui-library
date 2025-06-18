<template>
	<component
		:is="isRowHeader ? 'th' : 'td'"
		:id="id"
		:scope="scope"
		:colspan="colspan"
		class="border-b border-light px-2 py-2 text-start first:border-s first:ps-3 last:border-e last:pe-3"
		:class="classes"
	>
		<slot />
	</component>
</template>

<script setup>
import {defineProps, computed} from 'vue';

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
	colspan: {
		type: Number,
		default: undefined,
	},
	id: {
		type: String,
		default: undefined,
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

	if (props.colspan) {
		list.push('bg-tertiary text-lg-medium text-secondary');
	} else {
		list.push('text-base-normal');
	}

	return list;
});

const scope = computed(() => {
	if (props.colspan) {
		return 'colgroup';
	}

	if (props.isRowHeader) {
		return 'row';
	}

	return undefined;
});
</script>
