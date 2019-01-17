<template>
	<tr>
		<th v-for="column in columns"
			:key="column.name"
			scope="col"
			:aria-sort="!!column.orderBy"
			:class="{'-isActive': orderBy === column.orderBy}"
		>
			<button v-if="column.orderBy" @click="$emit('orderBy', column)">
				{{ column.label }}
				<icon :icon="getIconDirection(column) ? 'caret-down' : 'caret-up'" class="pkpTable__sortIcon"/>
			</button>
			<template v-else>
				{{ column.label }}
			</template>
		</th>
	</tr>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {
		Icon,
	},
	props: {
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
		 * Get the correct icon (up/down) to show on sortable columns
		 *
		 * @param object column
		 * @return string `caret-down` or `caret-up`
		 */
		getIconDirection: function (column) {
			let iconDirection = column.initialOrderDirection;
			if (this.orderBy === column.orderBy) {
				iconDirection = this.orderDirection;
			}
			return iconDirection;
		},
	},
};
</script>
