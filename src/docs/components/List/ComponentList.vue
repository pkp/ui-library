<script>
import Component from '@/docs/Component.vue';
import PreviewList from './previews/PreviewList.vue';
import PreviewListTemplate from '!raw-loader!./previews/PreviewList.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'List',
			readme: readme,
			examples: [
				{
					component: PreviewList,
					name: 'Base',
					template: this.extractTemplate(PreviewListTemplate)
				}
			]
		};
	}
};
</script>
