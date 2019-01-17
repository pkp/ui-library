<script>
import PreviewForm from './PreviewForm.vue';
import props from '../helpers/form-user';

export default {
	extends: PreviewForm,
	data() {
		return {
			forms: {
				example: {
					...props,
					id: 'example'
				}
			}
		};
	}
};
</script>
