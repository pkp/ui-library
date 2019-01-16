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
				<icon :icon="orderDirection ? 'caret-down' : 'caret-up'" />
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
};
</script>
