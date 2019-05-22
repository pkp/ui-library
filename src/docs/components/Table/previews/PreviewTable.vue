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
			table: {...props}
		};
	}
};
</script>
