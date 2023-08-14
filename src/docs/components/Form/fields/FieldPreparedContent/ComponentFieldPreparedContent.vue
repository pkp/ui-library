<script>
import Component from '@/docs/Component.vue';
import PreviewFieldPreparedContent from './previews/PreviewFieldPreparedContent.vue';
import PreviewFieldPreparedContentTemplate from './previews/PreviewFieldPreparedContent.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldPreparedContent',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldPreparedContent,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldPreparedContentTemplate),
				},
			],
		};
	},
};
</script>
