<template>
	<table class="pkpTable">
		<caption v-html="caption" />
		<slot name="header">
			<table-header
				:orderBy="orderBy"
				:orderDirection="orderDirection"
				:columns="columns"
				:rows="rows"
				@orderBy="column => setOrderBy(column)"
			/>
		</slot>
		<slot name="rows">
			<tbody>
		  	<table-row v-for="(row, rowIndex) in rows" :key="'row' + rowIndex">
					<table-cell
					 	v-for="(column, columnIndex) in columns"
						:key="column.name"
						:column="column"
						:row="row"
						:tabindex="!rowIndex && !columnIndex ? 0 : -1"
					/>
				</table-row>
			</tbody>
		</slot>
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
