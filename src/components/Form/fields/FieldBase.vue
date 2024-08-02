<script>
import FieldError from '../FieldError.vue';
import FormFieldLabel from '../FormFieldLabel.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';

export default {
	name: 'FieldBase',
	components: {
		FieldError,
		FormFieldLabel,
		HelpButton,
		Tooltip,
		MultilingualProgress,
	},
	props: {
		/** The key for this field. Used in the `name` attribute of `<input>`, `<textarea>`, `<select>` and other fields. The form will submit the value for this field under this name, so it must match an accepted value of the API endpoint. */
		name: String,
		/** Used internally to load the appropriate component. For example, to load the `FieldText` component this should be `field-text`. */
		component: String,
		/** The `<label>` for this field. May be used in a `<fieldset>` when appropriate. All form fields should have an accessible label. */
		label: String,
		/** Adds a description to the field. Can include HTML code. */
		description: String,
		/** Adds a tooltip to the field. Can include HTML code. */
		tooltip: String,
		/** Adds a button to the field which will open the in-app help panel to this topic. */
		helpTopic: String,
		/** When the in-app help panel is opened to `helpTopic`, it will scroll to `helpSection` if included. */
		helpSection: String,
		/** The ID of the group this field should appear in.  */
		groupId: String,
		/** The ID of the form this field should appear in. This is passed down from the `Form`.  */
		formId: String,
		/** Whether the field should be ignored when a form is submitted (e.g. purely informational field). */
		isInert: {
			type: Boolean,
			default() {
				return false;
			},
		},
		/** Whether or not this field should be presented for each supported language. */
		isMultilingual: Boolean,
		/**  Whether or not a value for this field should be required. */
		isRequired: Boolean,
		/** The `name` of another field which should have a truthy value before this field is shown. You can also pass an array to require a specific value. For example, `['primaryLocale', 'en_US']` would hide this field unless the `primaryLocale` field had a value of `en_US`. */
		showWhen: [String, Array],
		/** The primary locale for this form. This is passed down from the `Form`. */
		primaryLocale: String,
		/** If the field `isMultilingual`, this will be set to the locale key of this particular instance. This is passed down from the `Form`. */
		localeKey: String,
		/** The locales supported by this form. This is passed down from the `Form`. */
		locales: Array,
		error: String,
		/** The current value. */
		value: {
			required: true,
		},
		/** An object containing all errors in the form. This is passed down from the `Form`. */
		allErrors: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	emits: [
		/** Emitted when a field prop changes. Payload: `(fieldName, propName, newValue, [localeKey])`. The `localeKey` will be null for fields that are not multilingual. This event is fired every time the `value` changes, so you should [debounce](https://www.npmjs.com/package/debounce) event callbacks that contain resource-intensive code. */
		'change',
		'set-errors',
	],
	computed: {
		/**
		 * A getter and setter for modifying the value. Instead of changing
		 * this.value = foo, which bypasses Vue's observers, set
		 * this.currentValue = foo. The change event will be emitted so that the
		 * value can be changed by parent components, and observers can react to the
		 * change.
		 */
		currentValue: {
			get() {
				return this.isMultilingual ? this.value[this.localeKey] : this.value;
			},
			set: function (newVal) {
				this.$emit('change', this.name, 'value', newVal, this.localeKey);
			},
		},

		/**
		 *
		 */
		errors() {
			if (!Object.keys(this.allErrors).includes(this.name)) {
				return [];
			}
			let errors = this.allErrors[this.name];
			if (this.isMultilingual && Object.keys(errors).includes(this.localeKey)) {
				return errors[this.localeKey];
			} else if (!this.isMultilingual) {
				return errors;
			}
			return [];
		},

		/**
		 * A localized field name
		 *
		 * It will append the appropriate `localeKey` to the `name` property if this
		 * is a multilingual field.
		 *
		 * @return {String}
		 */
		localizedName() {
			return this.isMultilingual ? this.name + '-' + this.localeKey : this.name;
		},

		/**
		 * In case field is not using input element, its necessary to reference the label via aria-labelby (for example FieldSlider)
		 *
		 * @return {String}
		 */
		labelId() {
			return this.compileId('control');
		},

		/**
		 * A unique id for the label and control
		 *
		 * @return {String}
		 */
		controlId() {
			return this.compileId('control');
		},

		/**
		 * A unique id for the field's tooltip
		 *
		 * @return {String}
		 */
		describedByTooltipId() {
			return this.compileId('tooltip');
		},

		/**
		 * A unique id for the field's help link button
		 *
		 * @return {String}
		 */
		describedByHelpId() {
			return this.compileId('help');
		},

		/**
		 * A unique id for the field's description
		 *
		 * @return {String}
		 */
		describedByDescriptionId() {
			return this.compileId('description');
		},

		/**
		 * A unique id for the field's error message
		 *
		 * @return {String}
		 */
		describedByErrorId() {
			return this.compileId('error');
		},

		/**
		 * A unique id for the field's multilingual progress indicator
		 *
		 * @return {String}
		 */
		multilingualProgressId() {
			return this.compileId('multilingualProgress');
		},

		/**
		 * IDs of the elements which describe this field.
		 *
		 * This is used in the aria-describedby attribute for accessibility.
		 *
		 * @return {String}
		 */
		describedByIds() {
			let ids = [];
			if (this.description) {
				ids.push(this.describedByDescriptionId);
			}
			if (this.tooltip) {
				ids.push(this.describedByTooltipId);
			}
			if (this.helpTopic) {
				ids.push(this.describedByHelpId);
			}
			if (this.error) {
				ids.push(this.describedByErrorId);
			}
			if (this.isMultilingual) {
				ids.push(this.multilingualProgressId);
			}
			return ids.length ? ids.join(' ') : undefined;
		},

		/**
		 * Count of multilingual fields completed
		 *
		 * If this is a multilingual field, it will return the number of locales
		 * with values. Otherwise it will return 0.
		 *
		 * @return {Number}
		 */
		multilingualFieldsCompleted() {
			if (!this.isMultilingual) {
				return 0;
			}
			return Object.values(this.value).filter((val) => {
				if (Array.isArray(val)) {
					return val.length;
				}
				return val;
			}).length;
		},

		/*
		 * Is this a multilingual field and is this the primary locale?
		 *
		 * @return {Boolean}
		 */
		isPrimaryLocale() {
			return !this.isMultilingual || this.localeKey === this.primaryLocale;
		},

		/**
		 * The label for this field
		 *
		 * For multilingual fields, the secondary languages will indicate the
		 * locale name in the label.
		 *
		 * @return {String}
		 */
		localeLabel() {
			if (!this.isMultilingual || this.isPrimaryLocale) {
				return '';
			}
			return this.locales.find((locale) => locale.key === this.localeKey).label;
		},

		/**
		 * For multilingual fields, the secondary languages need a hidden label for
		 * screenreaders that indicates the language as well as the original field
		 * label.
		 *
		 * @return {String}
		 */
		multilingualLabel() {
			return this.t('form.multilingualLabel', {
				label: this.label,
				localeName: this.localeLabel,
			});
		},
	},
	beforeUnmount() {
		this.$emit('set-errors', this.name, [], this.localeKey);
	},
	methods: {
		/**
		 * Helper function to compile unique IDs for labels and aria-describedby
		 * attributes.
		 *
		 * @param {String} type The type of ID you want to generate (eg - `tooltip`)
		 * @return {String}
		 */
		compileId: function (type) {
			let parts = [this.formId, this.name, type];
			if (this.isMultilingual) {
				parts.push(this.localeKey.replace('@', '_'));
			}
			return parts.join('-');
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField__heading {
	line-height: @line-sml;
}

.pkpFormField__description {
	font-size: @font-sml;
	line-height: 1.8em;
}

.pkpFormField__control {
	position: relative;
	margin-top: 0.25rem;
}

// Should be used for any text input and select fields to ensure consistency
.pkpFormField__input {
	display: block;
	padding: 0 1em;
	height: 2.5rem; // browser-compatibility for select fields
	background-color: @lift;
	font-size: @font-sml;
	line-height: 2.5rem;
	border: @bg-border;
	border-radius: 2px;

	&:hover {
		border-color: @shade;
	}

	&:focus {
		border-color: @primary;
		box-shadow: inset 3px 0 0 @primary;
		outline: 0;
	}

	&:disabled {
		background: @bg-light;
		cursor: not-allowed;
		// Lighter than @text but accessible on @bg-light
		color: rgba(0, 0, 0, 0.65);

		&:hover {
			border-color: @bg-border-color;
		}
	}
}

// :read-only causes unexpected effects on editable fields
// that aren't input or textarea
input.pkpFormField__input:read-only,
textarea.pkpFormField__input:read-only {
	&:extend(.pkpFormField__input:disabled);
}

[dir='rtl'] {
	.pkpFormField__input {
		&:focus {
			box-shadow: inset -3px 0 0 @primary;
		}
	}
}
</style>
