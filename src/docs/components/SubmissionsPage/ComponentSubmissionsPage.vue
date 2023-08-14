<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewSubmissionsPage.vue';
import Template from './previews/PreviewSubmissionsPage.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'SubmissionsPage',
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
