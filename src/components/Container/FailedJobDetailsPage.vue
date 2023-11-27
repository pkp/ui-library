<script>
import Page from './Page.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';

export default {
	name: 'FailedJobDetailsPage',
	components: {
		PkpTable,
		TableCell,
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
