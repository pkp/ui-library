<script>
import Component from '@/docs/Component.vue';
import PreviewHeader from './previews/PreviewHeader.vue';
import PreviewHeaderTemplate from './previews/PreviewHeader.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Header',
			readme: readme,
			examples: [
				{
					component: PreviewHeader,
					name: 'Base',
					template: this.extractTemplate(PreviewHeaderTemplate),
				},
			],
		};
	},
};
</script>
