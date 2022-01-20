<script>
import Page from './Page.vue';
import PkpTable from '@/components/Table/Table.vue';

export default {
	name: 'JobsPage',
	extends: Page,
	components: {
		PkpTable
	},
	data() {
		return {
			columns: [],
			rows: [],
			label: '',
			description: '',
			total: 0
		};
	}
};
</script>
