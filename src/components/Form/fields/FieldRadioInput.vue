<template>
	<fieldset class="pkpFormField pkpFormField--options" :class="classes">
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
			<Tooltip
				v-if="isPrimaryLocale && tooltip"
				aria-hidden="true"
				:tooltip="tooltip"
				label=""
			/>
			<span
				v-if="isPrimaryLocale && tooltip"
				:id="describedByTooltipId"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
			<HelpButton
				v-if="isPrimaryLocale && helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="t('help.help')"
			/>
		</legend>
		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description pkpFormField--options__description"
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
				<template v-if="!option.isInput">
					<input
						v-model="selectedValue"
						class="pkpFormField--options__input"
						:value="option.value"
						type="radio"
						:name="localizedName"
						:aria-describedby="describedByIds"
						:aria-invalid="errors && errors.length"
						:disabled="option.disabled"
					/>
					{{ option.label }}
				</template>
				<template v-else>
					<input
						ref="inputRadio"
						class="pkpFormField--options__input"
						type="radio"
						:name="localizedName"
						:aria-describedby="describedByIds"
						:aria-invalid="errors && errors.length"
						:disabled="option.disabled"
						@change="selectInput"
					/>
					<span v-if="option.label">{{ option.label }}</span>
					<input
						ref="inputText"
						v-model="inputValue"
						class="pkpFormField__input pkpFormField--options__input--text"
						type="text"
						:aria-describedby="describedByIds"
						:aria-invalid="errors && errors.length"
						:disabled="option.disabled"
						@focus="selectInput"
					/>
				</template>
			</label>
			<MultilingualProgress
				v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
			/>
		</div>
	</fieldset>
</template>

<script>
import FieldOptions from './FieldOptions.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';

export default {
	name: 'FieldRadioInput',
	components: {Tooltip, HelpButton, FieldError, MultilingualProgress},
	extends: FieldOptions,
	props: {
		/** Current value */
		value: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			inputValue: '',
		};
	},
	computed: {
		/**
		 * Is the input option the currently selected option?
		 *
		 * @return {Boolean}
		 */
		isInputSelected() {
			return !this.localizedOptions
				.filter((opt) => !opt.isInput)
				.map((opt) => opt.value)
				.includes(this.selectedValue);
		},
	},
	watch: {
		/**
		 * When the input value changes, update the selected value if the input
		 * option is the currently selected option
		 */
		inputValue: function (newVal, oldVal) {
			if (newVal === oldVal || !this.isInputSelected) {
				return;
			}
			this.selectedValue = this.inputValue;
		},
	},
	mounted() {
		/**
		 * Put the value into the input field if it doesn't match one of the
		 * existing options.
		 */
		if (this.isInputSelected) {
			this.inputValue = this.isMultilingual
				? this.value[this.localeKey]
				: this.value;
			if (this.$refs.inputRadio?.[0]) {
				this.$refs.inputRadio[0].checked = true;
			}
		}
	},
	methods: {
		/**
		 * Select the option with an input field
		 */
		selectInput() {
			this.selectedValue = this.inputValue;
			this.$refs.inputRadio[0].checked = true;
			this.$refs.inputText[0].focus();
		},

		/**
		 * Set the seletected value to the input field's vale
		 */
		setInputToSelected() {
			this.selectedValue = this.inputValue;
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--options__input--text {
	display: inline-block;
	margin-left: 0.5em;
	padding: 0 0.5em;
	line-height: 1.8rem;
	height: 1.8rem;
}
</style>
