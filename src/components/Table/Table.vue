<template>
	<div class="">
		<div
			v-if="slots.label || slots.description || slots['top-controls']"
			class="flex justify-between border-x border-t border-light bg-secondary p-4"
		>
			<div v-if="slots.label || slots.description">
				<span
					v-if="slots.label"
					:id="labelId"
					class="text-lg-bold text-heading"
				>
					<slot name="label" />
				</span>
				<div
					v-if="slots.description"
					:id="descriptionId"
					class="text-sm-normal"
				>
					<slot name="description" />
				</div>
			</div>
			<div v-if="slots['top-controls']" class="flex-shrink-0">
				<slot name="top-controls" />
			</div>
		</div>
		<table
			class="w-full max-w-full border-separate border-spacing-0"
			:aria-labelledby="labelledBy ?? (slots.label ? labelId : null)"
			:aria-describedby="
				describedBy ?? (slots.description ? descriptionId : null)
			"
		>
			<slot />
		</table>
		<div
			v-if="slots['bottom-controls']"
			class="flex justify-between border-x border-b border-light px-3 py-2"
			:class="{'bg-tertiary': isFooterDarker}"
		>
			<slot name="bottom-controls" />
		</div>
	</div>
</template>

<script setup>
import {provide, toRefs, defineEmits, ref, useSlots, computed} from 'vue';
import {useId} from '@/composables/useId.js';

const emit = defineEmits([
	/**
	 * (columnId) => applySort(columnId), columnId is passed to TableColumn as id
	 */
	'sort',
]);

function onSort(columnId) {
	emit('sort', columnId);
}

const props = defineProps({
	/** Table description for screen reader users */
	ariaLabel: {type: String, default: null},
	/** This value will be used as the `aria-labelledby` attribute for the table if there's no slot/template "label" provided. */
	labelledBy: {type: String, default: null},
	/** This value will be used as the `aria-describedby` attribute for the table if there's no slot/template "description" provided. */
	describedBy: {type: String, default: null},
	/**
	 * {column: String, direction: String}, use useSorting composable to control sortDescriptor
	 */
	sortDescriptor: {type: Object, default: null, required: false},
});

const {sortDescriptor} = toRefs(props);

const columnsCount = ref(0);
const rowCount = ref(0);

const registerRow = () => {
	rowCount.value++;
};

const unregisterRow = () => {
	rowCount.value--;
};

const isFooterDarker = computed(() => {
	return !!(rowCount.value % 2);
});

const tableContext = {
	sortDescriptor,
	onSort,
	columnsCount,
	rowCount,
	registerRow,
	unregisterRow,
};

const slots = useSlots();

const {generateId} = useId();
const labelId = slots.label ? generateId() : null;
const descriptionId = slots.description ? generateId() : null;

provide('tableContext', tableContext);
</script>

<style lang="less">
@import '../../styles/_import';

/** 
Keeping subset of table styling to support urn plugin, which inserts table via FieldHtml 
Better solution in future would be to implement custom Field, which would use our table component directly.
*/

.pkpTable {
	width: 100%;
	max-width: 100%;
	border: @grid-border;
	border-collapse: collapse;
	border-radius: @radius;
	font-size: @font-sml;
	line-height: 1.2em;

	td,
	th {
		padding: 0.5rem;
		font-weight: @normal;
		text-align: inherit;
	}

	tr {
		border-bottom: @grid-border;
	}

	caption {
		background: @bg-light;
		padding: 1rem;
		border-top-left-radius: @radius;
		border-top-right-radius: @radius;
		text-align: inherit;
	}

	thead {
		th {
			font-size: @font-tiny;
			font-weight: @bold;
		}
	}
}
</style>
