<script>
import ListPanelFilter from '@/components/ListPanel/ListPanelFilter.vue';

export default {
	extends: ListPanelFilter,
	name: 'UsersListFilter',
	methods: {
		/**
		 * Override ListPanelFilter.filterBy
		 *
		 * - limit the `status` filters so that only one can be selected at a time
		 * - disable other group/role filters when `userGroupIds` `0` is passed
		 * - remove no assigned groups filter when `roleIds` is passed
		 *
		 * @param type string Query param
		 * @param val string Value to assign to the query param
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
			if (type === 'userGroupIds' && val === 0) {
				let filters = Object.assign({}, this.activeFilters);
				filters[type] = filters[type] || [];
				if (filters[type].includes(val)) {
					filters[type] = filters[type].splice(filters[type].indexOf(val), 1);
				} else {
					filters[type].push(val);
				}
				delete filters.roleIds;
				this.filterList(filters);
				return;
			}
			if (type === 'roleIds' && this.activeFilters['userGroupIds']) {
				let filters = Object.assign({}, this.activeFilters);
				filters[type] = filters[type] || [];
				if (filters[type].includes(val)) {
					filters[type] = filters[type].splice(filters[type].indexOf(val), 1);
				} else {
					filters[type].push(val);
				}
				delete filters.userGroupIds;
				this.filterList(filters);
				return;
			}
			ListPanelFilter.methods.filterBy.call(this, type, val);
		},
	},
};
</script>
