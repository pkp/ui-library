<template>
	<div class="pkpFormField pkpFormField--multiSelect">
		<div class="pkpFormField__heading">
			<FormFieldLabel
				:id="labelId"
				:label="label"
				:locale-label="localeLabel"
				:is-required="showRequired"
				:required-label="t('common.required')"
				:multilingual-label="multilingualLabel"
				class="align-middle"
			/>
			<Tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				:id="describedByTooltipId"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
		</div>
		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description semantic-defaults"
		/>
		<div
			class="pkpFormField__control"
			:class="{
				'pkpFormField__control--hasMultilingualIndicator':
					isMultilingual && locales.length > 1,
			}"
		>
			<MultiSelect
				:model-value="currentValue ?? []"
				:options="localizedOptions"
				:placeholder="placeholder"
				:disabled="disabled"
				:labelled-by="labelId"
				:aria-describedby="describedByIds"
				@update:model-value="currentValue = $event"
			/>
			<MultilingualProgress
				v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
			/>
			<FieldError
				v-if="errors && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import MultiSelect from '@/components/MultiSelect/MultiSelect.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import FieldError from '@/components/Form/FieldError.vue';

export default {
	name: 'FieldMultiSelect',
	components: {
		FormFieldLabel,
		MultiSelect,
		Tooltip,
		MultilingualProgress,
		FieldError,
	},
	extends: FieldBase,
	props: {
		/** An array of objects defining the options which can be selected. */
		options: {
			type: [Array, Object],
			required: true,
		},
		/** The current value for this field. An array of selected option values. */
		value: {
			type: Array,
			required: true,
		},
		/** Text shown in the control when no option is selected. */
		placeholder: {
			type: String,
			default: null,
		},
		/** Whether the field is disabled. */
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		/**
		 * Get localized set of options
		 *
		 * @return {Array}
		 */
		localizedOptions() {
			return this.isMultilingual ? this.options[this.localeKey] : this.options;
		},
	},
};
</script>
