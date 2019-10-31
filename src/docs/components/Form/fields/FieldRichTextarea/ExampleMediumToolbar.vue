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
				toolbar:
					'bold italic superscript subscript | link | blockquote bullist numlist',
				plugins: data.props.plugins + ',lists'
			}
		};
	}
};
</script>
