<script type="text/javascript">
import PkpForm from '@/components/Form/Form.vue';
import AddContextForm from '@/components/Form/context/AddContextForm.vue';
import LicenseForm from '@/components/Form/context/LicenseForm.vue';
import ThemeForm from '@/components/Form/context/ThemeForm.vue';

export default {
	name: 'Container',
	components: {
		PkpForm,
		AddContextForm,
		LicenseForm,
		ThemeForm
	},
	data() {
		return {
			components: []
		};
	},
	methods: {
		/**
		 * Get a form by its id
		 *
		 * @param {String} formId
		 * @return {Object}
		 */
		getForm: function(formId) {
			return this.forms[formId] ? this.forms[formId] : false;
		},

		/**
		 * Update the fields in a form
		 *
		 * @param {String} formId
		 * @param {Array} newFields The list of fields to update the form with
		 */
		setFormFields: function(formId, newFields) {
			if (!this.forms[formId]) {
				return;
			}
			this.forms[formId].fields = newFields;
		},

		/**
		 * Set the errors in the form
		 *
		 * @param {String} formId
		 * @param {Object} errors List of errors to attach to the form
		 */
		setFormErrors: function(formId, errors) {
			if (this.getForm(formId)) {
				this.getForm(formId).errors = errors;
			}
		},

		/**
		 * Set the errors in the form
		 *
		 * @param {String} formId
		 * @param {Array} visiibleLocales list of locale keys that should be active
		 */
		setFormVisibleLocales: function(formId, visibleLocales) {
			if (this.getForm(formId)) {
				this.getForm(formId).visibleLocales = visibleLocales;
			}
		}
	},
	mounted() {
		/**
		 * Listen for changes in the supported form languages and update forms
		 */
		pkp.eventBus.$on('set-form-languages', data => {
			let supportedFormLocales;
			// Account for global events triggered from Handler.js, which attaches
			// non-numeric keys to the event data, changing the array to an object
			if (!Array.isArray(data)) {
				supportedFormLocales = {...data};
				if (supportedFormLocales.isGlobalEvent) {
					delete supportedFormLocales.isGlobalEvent;
				}
				if (supportedFormLocales.handler) {
					delete supportedFormLocales.handler;
				}
				supportedFormLocales = Object.values(supportedFormLocales);
			} else {
				supportedFormLocales = [...data];
			}

			Object.keys(this.forms).forEach(id => {
				this.forms[id].supportedFormLocales = supportedFormLocales;
			});
		});
	}
};
</script>
