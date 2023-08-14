<script>
import Component from '@/docs/Component.vue';
import PreviewOrderer from './previews/PreviewOrderer.vue';
import PreviewOrdererTemplate from './previews/PreviewOrderer.vue?raw';
import PreviewOrdererDraggable from './previews/PreviewOrdererDraggable.vue';
import PreviewOrdererDraggableTemplate from './previews/PreviewOrdererDraggable.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewOrdererTemplate),
				},
				{
					component: PreviewOrdererDraggable,
					name: 'Draggable',
					template: this.extractTemplate(PreviewOrdererDraggableTemplate),
				},
			],
		};
	},
};
</script>
