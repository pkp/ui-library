<script>
import Component from '@/docs/Component.vue';
import PreviewFieldSelect from './previews/PreviewFieldSelect.vue';
import PreviewFieldSelectTemplate from '!raw-loader!./previews/PreviewFieldSelect.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldSelect',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldSelect,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldSelectTemplate)
				}
			]
		};
	}
};
</script>
