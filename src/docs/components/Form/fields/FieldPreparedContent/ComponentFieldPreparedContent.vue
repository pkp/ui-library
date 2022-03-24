<script>
import Component from '@/docs/Component.vue';
import PreviewFieldPreparedContent from './previews/PreviewFieldPreparedContent.vue';
import PreviewFieldPreparedContentTemplate from '!raw-loader!./previews/PreviewFieldPreparedContent.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFieldPreparedContentTemplate)
				}
			]
		};
	}
};
</script>
