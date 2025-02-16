<template>
	<fieldset
		class="pkpFormField pkpFormField--options pkpFormField--archivingPn"
		:class="classes"
	>
		<legend class="pkpFormField--options__legend">
			<template v-if="localeLabel">
				<span class="aria-hidden align-middle">{{ localeLabel }}</span>
				<span class="-screenReader">{{ multilingualLabel }}</span>
			</template>
			<template v-else>
				<span class="align-middle">{{ label }}</span>
			</template>
			<span v-if="isRequired" class="pkpFormFieldLabel__required">
				*
				<span class="-screenReader">{{ t('common.required') }}</span>
			</span>
			<Tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				:id="describedByTooltipId"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
			<HelpButton
				v-if="helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="t('help.help')"
			/>
		</legend>
		<div
			v-if="description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description pkpFormField--options__description"
		/>
		<div
			v-if="terms && value"
			v-strip-unsafe-html="terms"
			class="pkpFormField__description pkpFormField--options__description pkpFormField--archivingPn__terms"
		/>
		<FieldError
			v-if="errors && errors.length"
			:id="describedByErrorId"
			:messages="errors"
		/>
		<input v-model="selectedValue" type="hidden" />
		<div class="pkpFormField__control">
			<label
				v-for="option in localizedOptions"
				:key="option.value"
				class="pkpFormField--options__option"
			>
				<input
					v-model="selectedValue"
					class="pkpFormField--options__input"
					:value="option.value"
					type="checkbox"
					:name="name"
					:aria-describedby="describedByIds"
					:aria-invalid="errors && errors.length"
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
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';

export default {
	name: 'FieldArchivingPn',
	components: {Tooltip, HelpButton, FieldError},
	extends: FieldOptions,
	props: {
		/** The current value for this field. */
		value: {
			type: Boolean,
			required: true,
		},
		/** An HTML string with a `<button>` that can be used to open the preservation plugin's settings modal. **Note: the modal will not open in this demonstration.**  */
		terms: {
			type: String,
			required: true,
		},
		disablePluginSuccess: {
			type: String,
			required: true,
		},
		enablePluginSuccess: {
			type: String,
			required: true,
		},
		/** A URL to send a request to the plugin grid handler to enable this plugin. */
		enablePluginUrl: {
			type: String,
			required: true,
		},
		/** A URL to send a request to the plugin grid handler to disable this plugin. */
		disablePluginUrl: {
			type: String,
			required: true,
		},
		/** A URL to send a request to the plugin grid handler to display the settings for this plugin. **Note: the modal will not open in this demonstration.** */
		settingsUrl: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			isSaving: false,
		};
	},
	watch: {
		/**
		 * When the input value changes, update the selected value if the input
		 * option is the currently selected option
		 */
		value: function (newVal, oldVal) {
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
					csrfToken: pkp.currentUser.csrfToken,
					disableNotification: false,
				},
				success: this.success,
				error: this.error,
				complete: this.complete,
			});
		},
	},
	mounted() {
		/**
		 * Add the event listener to show the settings modal
		 */
		if (this.value) {
			this.addSettingsListener();
		}
	},
	beforeUnmount() {
		/**
		 * Remove the event listener for the settings button
		 */
		if (!this.value) {
			$('.pkpFormField--archivingPn__terms button', this.$el).off();
		}
	},
	methods: {
		/**
		 * Add an event listener to show the settings modal when the button in the
		 * terms text is clicked.
		 */
		addSettingsListener() {
			this.$nextTick(() => {
				$('.pkpFormField--archivingPn__terms button', this.$el).click((e) => {
					e.stopPropagation();
					e.preventDefault();

					var opts = {
						title: 'Test title',
						url: this.settingsUrl,
						closeCallback: this.resetFocus,
					};

					$(
						'<div id="' +
							$.pkp.classes.Helper.uuid() +
							'" ' +
							'class="pkp_modal pkpModalWrapper" tabindex="-1"></div>',
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
		success: function (r) {
			if (r.status) {
				pkp.eventBus.$emit(
					'notify',
					this.value ? this.enablePluginSuccess : this.disablePluginSuccess,
					'success',
				);
			} else {
				pkp.eventBus.$emit('notify', this.t('common.unknownError'), 'warning');
			}
		},

		/**
		 * When the plugin toggle request returns with an error
		 */
		error() {
			pkp.eventBus.$emit('notify', this.enablePluginError, 'warning');
		},

		/**
		 * When the plugin toggle request is finished
		 */
		complete() {
			this.isSaving = false;
		},
	},
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
