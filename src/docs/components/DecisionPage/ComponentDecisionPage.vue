<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewDecisionPage.vue';
import Template from './previews/PreviewDecisionPage.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'DecisionPage',
			readme: readme,
			examples: [
				{
					component: Preview,
					name: 'Base',
					template: this.extractTemplate(Template),
				},
			],
		};
	},
};
</script>
