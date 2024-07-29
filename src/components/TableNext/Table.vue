<template>
	<table
		class="pkpTable w-full max-w-full border-separate border-spacing-0"
		:aria-label="ariaLabel"
	>
		<slot />
	</table>
</template>

<script setup>
import {provide, toRefs, defineEmits, ref} from 'vue';

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
	ariaLabel: {type: String, required: true},
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

provide('tableContext', tableContext);
</script>
