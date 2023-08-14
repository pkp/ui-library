<script>
import Component from '@/docs/Component.vue';
import PreviewList from './previews/PreviewList.vue';
import PreviewListTemplate from './previews/PreviewList.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewListTemplate),
				},
			],
		};
	},
};
</script>
