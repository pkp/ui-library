<template>
	<table class="pkpTable" role="grid">
		<caption v-if="$slots.caption">
			<slot name="caption" />
		</caption>
		<thead v-if="$slots.head">
			<tr>
				<slot name="head" />
			</tr>
		</thead>
		<tbody
			@keydown.35.ctrl.exact.prevent="focusEnd"
			@keydown.36.ctrl.exact.prevent="focusStart"
			@keydown.35.exact.prevent="focusLastCell"
			@keydown.36.exact.prevent="focusFirstCell"
			@keydown.left.exact.prevent="focusPreviousCell"
			@keydown.up.exact.prevent="focusPreviousRow"
			@keydown.right.exact.prevent="focusNextCell"
			@keydown.down.exact.prevent="focusNextRow"
		>
			<slot />
		</tbody>
	</table>
</template>

<script>
/**
 * Tracks which cell has tabindex="0" before
 * the table is updated. This is used to reset
 * the tabindex on that cell after the table is
 * updated.
 */
let tabindexCell;

export default {
	methods: {
		/**
		 * Move focus to the next cell in the row
		 *
		 * Keyboard: →
		 *
		 * @param Event e
		 */
		focusNextCell(e) {
			const from = e.target.closest('td, th');
			const to = from.nextElementSibling;
			if (to) {
				this.changeFocus(to);
			}
		},

		/**
		 * Move focus to the previous cell in the row
		 *
		 * Keyboard: ←
		 *
		 * @param Event e
		 */
		focusPreviousCell(e) {
			const from = e.target.closest('td, th');
			const to = from.previousElementSibling;
			if (to) {
				this.changeFocus(to);
			}
		},

		/**
		 * Move focus to the same column in the next row
		 *
		 * Keyboard: ↓
		 *
		 * @param Event e
		 */
		focusNextRow(e) {
			const from = e.target.closest('td, th');
			const row = from.closest('tr');
			const columnIndex = Array.from(row.children).indexOf(from);
			const nextRow = row.nextElementSibling;
			if (!nextRow) {
				return;
			}
			const to = nextRow.children[columnIndex];
			if (to) {
				this.changeFocus(to);
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
			const from = e.target.closest('td, th');
			const row = from.closest('tr');
			const columnIndex = Array.from(row.children).indexOf(from);
			const previousRow = row.previousElementSibling;
			if (!previousRow) {
				return;
			}
			const to = previousRow.children[columnIndex];
			if (to) {
				this.changeFocus(to);
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
			const from = e.target.closest('td, th');
			const row = from.closest('tr');
			const to = row.children[0];
			if (to) {
				this.changeFocus(to);
			}
		},

		/**
		 * Move focus to the last cell in the row
		 *
		 * Keyboard: [End]
		 *
		 * @param Event e
		 */
		focusLastCell(e) {
			const from = e.target.closest('td, th');
			const row = from.closest('tr');
			const to = row.children[row.children.length - 1];
			if (to) {
				this.changeFocus(to);
			}
		},

		/**
		 * Move focus to the first cell in the first row
		 *
		 * Keyboard: [CTRL] + [Home]
		 *
		 * @param Event e
		 */
		focusStart() {
			const firstCell = this.$children.find(
				(child) => child.$options._componentTag == 'table-cell'
			);
			if (firstCell) {
				this.changeFocus(firstCell.$el);
			}
		},

		/**
		 * Move focus to the last cell in the last row
		 *
		 * Keyboard: [CTRL] + [End]
		 *
		 * @param Event e
		 */
		focusEnd(e) {
			const lastCell = this.$children.findLast(
				(child) => child.$options._componentTag == 'table-cell'
			);
			if (lastCell) {
				this.changeFocus(lastCell.$el);
			}
		},

		/**
		 * Set the focus on a table cell and update
		 * the tabindex
		 *
		 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
		 * @param Element to The element to move focus to
		 */
		changeFocus(to) {
			this.$children
				.filter((child) => {
					return (
						child.$options._componentTag == 'table-cell' &&
						child.$el.getAttribute('tabindex') == 0
					);
				})
				.forEach((child) => child.$el.setAttribute('tabindex', -1));
			to.setAttribute('tabindex', 0);
			to.focus();
		},

		/**
		 * Set the tabindex on the first cell in the table
		 */
		setTabindexToFirstCell() {
			const firstCell = this.$children.find(
				(child) => child.$options._componentTag == 'table-cell'
			);
			if (firstCell) {
				firstCell.$el.setAttribute('tabindex', 0);
			}
		},
	},
	mounted() {
		this.setTabindexToFirstCell();
	},
	beforeUpdate() {
		/**
		 * Store the cell in the tab focus order to restore
		 * the tabindex after update
		 */
		tabindexCell = this.$children.find((child) => {
			return (
				child.$options._componentTag == 'table-cell' &&
				child.$el.getAttribute('tabindex') == 0
			);
		});
	},
	updated() {
		/**
		 * Restore tabindex to the cell that was enabled
		 * before the update
		 */
		tabindexCell = this.$children.find(
			(child) => child._uid === tabindexCell._uid
		);
		if (tabindexCell) {
			tabindexCell.$el.setAttribute('tabindex', 0);
		} else {
			this.setTabindexToFirstCell();
		}
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
		padding: 0.75rem;
		font-weight: @normal;
		text-align: inherit;

		&:focus {
			outline: 0;
			box-shadow: inset 0 0 0 1px @primary;
		}
	}

	tr {
		border-bottom: @grid-border;

		&:nth-child(even) {
			background: @bg-very-light;
		}
	}

	caption {
		padding: 0.5rem 0;
		border-top-left-radius: @radius;
		border-top-right-radius: @radius;
		text-align: inherit;

		/**
		* Override padding for Header components inside
		* the caption
		*/
		.pkpHeader {
			padding: 0;
		}
	}

	thead {
		th {
			font-size: @font-tiny;
			font-weight: @bold;
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
