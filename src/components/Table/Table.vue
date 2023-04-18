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
				this.changeFocus(to, from);
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
				this.changeFocus(to, from);
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
				this.changeFocus(to, from);
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
				this.changeFocus(to, from);
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
				this.changeFocus(to, from);
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
				this.changeFocus(to, from);
			}
		},

		/**
		 * Move focus to the first cell in the first row
		 *
		 * Keyboard: [CTRL] + [Home]
		 *
		 * @param Event e
		 */
		focusStart(e) {
			const from = e.target.closest('td, th');
			const firstCell = this.$children.find(
				(child) => child.$options._componentTag == 'table-cell'
			);
			if (firstCell) {
				this.changeFocus(firstCell.$el, from);
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
			const from = e.target.closest('td, th');
			const lastCell = this.$children.findLast(
				(child) => child.$options._componentTag == 'table-cell'
			);
			if (lastCell) {
				this.changeFocus(lastCell.$el, from);
			}
		},

		/**
		 * Set the focus on a table cell and update
		 * the tabindex
		 *
		 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
		 * @param Element to The element to move focus to
		 * @param Element from The element losing focus
		 */
		changeFocus(to, from) {
			to.setAttribute('tabindex', 0);
			to.focus();
			from.setAttribute('tabindex', -1);
		},
	},
	mounted() {
		/**
		 * Add first cell to tab focus order
		 */
		const firstCell = this.$children.find(
			(child) => child.$options._componentTag == 'table-cell'
		);
		if (firstCell) {
			firstCell.$el.setAttribute('tabindex', 0);
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
		padding: 0.5rem;
		font-weight: @normal;
		text-align: inherit;

		&:focus {
			outline: 0;
			box-shadow: inset 0 0 0 1px @primary;
		}
	}

	tr {
		border-bottom: @grid-border;
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
