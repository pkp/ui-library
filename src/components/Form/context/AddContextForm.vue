<script>
import PkpForm from '../Form.vue';

export default {
	name: 'AddContextForm',
	extends: PkpForm,
	props: {
		editContextUrl: {
			type: String,
			required: true
		}
	},
	methods: {
		/**
		 * Redirect to the admin's context settings wizard when successful
		 */
		success: function(r) {
			pkp.eventBus.$emit('form-success', this.id, r);

			if (r.id) {
				window.location.href = this.editContextUrl.replace('__id__', r.id);
			}
		}
	},
	watch: {
		submitValues(newVal, oldVal) {
			// When the primaryLocale is not included in the supportedLocales,
			// an error is set on primaryLocale that can only be resolved
			// by editing the supportedLocales.
			if (newVal.supportedLocales.includes(newVal.primaryLocale)) {
				let errors = {...this.errors};
				delete errors.primaryLocale;
				this.$emit('set', this.id, {errors});
			}
		}
	}
};
</script>
