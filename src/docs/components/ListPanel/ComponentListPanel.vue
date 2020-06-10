<script>
import Component from '@/docs/Component.vue';
import PreviewListPanel from './previews/PreviewListPanel.vue';
import PreviewListPanelTemplate from '!raw-loader!./previews/PreviewListPanel.vue';
import PreviewListPanelActions from './previews/PreviewListPanelActions.vue';
import PreviewListPanelActionsTemplate from '!raw-loader!./previews/PreviewListPanelActions.vue';
import PreviewListPanelDescription from './previews/PreviewListPanelDescription.vue';
import PreviewListPanelDescriptionTemplate from '!raw-loader!./previews/PreviewListPanelDescription.vue';
import PreviewListPanelEmpty from './previews/PreviewListPanelEmpty.vue';
import PreviewListPanelEmptyTemplate from '!raw-loader!./previews/PreviewListPanelEmpty.vue';
import PreviewListPanelFilter from './previews/PreviewListPanelFilter.vue';
import PreviewListPanelFilterTemplate from '!raw-loader!./previews/PreviewListPanelFilter.vue';
import PreviewListPanelItemActions from './previews/PreviewListPanelItemActions.vue';
import PreviewListPanelItemActionsTemplate from '!raw-loader!./previews/PreviewListPanelItemActions.vue';
import PreviewListPanelItemExpander from './previews/PreviewListPanelItemExpander.vue';
import PreviewListPanelItemExpanderTemplate from '!raw-loader!./previews/PreviewListPanelItemExpander.vue';
import PreviewListPanelPagination from './previews/PreviewListPanelPagination.vue';
import PreviewListPanelPaginationTemplate from '!raw-loader!./previews/PreviewListPanelPagination.vue';
import PreviewListPanelSearch from './previews/PreviewListPanelSearch.vue';
import PreviewListPanelSearchTemplate from '!raw-loader!./previews/PreviewListPanelSearch.vue';
import PreviewListPanelSelect from './previews/PreviewListPanelSelect.vue';
import PreviewListPanelSelectTemplate from '!raw-loader!./previews/PreviewListPanelSelect.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewListPanelTemplate)
				},
				{
					component: PreviewListPanelActions,
					name: 'With Actions',
					template: this.extractTemplate(PreviewListPanelActionsTemplate)
				},
				{
					component: PreviewListPanelDescription,
					name: 'With Description',
					template: this.extractTemplate(PreviewListPanelDescriptionTemplate)
				},
				{
					component: PreviewListPanelEmpty,
					name: 'With No Items',
					template: this.extractTemplate(PreviewListPanelEmptyTemplate)
				},
				{
					component: PreviewListPanelFilter,
					name: 'With Filter',
					template: this.extractTemplate(PreviewListPanelFilterTemplate)
				},
				{
					component: PreviewListPanelItemActions,
					name: 'With Item Actions',
					template: this.extractTemplate(PreviewListPanelItemActionsTemplate)
				},
				{
					component: PreviewListPanelItemExpander,
					name: 'With Expandable Item',
					template: this.extractTemplate(PreviewListPanelItemExpanderTemplate)
				},
				{
					component: PreviewListPanelPagination,
					name: 'With Pagination',
					template: this.extractTemplate(PreviewListPanelPaginationTemplate)
				},
				{
					component: PreviewListPanelSearch,
					name: 'With Search',
					template: this.extractTemplate(PreviewListPanelSearchTemplate)
				},
				{
					component: PreviewListPanelSelect,
					name: 'With Select',
					template: this.extractTemplate(PreviewListPanelSelectTemplate)
				}
			]
		};
	}
};
</script>
