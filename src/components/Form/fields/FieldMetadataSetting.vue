<template>
	<fieldset class="pkpFormField pkpFormField--options pkpFormField--metadata">
		<legend class="pkpFormField--options__legend">
			<span class="align-middle">{{ label }}</span>
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
		<FieldError
			v-if="errors && errors.length"
			:id="describedByErrorId"
			:messages="errors"
		/>
		<div class="pkpFormField__control">
			<label
				v-for="option in options"
				:key="option.value"
				class="pkpFormField--options__option"
			>
				<input
					v-model="isEnabled"
					class="pkpFormField--options__input"
					type="checkbox"
					:value="option.value"
					:aria-describedby="describedByIds"
					:aria-invalid="errors && errors.length"
					:disabled="option.disabled"
				/>
				<span
					v-strip-unsafe-html="option.label"
					class="pkpFormField--options__optionLabel"
				/>
			</label>
			<div v-if="isEnabled" class="pkpFormField--metadata__submissionOptions">
				<label
					v-for="option in submissionOptions"
					:key="'submission' + option.value"
					class="pkpFormField--options__option"
				>
					<input
						v-model="selectedValue"
						class="pkpFormField--options__input pkpFormField--metadata__submissionInput"
						type="radio"
						:value="option.value"
						:aria-invalid="errors && errors.length"
						:disabled="option.disabled"
					/>
					<span
						v-strip-unsafe-html="option.label"
						class="pkpFormField--options__optionLabel"
					/>
				</label>
			</div>
		</div>
	</fieldset>
</template>

<script>
import FieldOptions from './FieldOptions.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';

export default {
	name: 'FieldMetadataSetting',
	components: {Tooltip, HelpButton, FieldError},
	extends: FieldOptions,
	props: {
		/** The value which matches a disabled state. Usually the `METADATA_DISABLE` constant. */
		disabledValue: {
			type: Number,
			required: true,
		},
		/** The value which matches an enabled state, but not when it is requested or required during submission. Usually the `METADATA_ENABLE` constant. */
		enabledOnlyValue: {
			type: String,
			required: true,
		},
		/** The current value for this field.  */
		value: {
			type: [Number, String],
			required: true,
		},
		/** Options for when the metadata should be requested or required. Usually includes the `METADATA_ENABLE`, `METADATA_REQUEST` and `METADATA_REQUIRE` constants. */
		submissionOptions: {
			type: Array,
			required: true,
		},
	},
	data() {
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
