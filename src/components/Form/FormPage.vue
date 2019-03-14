<template>
	<div class="pkpFormPage" :class="{'pkpFormPage--current': isCurrentPage}">
		<form-group v-for="group in groupsInPage"
			:key="group.id"
			v-bind="group"
			:fields="fields"
			:errors="errors"
			:primaryLocale="primaryLocale"
			:visibleLocales="visibleLocales"
			:availableLocales="availableLocales"
			:formId="formId"
			:i18n="i18n"
			@change="fieldChanged"
			@set-errors="setErrors"
		/>
		<div v-if="hasFooter" class="pkpFormPage__footer" ref="footer" aria-live="polite">
			<form-errors
				v-if="Object.keys(errors).length"
				:errors="errors"
				:fields="fields"
				:i18n="i18n"
				@showField="showField"
				@showLocale="showLocale"
			/>
			<div class="pkpFormPage__buttons" ref="buttons">
				<template v-if="isSaving">
					<span class="pkpFormPage__loading">
						<span class="pkpSpinner" aria-hidden="true"></span>
						{{ i18n.saving }}
					</span>
				</template>
				<template v-else>
					<pkp-button v-if="previousButton"
						v-bind="previousButton"
						@click="previousPage"
					/>
					<pkp-button v-if="submitButton"
						v-bind="submitButton"
						:disabled="isLastPage && !!Object.keys(errors).length"
						@click="submit"
					/>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import FormErrors from '@/components/Form/FormErrors.vue';
import FormGroup from '@/components/Form/FormGroup.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'FormPage',
	components: {
		FormErrors,
		FormGroup,
		PkpButton
	},
	props: {
		id: String,
		groups: Array,
		fields: Array,
		errors: Object,
		formId: String,
		isCurrentPage: Boolean,
		isLastPage: Boolean,
		primaryLocale: String,
		visibleLocales: Array,
		availableLocales: Array,
		submitButton: Object,
		previousButton: Object,
		isSaving: Boolean,
		i18n: Object
	},
	computed: {
		/**
		 * All groups assigned to this page
		 *
		 * @return array
		 */
		groupsInPage() {
			return this.groups.filter(
				group => group.pageId === this.id && this.shouldShowGroup(group)
			);
		},

		/**
		 * Is there any content to display in the footer?
		 *
		 * @return string
		 */
		hasFooter() {
			return (
				this.previousButton ||
				this.submitButton ||
				Object.keys(this.errors).length
			);
		}
	},
	watch: {
		/**
		 * When saving, set the focus to the button wrapper element so it doesn't
		 * get dropped as the dom updates
		 */
		isSaving() {
			this.$refs.buttons.focus();
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
		 * Submit the form page
		 */
		submit() {
			this.$emit('pageSubmitted', this.id);
		},

		/**
		 * Request the previous page
		 */
		previousPage() {
			this.$emit('previousPage', this.id);
		},

		/**
		 * Ask the Form to scroll to a field
		 *
		 * @param string fieldName
		 */
		showField: function(fieldName) {
			this.$emit('showField', fieldName);
		},

		/**
		 * Ask the Form to display a locale
		 *
		 * @param string localeKey
		 */
		showLocale: function(localeKey) {
			this.$emit('showLocale', localeKey);
		},

		/**
		 * Should a group be shown?
		 *
		 * @param object group One of this.groups
		 * @return boolean
		 */
		shouldShowGroup: function(group) {
			if (typeof group.showWhen === 'undefined') {
				return true;
			}
			const whenFieldName =
				typeof group.showWhen === 'string' ? group.showWhen : group.showWhen[0];
			const whenField = this.fields.find(field => field.name === whenFieldName);
			if (!whenField) {
				return false;
			}
			if (typeof group.showWhen === 'string') {
				return !!whenField.value;
			}
			return whenField.value === group.showWhen[1];
		},

		/**
		 * Pass an event up to the form to set the errors object
		 *
		 * @param object errors The new errors object
		 */
		setErrors: function(errors) {
			this.$emit('set-errors', errors);
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFormPage__footer {
	border-top: @bg-border-light;
	padding: @base;
	text-align: right;
}

.pkpFormPage__buttons {
	display: inline-block;
}

.pkpFormPage__loading {
	font-size: @font-tiny;

	.pkpSpinner {
		margin-right: 0.5em;
	}
}
</style>
