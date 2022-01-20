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
	},
	computed: {
		compiledDescription() {
			return this.replaceLocaleParams(this.description, {total: this.total});
		}
	}
};
</script>
