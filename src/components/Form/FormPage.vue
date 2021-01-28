<template>
	<div class="pkpFormPage" :class="{'pkpFormPage--current': isCurrentPage}">
		<form-group
			v-for="group in groupsInPage"
			:key="group.id"
			v-bind="group"
			:fields="fields"
			:errors="errors"
			:primaryLocale="primaryLocale"
			:visibleLocales="visibleLocales"
			:availableLocales="availableLocales"
			:formId="formId"
			@change="fieldChanged"
			@set-errors="setErrors"
		/>
		<div
			v-if="hasFooter"
			class="pkpFormPage__footer"
			ref="footer"
			aria-live="polite"
		>
			<form-errors
				v-if="Object.keys(errors).length"
				:errors="errors"
				:fields="fields"
				@showField="showField"
				@showLocale="showLocale"
			/>
			<span role="status" aria-live="polite" aria-atomic="true">
				<transition name="pkpFormPage__status">
					<span v-if="isSaving" class="pkpFormPage__status">
						<spinner />
						{{ __('common.saving') }}
					</span>
					<span v-else-if="hasRecentSave" class="pkpFormPage__status">
						<icon icon="check" :inline="true" />
						{{ __('form.saved') }}
					</span>
				</transition>
			</span>
			<div class="pkpFormPage__buttons" ref="buttons">
				<template>
					<pkp-button
						v-if="previousButton"
						v-bind="previousButton"
						@click="previousPage"
					>
						{{ previousButton.label }}
					</pkp-button>
					<pkp-button
						v-if="submitButton"
						v-bind="submitButton"
						:disabled="
							isSaving ||
								!canSubmit ||
								(isLastPage && !!Object.keys(errors).length)
						"
						@click="submit"
					>
						{{ submitButton.label }}
					</pkp-button>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import FormErrors from '@/components/Form/FormErrors.vue';
import FormGroup from '@/components/Form/FormGroup.vue';

export default {
	name: 'FormPage',
	components: {
		FormErrors,
		FormGroup
	},
	data() {
		return {
			hasRecentSave: false,
			recentSaveInterval: null
		};
	},
	props: {
		id: String,
		groups: Array,
		fields: Array,
		errors: Object,
		formId: String,
		isCurrentPage: Boolean,
		isLastPage: Boolean,
		lastSaveTimestamp: Number,
		primaryLocale: String,
		visibleLocales: Array,
		availableLocales: Array,
		submitButton: Object,
		previousButton: Object,
		canSubmit: {
			type: Boolean,
			default() {
				return true;
			}
		},
		isSaving: Boolean
	},
	computed: {
		/**
		 * All groups assigned to this page
		 *
		 * @return {Array}
		 */
		groupsInPage() {
			return this.groups.filter(
				group => group.pageId === this.id && this.shouldShowGroup(group)
			);
		},

		/**
		 * Is there any content to display in the footer?
		 *
		 * @return {String}
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
		 * Emit an event when a field's prop has changed
		 *
		 * @param {String} name Name of the field to modify
		 * @param {String} prop Name of the prop to modify
		 * @param {mixed} value The new value for the prop
		 * @param {String} localeKey Optional locale key for multilingual props
		 * }}
		 */
		fieldChanged: function(name, prop, value, localeKey) {
			this.$emit('change', name, prop, value, localeKey);
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
		 * @param {String} fieldName
		 */
		showField: function(fieldName) {
			this.$emit('showField', fieldName);
		},

		/**
		 * Ask the Form to display a locale
		 *
		 * @param {String} localeKey
		 */
		showLocale: function(localeKey) {
			this.$emit('showLocale', localeKey);
		},

		/**
		 * Should a group be shown?
		 *
		 * @param {Object} group One of this.groups
		 * @return {Boolean}
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
		 * @param {Object} errors The new errors object
		 */
		setErrors: function(errors) {
			this.$emit('set-errors', errors);
		}
	},
	mounted() {
		/**
		 * Set an interval timer to check if there is a recent save
		 */
		this.recentSaveInterval = setInterval(() => {
			const expire = this.lastSaveTimestamp + 5000;
			if (this.hasRecentSave && expire < Date.now()) {
				this.hasRecentSave = false;
			} else if (!this.hasRecentSave && expire > Date.now()) {
				this.hasRecentSave = true;
			}
		}, 250);
	},
	destroyed() {
		clearInterval(this.recentSaveInterval);
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFormPage__footer {
	border-top: @bg-border-light;
	padding: 1rem;
	text-align: right;
}

.pkpFormPage__buttons {
	display: inline-block;

	> * + * {
		margin-left: 0.5em;
	}
}

.pkpFormPage__status {
	display: inline-block;
	margin-right: 0.5rem;
	font-size: @font-tiny;
	transition: all 0.3s;
	text-align: right;

	.fa {
		color: @yes;
	}

	.pkpSpinner {
		margin-right: 0.25rem;
	}
}

.pkpFormPage__status-enter {
	transform: translateY(0.5rem);
	opacity: 0;
}

.pkpFormPage__status-leave-to {
	transform: translateY(-0.5rem);
	opacity: 0;
}

// When forms appear in a dropdown
.pkpDropdown .pkpFormPage__footer {
	padding: 0.5rem;
	border-top: none;
}
</style>
