<script>
import Component from '@/docs/Component.vue';
import PreviewFieldTextarea from './previews/PreviewFieldTextarea.vue';
import PreviewFieldTextareaTemplate from './previews/PreviewFieldTextarea.vue?raw';
import PreviewFieldTextareaSmall from './previews/PreviewFieldTextareaSmall.vue';
import PreviewFieldTextareaSmallTemplate from './previews/PreviewFieldTextareaSmall.vue?raw';
import PreviewFieldTextareaLarge from './previews/PreviewFieldTextareaLarge.vue';
import PreviewFieldTextareaLargeTemplate from './previews/PreviewFieldTextareaLarge.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewFieldTextareaTemplate),
				},
				{
					component: PreviewFieldTextareaSmall,
					name: 'Small',
					template: this.extractTemplate(PreviewFieldTextareaSmallTemplate),
				},
				{
					component: PreviewFieldTextareaLarge,
					name: 'Large',
					template: this.extractTemplate(PreviewFieldTextareaLargeTemplate),
				},
			],
		};
	},
};
</script>
