<template>
	<div
		v-if="slots.label || slots.description || slots['top-controls']"
		class="flex justify-between bg-default p-4"
	>
		<div v-if="slots.label || slots.description">
			<span v-if="slots.label" :id="labelId" class="text-xl-bold">
				<slot name="label" />
			</span>
			<div v-if="slots.description" :id="descriptionId">
				<slot name="description" />
			</div>
		</div>
		<div v-if="slots['top-controls']">
			<slot name="top-controls" />
		</div>
	</div>
	<table
		class="w-full max-w-full border-separate border-spacing-0"
		:aria-labelledby="labelId"
		:aria-describedby="descriptionId"
	>
		<slot />
	</table>
	<div v-if="slots['bottom-controls']" class="flex justify-between py-4">
		<slot name="bottom-controls" />
	</div>
</template>

<script setup>
import {provide, toRefs, defineEmits, ref, useSlots} from 'vue';
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

const tableContext = {
	sortDescriptor,
	onSort,
	columnsCount,
};

const slots = useSlots();

const {generateId} = useId();
const labelId = slots.label ? generateId() : props.labelledBy;
const descriptionId = slots.description ? generateId() : props.describedBy;

provide('tableContext', tableContext);
</script>
