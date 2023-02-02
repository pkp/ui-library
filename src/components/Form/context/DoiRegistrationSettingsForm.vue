<script>
import Form from '@/components/Form/Form.vue';

export default {
	name: 'DoiRegistrationSettingsForm',
	extends: Form,
	props: {
		agencyFields: Object,
	},
	methods: {
		/**
		 * Update values when a field has changed
		 *
		 * @param {String} name Name of the field to modify
		 * @param {String} prop Name of the prop to modify
		 * @param {mixed} value The new value for the prop
		 * @param {String} localeKey Optional locale key for multilingual props
		 */
		fieldChanged: function (name, prop, value, localeKey) {
			if (name === 'registrationAgency') {
				this.changeAgencyFields(value);
			} else {
				Form.methods.fieldChanged.apply(this, [name, prop, value, localeKey]);
			}
		},
		/**
		 * Change the agency-specific fields
		 *
		 * Clear old agency settings and wait a tick before adding new agency settings.
		 * Otherwise, there can be field collisions where a new field still renders
		 * based on the value of the old field.
		 *
		 * @param agencyName
		 */
		changeAgencyFields: function (agencyName) {
			this.$emit('set', this.id, {
				fields: this.fields.filter((field) => {
					return field.groupId === 'generalSettings';
				}),
			});

			this.$nextTick(() => {
				const agencyFields = this.agencyFields[agencyName] || [];
				const generalFields = this.fields.map((field) => {
					if (field.name === 'registrationAgency') {
						field.value = agencyName;
					}

					return field;
				});
				this.setErrors({});
				this.$emit('set', this.id, {
					fields: [...generalFields, ...agencyFields],
				});
			});
		},
	},
};
</script>
