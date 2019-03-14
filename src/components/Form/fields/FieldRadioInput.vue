<template>
	<fieldset class="pkpFormField pkpFormField--options" :class="classes">
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
			<tooltip v-if="isPrimaryLocale && tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span v-if="isPrimaryLocale && tooltip" class="-screenReader" :id="describedByTooltipId" v-html="tooltip" />
			<help-button v-if="isPrimaryLocale && helpTopic" :id="describedByHelpId" :topic="helpTopic" :section="helpSection" :label="i18n.help" />
		</legend>
		<div v-if="isPrimaryLocale && description"
			class="pkpFormField__description pkpFormField--options__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<field-error v-if="errors.length" :id="describedByErrorId" :messages="errors" />
		<input type="hidden" v-model="selectedValue" />
		<div class="pkpFormField__control">
			<label v-for="option in localizedOptions" :key="option.value" class="pkpFormField--options__option">
				<template v-if="!option.isInput">
					<input
						class="pkpFormField--options__input"
						v-model="selectedValue"
						:value="option.value"
						type="radio"
						:name="name"
						:aria-describedby="describedByIds"
						:aria-invalid="!!errors.length"
						:disabled="option.disabled"
					/>
					{{ option.label }}
				</template>
				<template v-else>
					<input
						class="pkpFormField--options__input"
						type="radio"
						ref="inputRadio"
						:name="name"
						:aria-describedby="describedByIds"
						:aria-invalid="!!errors.length"
						:disabled="option.disabled"
						@change="selectInput"
					/>
					<span v-if="option.label">{{ option.label }}</span>
					<input
						class="pkpFormField__input pkpFormField--options__input--text"
						type="text"
						v-model="inputValue"
						ref="inputText"
						:aria-describedby="describedByIds"
						:aria-invalid="!!errors.length"
						:disabled="option.disabled"
						@focus="selectInput"
					/>
				</template>
			</label>
			<multilingual-progress v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
				:i18n="i18n"
			/>
		</div>
	</fieldset>
</template>

<script>
import FieldOptions from './FieldOptions.vue';

export default {
	name: 'FieldRadioInput',
	extends: FieldOptions,
	props: {
		value: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			inputValue: ''
		};
	},
	computed: {
		/**
		 * Is the input option the currently selected option?
		 *
		 * @return {Boolean}
		 */
		isInputSelected() {
			return !this.options
				.filter(opt => !opt.isInput)
				.map(opt => opt.value)
				.includes(this.selectedValue);
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
		}
	},
	watch: {
		/**
		 * When the input value changes, update the selected value if the input
		 * option is the currently selected option
		 */
		inputValue: function(newVal, oldVal) {
			if (newVal === oldVal || !this.isInputSelected) {
				return;
			}
			this.selectedValue = this.inputValue;
		}
	},
	mounted() {
		/**
		 * Put the value into the input field if it doesn't match one of the
		 * existing options.
		 */
		if (this.isInputSelected) {
			this.inputValue = this.value;
			this.$refs.inputRadio[0].checked = true;
		}
	}
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
