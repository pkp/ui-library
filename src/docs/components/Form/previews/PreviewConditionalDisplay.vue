<script>
import PreviewForm from './PreviewForm.vue';
import props from '../helpers/form-conditional-display';

export default {
	extends: PreviewForm,
	data() {
		return {
			forms: {
				example: {
					...props,
					id: 'example',
					errors: {}
				}
			}
		};
	}
};
</script>
