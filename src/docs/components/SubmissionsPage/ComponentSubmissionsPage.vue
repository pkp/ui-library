<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewSubmissionsPage.vue';
import Template from '!raw-loader!./previews/PreviewSubmissionsPage.vue';
import readme from '!raw-loader!./readme.md';

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
