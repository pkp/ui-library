<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewDecisionPage.vue';
import Template from '!raw-loader!./previews/PreviewDecisionPage.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(Template)
				}
			]
		};
	}
};
</script>
