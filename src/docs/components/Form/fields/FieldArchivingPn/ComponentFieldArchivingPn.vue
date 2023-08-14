<script>
import Component from '@/docs/Component.vue';
import PreviewFieldArchivingPn from './previews/PreviewFieldArchivingPn.vue';
import PreviewFieldArchivingPnTemplate from './previews/PreviewFieldArchivingPn.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldArchivingPn',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldArchivingPn,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldArchivingPnTemplate),
				},
			],
		};
	},
};
</script>
