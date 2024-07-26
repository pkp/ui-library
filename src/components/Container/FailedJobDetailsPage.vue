<script>
import Page from './Page.vue';
import PkpTable from '@/components/TableNext/Table.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableRow from '@/components/TableNext/TableRow.vue';

export default {
	name: 'FailedJobDetailsPage',
	components: {
		PkpTable,
		TableCell,
		TableColumn,
		TableHeader,
		TableBody,
		TableRow,
	},
	extends: Page,
	data() {
		return {
			columns: [],
			rows: [],
			label: '',
		};
	},
	methods: {
		isValidJson(value) {
			try {
				JSON.parse(value);
			} catch (e) {
				return false;
			}
			return true;
		},
	},
};
</script>

<style scoped>
.app__contentPanel__overflow {
	width: inherit !important;
	overflow: auto !important;
}
</style>
