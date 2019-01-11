<script>
import PkpForm from '../Form.vue';

export default {
	name: 'ThemeForm',
	extends: PkpForm,
	props: {
		themeFields: Object
	},
	methods: {
		/**
		 * @copydoc Form::fieldChanged()
		 */
		fieldChanged: function(data) {
			if (data.name === 'themePluginPath') {
				this.changeTheme(data.value);
			} else {
				let newFields = this.fields.map(field => {
					if (field.name === data.name) {
						if (data.localeKey) {
							field.value[data.localeKey] = data.value;
						} else {
							field.value = data.value;
						}
					}
					return field;
				});
				this.$emit('set-fields', this.id, newFields);
			}
			this.removeError(data.name, data.localeKey);
		},

		/**
		 * Change the theme and update theme options
		 *
		 * Clear old theme options and wait a tick before adding new theme options.
		 * Otherwise, there can be field collisions where a new field still renders
		 * based on the value of the old field.
		 */
		changeTheme: function(theme) {
			this.$emit('set-fields', this.id, [this.fields[0]]);
			this.$nextTick(() => {
				const themeOptionFields = this.themeFields[theme] || [];
				this.$emit('set-fields', this.id, [
					{
						...this.fields[0],
						value: theme
					},
					...themeOptionFields
				]);
			});
		}
	}
};
</script>
