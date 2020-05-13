<script>
import Component from '@/docs/Component.vue';
import PreviewHeader from './previews/PreviewHeader.vue';
import PreviewHeaderTemplate from '!raw-loader!./previews/PreviewHeader.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewHeaderTemplate)
				}
			]
		};
	}
};
</script>
