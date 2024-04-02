<template>
	<table
		class="w-full max-w-full border-separate border-spacing-0"
		:aria-label="ariaLabel"
	>
		<slot />
	</table>
</template>

<script setup>
import {provide, toRefs, defineEmits} from 'vue';

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

const tableContext = {
	sortDescriptor,
	onSort,
};

provide('tableContext', tableContext);
</script>

<style lang="less">
@import '../../styles/_import';

.pkpTableNext {
	width: 100%;
	max-width: 100%;
	border: @grid-border;
	border-collapse: collapse;
	border-radius: 10px;
	font-size: @font-sml;
	line-height: 1.2em;

	td,
	th {
		padding: 0.5rem 1rem;
		font-weight: @normal;
		text-align: inherit;

		&:focus {
			outline: 0;
			box-shadow: inset 0 0 0 1px @primary;
		}
	}

	tr {
		&:nth-child(even) {
			background: @bg-very-light;
		}
	}

	thead {
		tr {
			background: @table-header;
		}

		th {
			font-size: @font-tiny;
			font-weight: @semibold;
			text-transform: uppercase;
		}
	}
}

[dir='rtl'] {
	.pkpTable {
		thead {
			.pkpTable__sortIcon {
				right: auto;
				left: 4px;
			}
		}
	}
}

.pkpTable + .pkpPagination {
	margin-top: 1rem;
}
</style>
