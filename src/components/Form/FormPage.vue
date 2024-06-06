<template>
	<div class="pkpFormPage" :class="{'pkpFormPage--current': isCurrentPage}">
		<form-group
			v-for="group in groupsInPage"
			:key="group.id"
			v-bind="group"
			:fields="fields"
			:errors="errors"
			:primary-locale="primaryLocale"
			:visible-locales="visibleLocales"
			:available-locales="availableLocales"
			:form-id="formId"
			@change="fieldChanged"
			@set-errors="setErrors"
		/>
		<button-row
			v-if="hasFooter"
			ref="footer"
			class="pkpFormPage__footer"
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
						{{ t('common.saving') }}
					</span>
					<span v-else-if="hasRecentSave" class="pkpFormPage__status">
						<icon icon="check" :inline="true" />
						{{ t('form.saved') }}
					</span>
				</transition>
			</span>
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
					isSaving || !canSubmit || (isLastPage && !!Object.keys(errors).length)
				"
				@click="submit"
			>
				{{ submitButton.label }}
			</pkp-button>
		</button-row>
	</div>
</template>

<script>
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import FormErrors from '@/components/Form/FormErrors.vue';
import FormGroup from '@/components/Form/FormGroup.vue';
import {shouldShowGroup} from './formHelpers';
export default {
	name: 'FormPage',
	components: {
		ButtonRow,
		FormErrors,
		FormGroup,
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
			},
		},
		isSaving: Boolean,
	},
	data() {
		return {
			hasRecentSave: false,
			recentSaveInterval: null,
		};
	},
	computed: {
		/**
		 * All groups assigned to this page
		 *
		 * @return {Array}
		 */
		groupsInPage() {
			return this.groups.filter(
				(group) =>
					group.pageId === this.id && shouldShowGroup(group, this.fields),
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
		},
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
	unmounted() {
		clearInterval(this.recentSaveInterval);
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
		fieldChanged: function (name, prop, value, localeKey) {
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
		showField: function (fieldName) {
			this.$emit('showField', fieldName);
		},

		/**
		 * Ask the Form to display a locale
		 *
		 * @param {String} localeKey
		 */
		showLocale: function (localeKey) {
			this.$emit('showLocale', localeKey);
		},

		/**
		 * Pass an event up to the form to set the errors object
		 *
		 * @param {Object} errors The new errors object
		 */
		setErrors: function (errors) {
			this.$emit('set-errors', errors);
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFormPage__footer {
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	border-top: @bg-border-light;
	padding: 1rem;

	> .pkpButton {
		white-space: nowrap;
		flex-shrink: 0;
	}
}

.pkpFormPage__buttons {
	display: flex;
	justify-content: space-between;
	gap: 0.5rem;
}

.pkpFormPage__status {
	font-size: @font-tiny;
	transition: all 0.3s;
	white-space: nowrap;
	flex-shrink: 0;

	.fa {
		color: @yes;
	}

	.pkpSpinner {
		margin-inline-end: 0.25rem;
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
