<template>
	<fieldset class="pkpFormGroup -pkpClearfix">
		<div v-if="label" class="pkpFormGroup__heading">
			<legend class="pkpFormGroup__legend">{{ label }}</legend>
			<div
				v-if="description"
				class="pkpFormGroup__description"
				v-html="description"
			></div>
		</div>
		<div class="pkpFormGroup__fields">
			<template v-for="field in fieldsInGroup">
				<template v-if="field.isMultilingual">
					<div class="pkpFormGroup__localeGroup -pkpClearfix" :key="field.name">
						<div
							v-for="locale in availableLocales"
							:key="locale.key"
							class="pkpFormGroup__locale"
							:class="{
								'pkpFormGroup__locale--isVisible': visibleLocales.includes(
									locale.key
								)
							}"
						>
							<component
								:is="field.component"
								v-bind="field"
								:allErrors="errors"
								:localeKey="locale.key"
								:formId="formId"
								:primaryLocale="primaryLocale"
								:locales="availableLocales"
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
						@change="fieldChanged"
						@set-errors="setFieldErrors"
					></component>
				</template>
			</template>
		</div>
	</fieldset>
</template>

<script>
import FieldBaseAutosuggest from '@/components/Form/fields/FieldBaseAutosuggest.vue';
import FieldArchivingPn from '@/components/Form/fields/FieldArchivingPn.vue';
import FieldColor from '@/components/Form/fields/FieldColor.vue';
import FieldControlledVocab from '@/components/Form/fields/FieldControlledVocab.vue';
import FieldPubId from '@/components/Form/fields/FieldPubId.vue';
import FieldHtml from '@/components/Form/fields/FieldHtml.vue';
import FieldMetadataSetting from '@/components/Form/fields/FieldMetadataSetting.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import FieldPreparedContent from '@/components/Form/fields/FieldPreparedContent.vue';
import FieldRadioInput from '@/components/Form/fields/FieldRadioInput.vue';
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';
import FieldSelectIssue from '@/components/Form/fields/FieldSelectIssue.vue';
import FieldSelectSubmissions from '@/components/Form/fields/FieldSelectSubmissions.vue';
import FieldShowEnsuringLink from '@/components/Form/fields/FieldShowEnsuringLink.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import FieldTextarea from '@/components/Form/fields/FieldTextarea.vue';
import FieldUpload from '@/components/Form/fields/FieldUpload.vue';
import FieldUploadImage from '@/components/Form/fields/FieldUploadImage.vue';

export default {
	name: 'FormGroup',
	components: {
		FieldBaseAutosuggest,
		FieldArchivingPn,
		FieldColor,
		FieldControlledVocab,
		FieldPubId,
		FieldHtml,
		FieldMetadataSetting,
		FieldOptions,
		FieldPreparedContent,
		FieldRadioInput,
		FieldRichTextarea,
		FieldSelect,
		FieldSelectIssue,
		FieldSelectSubmissions,
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
		showWhen: [String, Array]
	},
	computed: {
		/**
		 * All fields assigned to this group
		 *
		 * @return {Array}
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
		 * Emit an event when a field's prop has changed
		 *
		 * @param {String} name Name of the field to modify
		 * @param {String} prop Name of the prop to modify
		 * @param {mixed} value The new value for the prop
		 * @param {String} localeKey Optional locale key for multilingual props
		 */
		fieldChanged: function(name, prop, value, localeKey) {
			this.$emit('change', name, prop, value, localeKey);
		},

		/**
		 * Should a field be shown?
		 *
		 * @param {Object} field One of this.fields
		 * @return {Boolean}
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
		 * @param {String} name Field name
		 * @param {Array} errors List of errors for the field
		 * @param {String} localeKey The locale key for a multilingual field
		 */
		setFieldErrors: function(name, errors, localeKey = '') {
			let newErrors = {...this.errors};
			if (!errors || !errors.length) {
				if (localeKey && newErrors[name] && newErrors[name][localeKey]) {
					delete newErrors[name][localeKey];
				} else if (newErrors[name]) {
					delete newErrors[name];
				}
			} else {
				if (localeKey) {
					newErrors[name] = newErrors[name] || {};
					newErrors[name][localeKey] = errors;
				} else {
					newErrors[name] = errors;
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
	padding: 2rem;
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
	margin-bottom: 0.5rem;
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
	margin-top: 1.5rem;
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
		margin-bottom: 2rem;
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
		padding-right: 1.5rem;

		~ .pkpFormGroup__locale--isVisible {
			padding-right: 0;
			padding-left: 1.5rem;
		}
	}
}

// When forms appear in a dropdown
.pkpDropdown .pkpFormGroup {
	padding: 0.5rem;
}
</style>
