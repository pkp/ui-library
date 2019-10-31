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
				plugins: 'paste,link,lists,image,code',
				size: 'large',
				label: 'Editorial Team',
				toolbar:
					'bold italic superscript subscript | link | blockquote bullist numlist | image | code'
			}
		};
	}
};
</script>
