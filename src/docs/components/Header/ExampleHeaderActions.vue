<script>
import Example from '@/docs/Example.vue';
import PreviewHeaderActions from './previews/PreviewHeaderActions.vue';
import fileContent from '!raw-loader!./previews/PreviewHeaderActions.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewHeaderActions
	},
	data() {
		return {
			...config,
			props: {
				...config.props,
				showAdjacentPages: 2
			},
			component: 'preview-header-actions',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
