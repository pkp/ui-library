<template>
	<fieldset class="pkpFormField pkpFormField--options pkpFormField--metadata">
		<legend class="pkpFormField--options__legend">
			{{ label }}
			<tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span v-if="tooltip" class="-screenReader" :id="describedByTooltipId" v-html="tooltip" />
			<help-button v-if="helpTopic" :id="describedByHelpId" :topic="helpTopic" :section="helpSection" :label="i18n.help" />
		</legend>
		<div v-if="description"
			class="pkpFormField__description pkpFormField--options__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<field-error v-if="errors.length" :id="describedByErrorId" :messages="errors" />
		<div class="pkpFormField__control">
			<label v-for="option in options" :key="option.value" class="pkpFormField--options__option">
				<input
					class="pkpFormField--options__input"
					type="checkbox"
					v-model="isEnabled"
					:value="option.value"
					:aria-describedby="describedByIds"
					:aria-invalid="!!errors.length"
					:disabled="option.disabled"
				/>
				<span class="pkpFormField--options__optionLabel" v-html="option.label" />
			</label>
			<div v-if="isEnabled" class="pkpFormField--metadata__submissionOptions">
				<label v-for="option in submissionOptions" :key="'submission' + option.value" class="pkpFormField--options__option">
					<input
						class="pkpFormField--options__input pkpFormField--metadata__submissionInput"
						v-model="selectedValue"
						type="radio"
						:value="option.value"
						:aria-invalid="!!errors.length"
						:disabled="option.disabled"
					/>
					<span class="pkpFormField--options__optionLabel" v-html="option.label" />
				</label>
			</div>
		</div>
	</fieldset>
</template>

<script>
import FieldOptions from './FieldOptions.vue';

export default {
	name: 'FieldMetadataSetting',
	extends: FieldOptions,
	props: {
		// The value which matches a disabled state
		disabledValue: {
			type: Number,
			required: true,
		},
		// The value which matches an enabled state, but not when it is requested
		// or required during submission.
		enabledOnlyValue: {
			type: String,
			required: true,
		},
		value: {
			type: [Number, String],
			required: true,
		},
		submissionOptions: {
			type: Array,
			required: true,
		},
	},
	data: function () {
		return {
			isEnabled: this.disabledValue !== this.value,
		};
	},
	watch: {
		/**
		 * Whenever the submission value changes, emit an event to update the value
		 * of this field in the form component.
		 */
		isEnabled: function (newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.selectedValue = newVal ? this.enabledOnlyValue : this.disabledValue;
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--metadata__submissionOptions {
	margin: 1rem -1rem 0;
	padding: 1rem 1rem 0;
	border-top: @bg-border;
}
</style>
