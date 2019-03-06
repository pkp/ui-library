<script>
import Component from '@/docs/Component.vue';
import ExampleListPanel from './ExampleListPanel.vue';
// import ListPanelCount from './ExampleListPanelCount.vue';
import ExampleListPanelActions from './ExampleListPanelActions.vue';
// import PkpSearch from './ExamplePkpSearch.vue';
// import ListPanelNotice from './ExampleListPanelNotice.vue';
// import ListPanelExpandable from './ExampleListPanelExpandable.vue';
// import ListPanelOrderable from './ExampleListPanelOrderable.vue';
import ExampleListPanelFilter from './ExampleListPanelFilter.vue';
import ExampleListPanelPagination from './ExampleListPanelPagination.vue';
import ExampleListPanelSearch from './ExampleListPanelSearch.vue';
import ExampleSubmissionsListPanelOJS from './ExampleSubmissionsListPanelOJS.vue';
// import SubmissionsListPanelOJS from './ExampleSubmissionsListPanelOJS.vue';
// import SubmissionsListPanelOMP from './ExampleSubmissionsListPanelOMP.vue';
// import CatalogSubmissionsListPanel from './ExampleCatalogSubmissionsListPanel.vue';

export default {
	extends: Component,
	components: {
		ExampleListPanel,
		// ListPanelCount,
		ExampleListPanelActions,
		// PkpSearch,
		// ListPanelNotice,
		// ListPanelExpandable,
		// ListPanelOrderable,
		ExampleListPanelFilter,
		ExampleListPanelPagination,
		ExampleListPanelSearch,
		ExampleSubmissionsListPanelOJS
		// SubmissionsListPanelOJS,
		// SubmissionsListPanelOMP,
		// CatalogSubmissionsListPanel
	},
	data() {
		return {
			name: 'ListPanel',
			examples: {
				ExampleListPanel: 'Base',
				// ListPanelCount: 'With Count',
				ExampleListPanelActions: 'With Actions',
				// PkpSearch: 'With Search',
				// ListPanelNotice: 'With Notice',
				// ListPanelExpandable: 'With Expandable Items',
				// ListPanelOrderable: 'With Orderable Items',
				ExampleListPanelFilter: 'With Filter',
				ExampleListPanelPagination: 'With Pagination',
				ExampleListPanelSearch: 'With Search'
			},
			implementations: {
				ExampleSubmissionsListPanelOJS: 'SubmissionsListPanel (OJS)'
				// 	SubmissionsListPanelOJS: 'SubmissionsListPanel (OJS)',
				// 	SubmissionsListPanelOMP: 'SubmissionsListPanel (OMP)',
				// 	CatalogSubmissionsListPanel: 'CatalogSubmissionsListPanel (OMP)'
			}
		};
	}
};
</script>
