<script>
import Component from '@/docs/Component.vue';
import PreviewListPanel from './previews/PreviewListPanel.vue';
import PreviewListPanelTemplate from './previews/PreviewListPanel.vue?raw';
import PreviewListPanelActions from './previews/PreviewListPanelActions.vue';
import PreviewListPanelActionsTemplate from './previews/PreviewListPanelActions.vue?raw';
import PreviewListPanelDescription from './previews/PreviewListPanelDescription.vue';
import PreviewListPanelDescriptionTemplate from './previews/PreviewListPanelDescription.vue?raw';
import PreviewListPanelEmpty from './previews/PreviewListPanelEmpty.vue';
import PreviewListPanelEmptyTemplate from './previews/PreviewListPanelEmpty.vue?raw';
import PreviewListPanelFilter from './previews/PreviewListPanelFilter.vue';
import PreviewListPanelFilterTemplate from './previews/PreviewListPanelFilter.vue?raw';
import PreviewListPanelItemActions from './previews/PreviewListPanelItemActions.vue';
import PreviewListPanelItemActionsTemplate from './previews/PreviewListPanelItemActions.vue?raw';
import PreviewListPanelItemExpander from './previews/PreviewListPanelItemExpander.vue';
import PreviewListPanelItemExpanderTemplate from './previews/PreviewListPanelItemExpander.vue?raw';
import PreviewListPanelPagination from './previews/PreviewListPanelPagination.vue';
import PreviewListPanelPaginationTemplate from './previews/PreviewListPanelPagination.vue?raw';
import PreviewListPanelSearch from './previews/PreviewListPanelSearch.vue';
import PreviewListPanelSearchTemplate from './previews/PreviewListPanelSearch.vue?raw';
import PreviewListPanelSelect from './previews/PreviewListPanelSelect.vue';
import PreviewListPanelSelectTemplate from './previews/PreviewListPanelSelect.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'ListPanel',
			readme: readme,
			examples: [
				{
					component: PreviewListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewListPanelTemplate),
				},
				{
					component: PreviewListPanelActions,
					name: 'With Actions',
					template: this.extractTemplate(PreviewListPanelActionsTemplate),
				},
				{
					component: PreviewListPanelDescription,
					name: 'With Description',
					template: this.extractTemplate(PreviewListPanelDescriptionTemplate),
				},
				{
					component: PreviewListPanelEmpty,
					name: 'With No Items',
					template: this.extractTemplate(PreviewListPanelEmptyTemplate),
				},
				{
					component: PreviewListPanelFilter,
					name: 'With Filter',
					template: this.extractTemplate(PreviewListPanelFilterTemplate),
				},
				{
					component: PreviewListPanelItemActions,
					name: 'With Item Actions',
					template: this.extractTemplate(PreviewListPanelItemActionsTemplate),
				},
				{
					component: PreviewListPanelItemExpander,
					name: 'With Expandable Item',
					template: this.extractTemplate(PreviewListPanelItemExpanderTemplate),
				},
				{
					component: PreviewListPanelPagination,
					name: 'With Pagination',
					template: this.extractTemplate(PreviewListPanelPaginationTemplate),
				},
				{
					component: PreviewListPanelSearch,
					name: 'With Search',
					template: this.extractTemplate(PreviewListPanelSearchTemplate),
				},
				{
					component: PreviewListPanelSelect,
					name: 'With Select',
					template: this.extractTemplate(PreviewListPanelSelectTemplate),
				},
			],
		};
	},
};
</script>
