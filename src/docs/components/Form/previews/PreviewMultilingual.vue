<script>
import PreviewForm from './PreviewForm.vue';
import props from '../helpers/form-multilingual';

export default {
	extends: PreviewForm,
	data() {
		return {
			components: {
				example: props
			}
		};
	}
};
</script>
