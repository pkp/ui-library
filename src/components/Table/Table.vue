<template>
	<table
		class="pkpTable"
		role="grid"
		:aria-labelledBy="labelledBy ? labelledBy : false"
		:aria-describedBy="describedBy ? describedBy : false"
	>
		<caption v-if="label || description">
			<div v-if="label" class="pkpTable__label">{{ label }}</div>
			<div
				v-if="description"
				class="pkpTable__description"
				v-html="description"
			/>
		</caption>
		<thead>
			<tr>
				<th
					v-for="column in columns"
					:key="column.name"
					scope="col"
					:aria-sort="!!column.orderBy"
					:class="{'-isActive': orderBy === column.orderBy}"
				>
					<button v-if="column.orderBy" @click="setOrderBy(column)">
						{{ column.label }}
						<icon
							:icon="getIconDirection(column) ? 'caret-down' : 'caret-up'"
							class="pkpTable__sortIcon"
						/>
					</button>
					<template v-else>
						{{ column.label }}
					</template>
					<slot :name="'thead-' + column.name" :column="column" />
				</th>
			</tr>
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
			<tr
				v-for="(row, rowIndex) in rows"
				:key="'row' + rowIndex"
				class="pkpTable__row"
			>
				<slot :row="row" :rowIndex="rowIndex">
					<table-cell
						v-for="(column, columnIndex) in columns"
						:key="column.name"
						:column="column"
						:row="row"
						:tabindex="!rowIndex && !columnIndex ? 0 : -1"
					></table-cell>
				</slot>
			</tr>
		</tbody>
	</table>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import TableCell from '@/components/Table/TableCell.vue';

export default {
	components: {
		Icon,
		TableCell
	},
	props: {
		columns: {
			type: Array,
			default() {
				return [];
			}
		},
		describedBy: {
			type: String,
			default() {
				return '';
			}
		},
		description: {
			type: String,
			default() {
				return '';
			}
		},
		label: {
			type: String,
			default() {
				return '';
			}
		},
		labelledBy: {
			type: String,
			default() {
				return '';
			}
		},
		orderBy: {
			type: String,
			default() {
				return '';
			}
		},
		orderDirection: {
			type: Boolean,
			default() {
				return false;
			}
		},
		rows: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		/**
		 * Emit an event to re-order the table rows
		 *
		 * @param object column The configuration object for the column to sort on
		 */
		setOrderBy(column) {
			if (this.orderBy === column.orderBy) {
				this.$emit('order-by', column.orderBy, !this.orderDirection);
			} else {
				this.$emit('order-by', column.orderBy, column.initialOrderDirection);
			}
		},

		/**
		 * Get the correct icon (up/down) to show on sortable columns
		 *
		 * @param object column
		 * @return boolean
		 */
		getIconDirection(column) {
			if (this.orderBy === column.orderBy) {
				return this.orderDirection;
			} else if (column.initialOrderDirection !== null) {
				return column.initialOrderDirection;
			}
			return false;
		},

		/**
		 * Move focus to the next cell in the row
		 *
		 * Keyboard: →
		 *
		 * @param Event e
		 */
		focusNextCell(e) {
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
		focusPreviousCell(e) {
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
		focusNextRow(e) {
			const $target = $(e.target);
			const $cell = $target.closest('td, th');
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
		focusPreviousRow(e) {
			const $target = $(e.target);
			const $cell = $target.closest('td, th');
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
		focusFirstCell(e) {
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
		focusLastCell(e) {
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
		focusStart(e) {
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
		focusEnd(e) {
			$(e.target)
				.parents('tbody')
				.children('tr')
				.last()
				.children('td, th')
				.last()
				.focus();
		}
	}
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

	caption {
		background: @bg-light;
		padding: 1rem;
		border-top-left-radius: @radius;
		border-top-right-radius: @radius;
		text-align: left;
	}

	thead {
		th {
			font-size: @font-tiny;
			font-weight: @bold;
		}

		// Sortable columns
		th[aria-sort='true'] {
			padding: 0;

			button {
				position: relative;
				margin: 0;
				padding: 0.5rem 16px 0.5rem 0.5rem;
				border: none;
				border-radius: @radius;
				background: transparent;
				box-shadow: none;
				font-size: @font-tiny;
				font-weight: @bold;
				line-height: 1.2em;
				text-align: left;
				color: @text;
				cursor: pointer;

				&:focus {
					outline: 0;
					box-shadow: inset 0 0 0 1px @primary;
				}
			}
		}

		.pkpTable__sortIcon {
			visibility: hidden;
			position: absolute;
			top: 50%;
			right: 4px;
			transform: translateY(-50%);
		}

		&:hover .pkpTable__sortIcon {
			visibility: visible;
			color: @bg-dark;
		}

		th[aria-sort='true'].-isActive .pkpTable__sortIcon,
		th[aria-sort='true']:hover .pkpTable__sortIcon,
		th[aria-sort='true']:focus .pkpTable__sortIcon {
			visibility: visible;
			margin-left: 0.25em;
			color: @primary;
		}
	}
}

.pkpTable__label {
	font-size: @font-base;
	font-weight: @bold;
}

.pkpTable__description {
	max-width: 50em;
	line-height: 1.6em;
}

.pkpTable__label + .pkpTable__description {
	margin-top: 1rem;
}

// A pagination component appearing directly after the table
.pkpTable + .pkpPagination {
	padding: 0;
	border: @grid-border;
	border-top: none;
	border-radius: @radius;

	button {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	li:first-child,
	li:last-child {
		margin: 0;

		button,
		button {
			margin: 0;
			padding: 0.5rem 1rem;
			border-color: transparent;
			box-shadow: none;
			border-radius: 0;

			&:hover,
			&:focus {
				border-color: @primary;
			}
		}
	}

	li:first-child button {
		border-right: @grid-border;
		border-bottom-left-radius: @radius;

		&[disabled]:hover {
			border-color: transparent;
			border-right: @grid-border;
		}
	}

	li:last-child button {
		border-left: @grid-border;
		border-bottom-right-radius: @radius;

		&[disabled]:hover {
			border-color: transparent;
			border-left: @grid-border;
		}
	}
}
</style>
