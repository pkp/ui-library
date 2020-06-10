<script>
import Component from '@/docs/Component.vue';
import PreviewSpinner from './previews/PreviewSpinner.vue';
import PreviewSpinnerTemplate from '!raw-loader!./previews/PreviewSpinner.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewSpinnerTemplate)
				}
			]
		};
	}
};
</script>
