<script>
import PkpForm from '../Form.vue';

export default {
	name: 'AddContextForm',
	extends: PkpForm,
	props: {
		editContextUrl: {
			type: String,
			required: true,
		},
	},
	methods: {
		/**
		 * Redirect to the admin's context settings wizard when successful
		 */
		success: function (r) {
			pkp.eventBus.$emit('notify', {text: this.__('successMessage', r), type: 'success'});
			pkp.eventBus.$emit('form-success', this.id, r);

			if (r.id) {
				window.location.href = this.editContextUrl.replace('__id__', r.id);
			}
		},
	},
};
</script>
