<template>
	<div class="previewTable">
		<h1 id="viewTableLabel">
			Example Using
			<code>labelledBy</code>
			and
			<code>describedBy</code>
		</h1>
		<p id="viewTableDescription">
			You can use the
			<code>labelledBy</code>
			and
			<code>describedBy</code>
			props to label the table with other HTML elements. See the Labelling
			section in the usage guidance below.
		</p>
		<pkp-table
			labelledBy="viewTableLabel"
			describedBy="viewTableDescription"
			v-bind="table"
		/>
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
