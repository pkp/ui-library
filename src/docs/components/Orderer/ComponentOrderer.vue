<script>
import Component from '@/docs/Component.vue';
import PreviewOrderer from './previews/PreviewOrderer.vue';
import PreviewOrdererTemplate from '!raw-loader!./previews/PreviewOrderer.vue';
import PreviewOrdererDraggable from './previews/PreviewOrdererDraggable.vue';
import PreviewOrdererDraggableTemplate from '!raw-loader!./previews/PreviewOrdererDraggable.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Orderer',
			readme: readme,
			examples: [
				{
					component: PreviewOrderer,
					name: 'Base',
					template: this.extractTemplate(PreviewOrdererTemplate)
				},
				{
					component: PreviewOrdererDraggable,
					name: 'Draggable',
					template: this.extractTemplate(PreviewOrdererDraggableTemplate)
				}
			]
		};
	}
};
</script>
