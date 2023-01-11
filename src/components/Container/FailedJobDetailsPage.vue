<script>
import Page from './Page.vue';
import PkpTable from '@/components/Table/Table.vue';

export default {
	name: 'FailedJobDetailsPage',
	extends: Page,
	components: {
		PkpTable
	},
	data() {
		return {
			columns: [],
			rows: [],
			label: ''
		};
	}
};
</script>
