<script>
import ExampleFieldRichTextarea from './ExampleFieldRichTextarea.vue';

export default {
	extends: ExampleFieldRichTextarea,
	data() {
		const data = ExampleFieldRichTextarea.data();
		return {
			...data,
			props: {
				...data.props,
				label: 'Abstract',
				wordLimit: 200,
				i18n: {
					...data.props.i18n,
					wordCount: 'Word Count: {$count}/{$limit}'
				}
			}
		};
	}
};
</script>
