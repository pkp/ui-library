<script>
import Component from '@/docs/Component.vue';
import PreviewNotify from './previews/PreviewNotify.vue';
import PreviewNotifyTemplate from './previews/PreviewNotify.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Notify',
			readme: readme,
			examples: [
				{
					component: PreviewNotify,
					name: 'Base',
					template: this.extractTemplate(PreviewNotifyTemplate),
				},
			],
		};
	},
};
</script>
