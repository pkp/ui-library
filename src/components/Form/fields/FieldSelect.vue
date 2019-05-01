<template>
	<div class="pkpFormField pkpFormField--select">
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="controlId"
				:label="label"
				:localeLabel="localeLabel"
				:isRequired="isRequired"
				:requiredLabel="i18n.required"
				:multilingualLabel="multilingualLabel"
			/>
			<tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span v-if="tooltip" class="-screenReader" :id="describedByTooltipId" v-html="tooltip" />
			<help-button v-if="helpTopic" :id="describedByHelpId" :topic="helpTopic" :section="helpSection" :label="i18n.help" />
		</div>
		<div v-if="isPrimaryLocale && description"
			class="pkpFormField__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div class="pkpFormField__control" :class="{'pkpFormField__control--hasMultilingualIndicator': isMultilingual && locales.length > 1}">
			<select
				class="pkpFormField__input pkpFormField--select__input"
				v-model="currentValue"
				:id="controlId"
				:name="localizedName"
				:aria-describedby="describedByIds"
				:aria-invalid="!!errors.length"
				:required="isRequired"
			>
				<option v-for="option in localizedOptions" :key="option.value" v-bind="option">{{ option.label }}</option>
			</select>
			<multilingual-progress v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
				:i18n="i18n"
			/>
			<field-error v-if="errors.length" :id="describedByErrorId" :messages="errors" />
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';

export default {
	name: 'FieldSelect',
	extends: FieldBase,
	props: {
		options: Array
	},
	computed: {
		/**
		 * Get localized set of options
		 *
		 * @return {Array}
		 */
		localizedOptions() {
			return this.isMultingual ? this.options[this.localeKey] : this.options;
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--select__input {
	width: 20em;
}

.pkpFormField--select__input:-moz-focusring {
	color: transparent;
	text-shadow: 0 0 0 @text;
}

.pkpFormField__control--hasMultilingualIndicator .pkpFormField--select__input {
	padding-left: 3rem;
}

.pkpFormField--select .multilingualProgress {
	position: absolute;
	top: 0;
	left: 0;

	button {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid transparent;
		border-right: @bg-border;

		&:focus {
			outline: 0;
			border-color: @primary;
			box-shadow: 0 3px 0 @primary;

			.fa {
				color: @primary;
			}
		}
	}

	.fa {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}

.pkpFormField--select__input:hover + .multilingualProgress button {
	border-color: @shade;
}

.pkpFormField--select__input:focus + .multilingualProgress button {
	border-color: @primary;
}
</style>
