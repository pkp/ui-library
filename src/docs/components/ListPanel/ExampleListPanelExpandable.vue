<script>
import Example from '@/docs/Example.vue';
import ListPanel from './previews/PreviewListPanelExpandable.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelExpandable.vue';
import fileContentItem from '!raw-loader!./previews/PreviewListPanelExpandable_ListPanelItem.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		ListPanel
	},
	data() {
		let file =
			'&lt;!-- This ListPanel loads a &lt;expandable-list-panel-item&gt; component --&gt;' +
			this.extractTemplate(fileContent);
		file +=
			'\n\n&lt;!-- The &lt;expandable-list-panel-item&gt; includes accessible buttons to open/close the item --&gt;' +
			this.extractTemplate(fileContentItem);
		return {
			...config,
			title: 'ListPanel With Expandable Items',
			component: 'list-panel',
			template: file
		};
	}
};
</script>
