<script>
import Component from '@/docs/Component.vue';
import PreviewIcon from './previews/PreviewIcon.vue';
import PreviewIconTemplate from '!raw-loader!./previews/PreviewIcon.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'Icon',
			readme: readme,
			examples: [
				{
					component: PreviewIcon,
					name: 'Base',
					template: this.extractTemplate(PreviewIconTemplate)
				}
			]
		};
	}
};
</script>
