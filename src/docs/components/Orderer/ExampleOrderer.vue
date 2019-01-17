<script>
import Example from '@/docs/Example.vue';
import PreviewOrderer from './previews/PreviewOrderer.vue';
import fileContent from '!raw-loader!./previews/PreviewOrderer.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewOrderer
	},
	data() {
		return {
			...config,
			component: 'preview-orderer',
			props: config.props,
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
