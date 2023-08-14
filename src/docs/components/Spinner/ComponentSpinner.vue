<script>
import Component from '@/docs/Component.vue';
import PreviewSpinner from './previews/PreviewSpinner.vue';
import PreviewSpinnerTemplate from './previews/PreviewSpinner.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Spinner',
			readme: readme,
			examples: [
				{
					component: PreviewSpinner,
					name: 'Base',
					template: this.extractTemplate(PreviewSpinnerTemplate),
				},
			],
		};
	},
};
</script>
