<script>
import Component from '@/docs/Component.vue';
import PreviewIcon from './previews/PreviewIcon.vue';
import PreviewIconTemplate from './previews/PreviewIcon.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewIconTemplate),
				},
			],
		};
	},
};
</script>
