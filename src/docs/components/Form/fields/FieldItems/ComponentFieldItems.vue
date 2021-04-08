<script>
import Component from '@/docs/Component.vue';
import PreviewFieldItems from './previews/PreviewFieldItems.vue';
import PreviewFieldItemsTemplate from '!raw-loader!./previews/PreviewFieldItems.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldItems',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldItems,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldItemsTemplate)
				}
			]
		};
	}
};
</script>
