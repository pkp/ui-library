<script>
import Component from '@/docs/Component.vue';
import PreviewFieldColor from './previews/PreviewFieldColor.vue';
import PreviewFieldColorTemplate from './previews/PreviewFieldColor.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldColor',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldColor,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldColorTemplate),
				},
			],
		};
	},
};
</script>
