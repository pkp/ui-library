<script>
import Component from '@/docs/Component.vue';
import PreviewNotify from './previews/PreviewNotify.vue';
import PreviewNotifyTemplate from '!raw-loader!./previews/PreviewNotify.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewNotifyTemplate)
				}
			]
		};
	}
};
</script>
