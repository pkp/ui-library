<script>
import Component from '@/docs/Component.vue';
import PreviewFieldSelect from './previews/PreviewFieldSelect.vue';
import PreviewFieldSelectTemplate from './previews/PreviewFieldSelect.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewFieldSelectTemplate),
				},
			],
		};
	},
};
</script>
