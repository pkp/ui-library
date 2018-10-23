<script>
import PkpForm from '../Form.vue';

export default {
	name: 'LicenseForm',
	extends: PkpForm,
	methods: {
		/**
		 * Override Form.submit() in order to split the copyrightHolder field
		 * value into copyrightHolderType and copyrightHolderOther.
		 */
		submit: function () {

			this.isSaving = true;

			let values = {};
			this.fields.forEach((field) => {
				if (field.name === 'copyrightHolder') {
					if (['author', 'context'].includes(field.value)) {
						values['copyrightHolderType'] = field.value;
						values['copyrightHolderOther'] = '';
					} else {
						values['copyrightHolderType'] = 'other';
						values['copyrightHolderOther'] = field.value;
					}
				} else {
					values[field.name] = field.value;
				}
			});

			$.ajax({
				context: this,
				method: this.method,
				url: this.action,
				data: values,
				success: this.success,
				error: this.error,
				complete: this.complete,
			});
		},
	},
};
</script>
