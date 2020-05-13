<script>
import Component from '@/docs/Component.vue';
import PreviewFieldTextarea from './previews/PreviewFieldTextarea.vue';
import PreviewFieldTextareaTemplate from '!raw-loader!./previews/PreviewFieldTextarea.vue';
import PreviewFieldTextareaSmall from './previews/PreviewFieldTextareaSmall.vue';
import PreviewFieldTextareaSmallTemplate from '!raw-loader!./previews/PreviewFieldTextareaSmall.vue';
import PreviewFieldTextareaLarge from './previews/PreviewFieldTextareaLarge.vue';
import PreviewFieldTextareaLargeTemplate from '!raw-loader!./previews/PreviewFieldTextareaLarge.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldTextarea',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldTextarea,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldTextareaTemplate)
				},
				{
					component: PreviewFieldTextareaSmall,
					name: 'Small',
					template: this.extractTemplate(PreviewFieldTextareaSmallTemplate)
				},
				{
					component: PreviewFieldTextareaLarge,
					name: 'Large',
					template: this.extractTemplate(PreviewFieldTextareaLargeTemplate)
				}
			]
		};
	}
};
</script>
