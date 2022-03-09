<script>
import Form from '../Form.vue';

export default {
	name: 'DoiSettingsForm',
	extends: Form,
	methods: {
		/**
		 * Update values when a field has changed
		 *
		 * @param {String} name Name of the field to modify
		 * @param {String} prop Name of the prop to modify
		 * @param {mixed} value The new value for the prop
		 * @param {String} localeKey Optional locale key for multilingual props
		 */
		fieldChanged: function(name, prop, value, localeKey) {
			if (name === 'enableDois') {
				this.removeError('doiPrefix', localeKey);
			}
			Form.methods.fieldChanged.apply(this, [name, prop, value, localeKey]);
		}
	}
};
</script>
