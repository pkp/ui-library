<script>
import ListPanelFilter from '@/components/ListPanel/ListPanelFilter.vue';

export default {
	extends: ListPanelFilter,
	name: 'UsersListFilter',
	methods: {
		/**
		 * Override ListPanelFilter.filterBy to limit the `status` filters so that
		 * only one can be selected at a time.
		 */
		filterBy: function (type, val) {
			if (type === 'status') {
				let filters = Object.assign({}, this.activeFilters);
				if (filters[type] === val) {
					delete filters[type];
				} else {
					filters[type] = val;
				}
				this.filterList(filters);
				return;
			}
			ListPanelFilter.methods.filterBy.call(this, type, val);
		},
	},
};
</script>
