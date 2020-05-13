<script>
import Component from '@/docs/Component.vue';
import PreviewFieldArchivingPn from './previews/PreviewFieldArchivingPn.vue';
import PreviewFieldArchivingPnTemplate from '!raw-loader!./previews/PreviewFieldArchivingPn.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFieldArchivingPnTemplate)
				}
			]
		};
	}
};
</script>
