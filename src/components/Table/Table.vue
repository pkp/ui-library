<template>
	<table class="pkpTable">
		<caption v-html="caption" />
		<thead>
			<tr>
				<th v-for="column in columns"
					:key="column.name"
					:aria-sort="!!column.orderBy"
					:scope="column.scope ? column.scope
					: 'col'"
				>
					<button v-if="column.orderBy" @click="setOrderBy(column)">
						{{ column.label }}
						<icon
							v-if="orderBy === column.orderBy"
							:icon="orderDirection ? 'caret-down' : 'caret-up'"
						/>
					</button>
					<template v-else>
						{{ column.label }}
					</template>
				</th>
			</tr>
		</thead>
		<tbody>
		  <tr
		    v-for="(row, rowIndex) in rows"
		    :key="rowIndex"
		  >
		    <!-- We have a slot for each todo, passing it the -->
		    <!-- `todo` object as a slot prop.                -->
		    <slot name="row" :row="row" :getCellClasses="getCellClasses">
					<component
						v-for="(column, columnIndex) in columns"
						:is="column.isRowHeader ? 'th' : 'td'"
						:key="column.name"
						:scope="column.isRowHeader ? 'row' : false"
						:tabindex="!rowIndex && !columnIndex ? 0 : -1"
						:class="getCellClasses(row, column)"
						v-html="typeof column.value === 'function' ? column.value(row) : row[column.value]"
					/>
		    </slot>
		  </tr>
		</tbody>
	</table>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {
		Icon,
	},
	props: {
		caption: String,
		orderBy: String,
		orderDirection: Boolean,
		columns: Array,
		rows: Array,
	},
	computed: {
		hasRowSlot: function () {
			console.log(this.$slots);
			return this.$slots.row;
		},
	},
	methods: {
		/**
		 * Compile classes to apply to a row's cell element
		 *
		 * @param object row The data set for the row
		 * @param object column The configuration object for the column
		 * @return array
		 */
		getCellClasses: function (row, column) {
			let classes = [];

			if (column.truncate) {
				classes.push('pkpTable__cell--truncate');
				classes.push('pkpTable__cell--truncate' + column.truncate);
			}

			return classes;
		},

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
			box-shadow: inset 0 0 0 2px @primary;
		}
	}

	thead th {
		font-size: @font-tiny;
		font-weight: @bold;
	}

	tr {
		border-bottom: @grid-border;
	}

	.pkpTable__cell--truncate {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		max-width: 20em;
	}

	.pkpTable__cell--truncatesmall {
		max-width: 10em;
	}

	.pkpTable__cell--truncatelarge {
		max-width: 40em;
	}

	th[aria-sort="true"] {
		padding: 0;

		button {
			position: relative;
			margin: 0;
			padding: 0.5rem;
			border: none;
			background: transparent;
			box-shadow: none;
			font-size: @font-tiny;
			font-weight: @bold;
			line-height: 1.2em;
			text-align: left;
			cursor: pointer;

			&:focus {
				outline: 0;
				box-shadow: inset 0 0 0 2px @primary;
			}

			.fa {
				margin-left: 0.25em;
				color: @primary;
			}
		}
	}
}
</style>
