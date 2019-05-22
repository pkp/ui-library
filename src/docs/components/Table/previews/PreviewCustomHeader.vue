<template>
	<div class="previewTable">
		<pkp-table v-bind="table">
			<icon slot="thead-pdf" icon="exclamation-triangle" />
		</pkp-table>
	</div>
</template>

<script>
import PkpTable from '@/components/Table/Table.vue';
import Icon from '@/components/Icon/Icon.vue';
import {props} from '../config';

export default {
	components: {
		PkpTable,
		Icon
	},
	data() {
		return {
			table: {
				...props,
				description:
					'This table uses the <code>header</code> slot to customize the PDF column header.'
			}
		};
	}
};
</script>
