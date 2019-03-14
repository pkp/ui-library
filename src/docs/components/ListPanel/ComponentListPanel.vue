<script>
import Component from '@/docs/Component.vue';
import ExampleListPanel from './ExampleListPanel.vue';
import ExampleListPanelActions from './ExampleListPanelActions.vue';
import ListPanelOrderable from './ExampleListPanelOrderable.vue';
import ExampleListPanelDescription from './ExampleListPanelDescription.vue';
import ExampleListPanelEmpty from './ExampleListPanelEmpty.vue';
import ExampleListPanelFilter from './ExampleListPanelFilter.vue';
import ExampleListPanelPagination from './ExampleListPanelPagination.vue';
import ExampleListPanelSearch from './ExampleListPanelSearch.vue';
import ExampleListPanelSelect from './ExampleListPanelSelect.vue';
import ExampleSubmissionsListPanel from './ExampleSubmissionsListPanel.vue';
import ExampleSelectSubmissionsListPanel from './ExampleSelectSubmissionsListPanel.vue';
import ExampleSelectReviewerListPanel from './ExampleSelectReviewerListPanel.vue';
import ExampleCatalogListPanel from './ExampleCatalogListPanel.vue';

export default {
	extends: Component,
	components: {
		ExampleListPanel,
		ExampleListPanelActions,
		ListPanelOrderable,
		ExampleListPanelDescription,
		ExampleListPanelEmpty,
		ExampleListPanelFilter,
		ExampleListPanelPagination,
		ExampleListPanelSearch,
		ExampleListPanelSelect,
		ExampleSubmissionsListPanel,
		ExampleSelectSubmissionsListPanel,
		ExampleSelectReviewerListPanel,
		ExampleCatalogListPanel
	},
	data() {
		return {
			name: 'ListPanel',
			examples: {
				ExampleListPanel: 'Base',
				ExampleListPanelActions: 'With Actions',
				ListPanelOrderable: 'With Orderable Items',
				ExampleListPanelDescription: 'With Description',
				ExampleListPanelEmpty: 'With No Items',
				ExampleListPanelFilter: 'With Filter',
				ExampleListPanelPagination: 'With Pagination',
				ExampleListPanelSearch: 'With Search',
				ExampleListPanelSelect: 'With Select'
			},
			implementations: {
				ExampleSubmissionsListPanel: 'SubmissionsListPanel',
				ExampleSelectSubmissionsListPanel: 'SelectSubmissionsListPanel',
				ExampleSelectReviewerListPanel: 'SelectReviewerListPanel',
				ExampleCatalogListPanel: 'CatalogListPanel (OMP)'
			}
		};
	}
};
</script>
