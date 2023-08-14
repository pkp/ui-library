<script>
import Component from '@/docs/Component.vue';
import PreviewPage from './previews/PreviewPage.vue';
import PreviewPageTemplate from './previews/PreviewPage.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Page',
			readme: readme,
			examples: [
				{
					component: PreviewPage,
					name: 'Base',
					template: this.extractTemplate(PreviewPageTemplate),
				},
			],
		};
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.component--Page {
	.component__example {
		padding: 0;
		background: @lift;
	}

	.component__exampleWrapper {
		padding: 0;
		background: @bg;
		max-width: none;
	}
}
</style>
