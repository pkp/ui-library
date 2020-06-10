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
		fieldChanged: function(name, prop, value, localeKey) {
			if (name === 'themePluginPath') {
				this.changeTheme(value);
			} else {
				let newFields = this.fields.map(field => {
					if (field.name === name) {
						if (localeKey) {
							field[prop][localeKey] = value;
						} else {
							field[prop] = value;
						}
					}
					return field;
				});
				this.$emit('set', this.id, {fields: newFields});
			}
			this.removeError(name, localeKey);
		},

		/**
		 * Change the theme and update theme options
		 *
		 * Clear old theme options and wait a tick before adding new theme options.
		 * Otherwise, there can be field collisions where a new field still renders
		 * based on the value of the old field.
		 */
		changeTheme: function(theme) {
			this.$emit('set', this.id, {fields: this.fields.slice(0, 1)});
			this.$nextTick(() => {
				const themeOptionFields = this.themeFields[theme] || [];
				this.$emit('set', this.id, {
					fields: [
						{
							...this.fields[0],
							value: theme
						},
						...themeOptionFields
					]
				});
			});
		}
	}
};
</script>
