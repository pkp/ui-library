<script>
import ListPanelFilter from '@/components/ListPanel/ListPanelFilter.vue';

export default {
	extends: ListPanelFilter,
	name: 'SubmissionsListFilter',
	methods: {
		/**
		 * Override ListPanelFilter.filterBy to handle special
		 * logic around the `isIncomplete` filter.
		 */
		filterBy: function (type, val) {
			// Don't allow other filters to be active when isIncomplete is active
			if (type === 'isIncomplete') {
				if (this.isFilterActive('isIncomplete', true)) {
					this.filterList({});
				} else {
					this.filterList({isIncomplete: [true]});
				}
				return;
			}
			let filters = Object.assign({}, this.activeFilters);
			// Remove isIncomplete filter when other filters activated
			if (filters.isIncomplete !== undefined) {
				filters.isIncomplete = [];
			}
			if (this.isFilterActive(type, val)) {
				this.clearFilter(type, val);
			} else {
				if (filters[type] === undefined) {
					filters[type] = [];
				}
				filters[type].push(val);
				this.filterList(filters);
			}
		},
	},
};
</script>
