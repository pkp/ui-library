<script>
import ExampleFieldRichTextarea from './ExampleFieldRichTextarea.vue';

export default {
	extends: ExampleFieldRichTextarea,
	data() {
		const data = ExampleFieldRichTextarea.data();
		return {
			...data,
			props: {...data.props, size: 'large'}
		};
	}
};
</script>
