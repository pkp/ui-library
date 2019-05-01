<template>
	<fieldset class="pkpFormField pkpFormField--options pkpFormField--archivingPn" :class="classes">
		<legend class="pkpFormField--options__legend">
			<template v-if="localeLabel">
				<span class="aria-hidden">{{ localeLabel }}</span>
				<span class="-screenReader">{{ multilingualLabel }}</span>
			</template>
			<template v-else>
				{{ label }}
			</template>
			<span v-if="isRequired" class="pkpFormFieldLabel__required">
				*
				<span class="-screenReader">{{ i18n.required }}</span>
			</span>
			<tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span v-if="tooltip" class="-screenReader" :id="describedByTooltipId" v-html="tooltip" />
			<help-button v-if="helpTopic" :id="describedByHelpId" :topic="helpTopic" :section="helpSection" :label="i18n.help" />
		</legend>
		<div v-if="description"
			class="pkpFormField__description pkpFormField--options__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div v-if="terms && value"
			class="pkpFormField__description pkpFormField--options__description pkpFormField--archivingPn__terms"
			v-html="terms"
		/>
		<field-error v-if="errors.length" :id="describedByErrorId" :messages="errors" />
		<input type="hidden" v-model="selectedValue" />
		<div class="pkpFormField__control">
			<label v-for="option in localizedOptions" :key="option.value" class="pkpFormField--options__option">
				<input
					class="pkpFormField--options__input"
					v-model="selectedValue"
					:value="option.value"
					type="checkbox"
					:name="name"
					:aria-describedby="describedByIds"
					:aria-invalid="!!errors.length"
					:disabled="isSaving || option.disabled"
				/>
				{{ option.label }}
				<span v-if="isSaving" class="pkpSpinner" aria-hidden="true"></span>
			</label>
		</div>
	</fieldset>
</template>

<script>
import FieldOptions from './FieldOptions.vue';

export default {
	name: 'FieldArchivingPn',
	extends: FieldOptions,
	props: {
		value: {
			type: Boolean,
			required: true
		},
		terms: {
			type: String,
			required: true
		},
		enablePluginUrl: {
			type: String,
			required: true
		},
		disablePluginUrl: {
			type: String,
			required: true
		},
		settingsUrl: {
			type: String,
			required: true
		},
		csrfToken: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isSaving: false
		};
	},
	methods: {
		/**
		 * Add an event listener to show the settings modal when the button in the
		 * terms text is clicked.
		 */
		addSettingsListener() {
			this.$nextTick(() => {
				$('.pkpFormField--archivingPn__terms button', this.$el).click(e => {
					e.stopPropagation();
					e.preventDefault();

					var opts = {
						title: 'Test title',
						url: this.settingsUrl,
						closeCallback: this.resetFocus
					};

					$(
						'<div id="' +
							$.pkp.classes.Helper.uuid() +
							'" ' +
							'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>'
					).pkpHandler('$.pkp.controllers.modal.AjaxModalHandler', opts);

					return false;
				});
			});
		},

		/**
		 * Remove the event listener to show the settings modal
		 */
		removeSettingsListener() {
			$('.pkpFormField--archivingPn__terms button', this.$el).off();
		},

		/**
		 * Reset focus when the settings modal is closed
		 */
		resetFocus() {
			$('.pkpFormField--archivingPn__terms button', this.$el).focus();
		},

		/**
		 * When the plugin toggle request returns 200 HTTP status code
		 *
		 * The plugin gallery will return 200 whether or not the action was
		 * successful. We need to check the response to determine the status.
		 */
		success: function(r) {
			if (r.status) {
				pkp.eventBus.$emit('notify', {
					text: this.value
						? this.i18n.enablePluginSuccess
						: this.i18n.disablePluginSuccess
				});
			} else {
				pkp.eventBus.$emit('notify', {text: this.i18n.enablePluginError});
			}
		},

		/**
		 * When the plugin toggle request returns with an error
		 */
		error() {
			pkp.eventBus.$emit('notify', {text: this.i18n.enablePluginError});
		},

		/**
		 * When the plugin toggle request is finished
		 */
		complete() {
			this.isSaving = false;
		}
	},
	watch: {
		/**
		 * When the input value changes, update the selected value if the input
		 * option is the currently selected option
		 */
		value: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			if (newVal) {
				this.addSettingsListener();
			} else {
				this.removeSettingsListener();
			}

			this.isSaving = true;

			$.ajax({
				method: 'POST',
				url: newVal ? this.enablePluginUrl : this.disablePluginUrl,
				data: {
					csrfToken: this.csrfToken,
					disableNotification: false
				},
				success: this.success,
				error: this.error,
				complete: this.complete
			});
		}
	},
	mounted() {
		/**
		 * Add the event listener to show the settings modal
		 */
		if (this.value) {
			this.addSettingsListener();
		}
	},
	beforeDestroy() {
		/**
		 * Remove the event listener for the settings button
		 */
		if (!this.value) {
			$('.pkpFormField--archivingPn__terms button', this.$el).off();
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--archivingPn .pkpFormField--archivingPn__terms button {
	display: inline;
	padding: 0;
	border: none;
	background: transparent;
	color: @primary;
	text-decoration: underline;
	cursor: pointer;

	&:hover,
	&:focus {
		color: @primary-lift;
	}
}
</style>
