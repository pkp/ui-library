<script>
import Example from '@/docs/Example.vue';
import ListPanel from './previews/PreviewListPanelOrderable.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelOrderable.vue';
import fileContentItem from '!raw-loader!./previews/PreviewListPanelOrderable_ListPanelItem.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		ListPanel
	},
	data() {
		let file =
			'&lt;!-- This ListPanel loads a &lt;orderable-list-panel-item&gt; component wrapped in a &lt;draggable&gt; component --&gt' +
			this.extractTemplate(fileContent);
		file +=
			'\n\n&lt;!-- The &lt;orderable-list-panel-item&gt; includes accessible buttons to reorder the item --&gt;' +
			this.extractTemplate(fileContentItem);
		return {
			...config,
			title: 'ListPanel With Orderable Items',
			component: 'list-panel',
			template: file
		};
	}
};
</script>
