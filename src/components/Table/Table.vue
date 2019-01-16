<template>
	<table class="pkpTable">
		<caption v-html="caption" />
		<thead>
			<slot name="header">
				<table-header
					:orderBy="orderBy"
					:orderDirection="orderDirection"
					:columns="columns"
					:rows="rows"
					@orderBy="column => setOrderBy(column)"
				/>
			</slot>
		</thead>
		<tbody
			@keydown.35.ctrl.exact.prevent="focusEnd"
			@keydown.36.ctrl.exact.prevent="focusStart"
			@keydown.35.exact.prevent="focusLastCell"
			@keydown.36.exact.prevent="focusFirstCell"
			@keydown.37.exact.prevent="focusPreviousCell"
			@keydown.38.exact.prevent="focusPreviousRow"
			@keydown.39.exact.prevent="focusNextCell"
			@keydown.40.exact.prevent="focusNextRow"
		>
			<slot name="rows">
		  	<table-row v-for="(row, rowIndex) in rows" :key="'row' + rowIndex">
					<table-cell
					 	v-for="(column, columnIndex) in columns"
						:key="column.name"
						:column="column"
						:row="row"
						:tabindex="!rowIndex && !columnIndex ? 0 : -1"
					/>
				</table-row>
			</slot>
		</tbody>
	</table>
</template>

<script>
import TableHeader from '@/components/Table/TableHeader.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';

export default {
	components: {
		TableHeader,
		TableRow,
		TableCell,
	},
	props: {
		caption: {
			type: String,
			default: '',
		},
		orderBy: {
			type: String,
			default: '',
		},
		orderDirection: {
			type: Boolean,
			default: false,
		},
		columns: Array,
		rows: Array,
	},
	methods: {
		/**
		 * Emit an event to re-order the table rows
		 *
		 * @param object column The configuration object for the column to sort on
		 */
		setOrderBy: function (column) {
			if (this.orderBy === column.orderBy) {
				this.$emit('orderBy', column.orderBy, !this.orderDirection);
			} else {
				this.$emit('orderBy', column.orderBy, column.initialOrderDirection);
			}
		},

		/**
		 * Move focus to the next cell in the row
		 *
		 * Keyboard: →
		 *
		 * @param Event e
		 */
		focusNextCell: function (e) {
			$(e.target)
				.closest('td, th')
				.next()
				.focus();
		},

		/**
		 * Move focus to the previous cell in the row
		 *
		 * Keyboard: ←
		 *
		 * @param Event e
		 */
		focusPreviousCell: function (e) {
			$(e.target)
				.closest('td, th')
				.prev()
				.focus();
		},

		/**
		 * Move focus to the same column in the next row
		 *
		 * Keyboard: ↓
		 *
		 * @param Event e
		 */
		focusNextRow: function (e) {
			const $target = $(e.target);
			const $cell = $target.closest('td');
			const $row = $cell.closest('tr');
			const columnIndex = $row.children().index($cell);
			const $nextRowCells = $row.next().children();
			if ($nextRowCells[columnIndex]) {
				$nextRowCells[columnIndex].focus();
			}
		},

		/**
		 * Move focus to the same column in the previous row
		 *
		 * Keyboard: ↑
		 *
		 * @param Event e
		 */
		focusPreviousRow: function (e) {
			const $target = $(e.target);
			const $cell = $target.closest('td');
			const $row = $cell.closest('tr');
			const columnIndex = $row.children().index($cell);
			const $prevRowCells = $row.prev().children();
			if ($prevRowCells[columnIndex]) {
				$prevRowCells[columnIndex].focus();
			}
		},

		/**
		 * Move focus to the first cell in the row
		 *
		 * Keyboard: [Home]
		 *
		 * @param Event e
		 */
		focusFirstCell: function (e) {
			$(e.target)
				.parents('tr')
				.children('td, th')
				.first()
				.focus();
		},

		/**
		 * Move focus to the last cell in the row
		 *
		 * Keyboard: [End]
		 *
		 * @param Event e
		 */
		focusLastCell: function (e) {
			$(e.target)
				.parents('tr')
				.children('td, th')
				.last()
				.focus();
		},

		/**
		 * Move focus to the first cell in the first row
		 *
		 * Keyboard: [CTRL] + [Home]
		 *
		 * @param Event e
		 */
		focusStart: function (e) {
			$(e.target)
				.parents('tbody')
				.children('tr')
				.first()
				.children('td, th')
				.first()
				.focus();
		},

		/**
		 * Move focus to the last cell in the last row
		 *
		 * Keyboard: [CTRL] + [End]
		 *
		 * @param Event e
		 */
		focusEnd: function (e) {
			$(e.target)
				.parents('tbody')
				.children('tr')
				.last()
				.children('td, th')
				.last()
				.focus();
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

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
		text-align: left;

		&:focus {
			outline: 0;
			box-shadow: inset 0 0 0 1px @primary;
		}
	}

	tr {
		border-bottom: @grid-border;
	}

	thead {

		th {
			font-size: @font-tiny;
			font-weight: @bold;
		}

		// Sortable columns
		th[aria-sort="true"] {
			padding: 0;

			button {
				position: relative;
				margin: 0;
				padding: 0.5rem;
				border: none;
				border-radius: @radius;
				background: transparent;
				box-shadow: none;
				font-size: @font-tiny;
				font-weight: @bold;
				line-height: 1.2em;
				text-align: left;
				cursor: pointer;

				&:focus {
					outline: 0;
					box-shadow: inset 0 0 0 1px @primary;
				}

				.fa {
					display: none;
				}
			}

			&.-isActive,
			button:hover,
			button:focus {

				.fa {
					display: inline-block;
					margin-left: 0.25em;
					color: @primary;
				}
			}
		}
	}
}
</style>
