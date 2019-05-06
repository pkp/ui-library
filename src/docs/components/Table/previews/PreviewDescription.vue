<template>
	<div class="previewTable">
		<pkp-table v-bind="table" />
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import {props} from '../config';

export default {
	components: {
		PkpTable
	},
	data() {
		return {
			table: {
				...props,
				description:
					'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
			}
		};
	}
};
</script>
