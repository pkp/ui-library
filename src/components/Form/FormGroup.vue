<template>
	<fieldset class="pkpFormGroup -pkpClearfix">
		<div v-if="label" class="pkpFormGroup__heading">
			<legend class="pkpFormGroup__legend">{{ label }}</legend>
			<div v-if="description" class="pkpFormGroup__description" v-html="description"></div>
		</div>
		<div class="pkpFormGroup__fields">
			<template v-for="field in fieldsInGroup">
				<template v-if="field.isMultilingual">
					<div class="pkpFormGroup__localeGroup -pkpClearfix" :key="field.name">
						<div v-for="locale in availableLocales" :key="locale.key" class="pkpFormGroup__locale" :class="{'pkpFormGroup__locale--isVisible': visibleLocales.includes(locale.key)}">
							<component
								:is="field.component"
								v-bind="field"
								:allErrors="errors"
								:localeKey="locale.key"
								:formId="formId"
								:primaryLocale="primaryLocale"
								:locales="availableLocales"
								:i18n="i18n"
								@change="fieldChanged"
								@set-errors="setFieldErrors"
							></component>
						</div>
					</div>
				</template>
				<template v-else>
					<component
						:is="field.component"
						v-bind="field"
						:key="field.name"
						:allErrors="errors"
						:formId="formId"
						:i18n="i18n"
						@change="fieldChanged"
						@set-errors="setFieldErrors"
					></component>
				</template>
			</template>
		</div>
	</fieldset>
</template>

<script>
import FieldArchivingPn from '@/components/Form/fields/FieldArchivingPn.vue';
import FieldColor from '@/components/Form/fields/FieldColor.vue';
import FieldHtml from '@/components/Form/fields/FieldHtml.vue';
import FieldMetadataSetting from '@/components/Form/fields/FieldMetadataSetting.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import FieldRadioInput from '@/components/Form/fields/FieldRadioInput.vue';
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';
import FieldShowEnsuringLink from '@/components/Form/fields/FieldShowEnsuringLink.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import FieldTextarea from '@/components/Form/fields/FieldTextarea.vue';
import FieldUpload from '@/components/Form/fields/FieldUpload.vue';
import FieldUploadImage from '@/components/Form/fields/FieldUploadImage.vue';

export default {
	name: 'FormGroup',
	components: {
		FieldArchivingPn,
		FieldColor,
		FieldHtml,
		FieldMetadataSetting,
		FieldOptions,
		FieldRadioInput,
		FieldRichTextarea,
		FieldSelect,
		FieldShowEnsuringLink,
		FieldText,
		FieldTextarea,
		FieldUpload,
		FieldUploadImage
	},
	props: {
		id: String,
		label: String,
		description: String,
		pageId: String,
		fields: Array,
		errors: Object,
		formId: String,
		primaryLocale: String,
		visibleLocales: Array,
		availableLocales: Array,
		showWhen: [String, Array],
		i18n: Object
	},
	computed: {
		/**
		 * All fields assigned to this group
		 *
		 * @return array
		 */
		fieldsInGroup() {
			return this.fields.filter(
				field => field.groupId === this.id && this.shouldShowField(field)
			);
		},

		hasErrors() {
			for (var fieldName in this.fieldsInGroup) {
				if (fieldName in this.errors) {
					return true;
				}
			}
			return false;
		}
	},
	methods: {
		/**
		 * Emit an event when a field's value has changed
		 *
		 * @param object data {{
		 *  @option string name Field name
		 *  @option string value New value
		 *  @option string localeKey Locale key for this value. Empty it not multilingual
		 * }}
		 */
		fieldChanged: function(data) {
			this.$emit('change', data);
		},

		/**
		 * Should a field be shown?
		 *
		 * @param object field One of this.fields
		 * @return boolean
		 */
		shouldShowField: function(field) {
			if (typeof field.showWhen === 'undefined') {
				return true;
			}
			const whenFieldName =
				typeof field.showWhen === 'string' ? field.showWhen : field.showWhen[0];
			const whenField = this.fields.find(field => field.name === whenFieldName);
			if (!whenField) {
				return false;
			}
			if (typeof field.showWhen === 'string') {
				return !!whenField.value;
			}
			return whenField.value === field.showWhen[1];
		},

		/**
		 * Respond to a field changing its errors
		 *
		 * @param object data {{
		 *		@option string name Field name
		 *		@option array errors List of errors for the field
		 *		@option string localeKey The locale key for a multilingual field
		 * }}
		 */
		setFieldErrors: function(data) {
			const localeKey = data.localeKey || '';
			let newErrors = {...this.errors};
			if (!data.errors.length) {
				if (
					localeKey &&
					newErrors[data.name] &&
					newErrors[data.name][localeKey]
				) {
					delete newErrors[data.name][localeKey];
				} else if (newErrors[data.name]) {
					delete newErrors[data.name];
				}
			} else {
				if (localeKey) {
					newErrors[data.name] = newErrors[data.name] || {};
					newErrors[data.name][localeKey] = data.errors;
				} else {
					newErrors[data.name] = data.errors;
				}
			}
			this.$emit('set-errors', newErrors);
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFormGroup {
	position: relative;
	padding: @double;
	border: none;

	+ .pkpFormGroup {
		border-top: @bg-border-light;
	}
}

.pkpFormGroup__heading {
	float: left;
	width: 30%;
	padding-right: 1.5rem;
	line-height: @line-sml;

	+ .pkpFormGroup__fields {
		float: right;
		width: 70%;
		padding-left: 1.5rem;
	}
}

.pkpFormGroup__legend {
	display: inline-block;
	margin-bottom: @half;
	font-weight: @bold;
	font-size: @font-base-larger;
}

.pkpFormGroup__description {
	font-size: @font-sml;
}

.pkpFormGroup .pkpFormField + .pkpFormField,
.pkpFormGroup .pkpFormField + .pkpFormGroup__localeGroup,
.pkpFormGroup .pkpFormGroup__localeGroup + .pkpFormField,
.pkpFormGroup .pkpFormGroup__localeGroup + .pkpFormGroup__localeGroup {
	margin-top: @base + @half;
}

.pkpFormGroup__locale {
	display: none;
}

.pkpFormGroup__locale--isVisible {
	display: block;
}

// When multiple locales are being displayed at once
.pkpForm--hasManyVisibleLocales {
	.pkpFormGroup__heading {
		float: none;
		padding-right: 0;
		margin-bottom: @double;
		width: 100%;
		max-width: 35em;

		+ .pkpFormGroup__fields {
			float: none;
			width: 100%;
			padding-left: 0;
		}
	}

	.pkpFormGroup__locale--isVisible {
		float: left;
		width: 50%;
		padding-right: @base + @half;

		~ .pkpFormGroup__locale--isVisible {
			padding-right: 0;
			padding-left: @base + @half;
		}
	}
}
</style>
