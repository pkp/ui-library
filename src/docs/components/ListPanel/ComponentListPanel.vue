<script>
import Component from '@/docs/Component.vue';
import ListPanel from './ExampleListPanel.vue';
import ListPanelCount from './ExampleListPanelCount.vue';
import ListPanelLoadMore from './ExampleListPanelLoadMore.vue';
import ListPanelActions from './ExampleListPanelActions.vue';
import ListPanelSearch from './ExampleListPanelSearch.vue';
import ListPanelNotice from './ExampleListPanelNotice.vue';
import ListPanelExpandable from './ExampleListPanelExpandable.vue';
import ListPanelOrderable from './ExampleListPanelOrderable.vue';
import ListPanelFilter from './ExampleListPanelFilter.vue';
import SubmissionsListPanelOJS from './ExampleSubmissionsListPanelOJS.vue';
import SubmissionsListPanelOMP from './ExampleSubmissionsListPanelOMP.vue';
import CatalogSubmissionsListPanel from './ExampleCatalogSubmissionsListPanel.vue';

export default {
	extends: Component,
	components: {
		ListPanel,
		ListPanelCount,
		ListPanelLoadMore,
		ListPanelActions,
		ListPanelSearch,
		ListPanelNotice,
		ListPanelExpandable,
		ListPanelOrderable,
		ListPanelFilter,
		SubmissionsListPanelOJS,
		SubmissionsListPanelOMP,
		CatalogSubmissionsListPanel
	},
	data() {
		return {
			name: 'ListPanel',
			examples: {
				ListPanel: 'ListPanel',
				ListPanelCount: 'With Count',
				ListPanelLoadMore: 'With Load More',
				ListPanelActions: 'With Actions',
				ListPanelSearch: 'With Search',
				ListPanelNotice: 'With Notice',
				ListPanelExpandable: 'With Expandable Items',
				ListPanelOrderable: 'With Orderable Items',
				ListPanelFilter: 'With Filter'
			},
			implementations: {
				SubmissionsListPanelOJS: 'SubmissionsListPanel (OJS)',
				SubmissionsListPanelOMP: 'SubmissionsListPanel (OMP)',
				CatalogSubmissionsListPanel: 'CatalogSubmissionsListPanel (OMP)'
			}
		};
	}
};
</script>
