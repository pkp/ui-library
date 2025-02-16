<template>
	<div class="pkpFormField pkpFormField--textarea" :class="classes">
		<div class="pkpFormField__heading">
			<FormFieldLabel
				:control-id="controlId"
				:label="label"
				:locale-label="localeLabel"
				:is-required="isRequired"
				:required-label="t('common.required')"
				:multilingual-label="multilingualLabel"
				class="align-middle"
			/>
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
		</div>
		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description"
		/>
		<div class="pkpFormField__control">
			<textarea
				:id="controlId"
				v-model="currentValue"
				class="pkpFormField__input pkpFormField--textarea__input"
				:name="localizedName"
				:aria-describedby="describedByIds"
				:aria-invalid="errors && errors.length"
				:required="isRequired"
			></textarea>
			<MultilingualProgress
				v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
			/>
		</div>
		<FieldError
			v-if="errors && errors.length"
			:id="describedByErrorId"
			:messages="errors"
		/>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import FieldError from '@/components/Form/FieldError.vue';

export default {
	name: 'FieldTextarea',
	components: {
		FormFieldLabel,
		Tooltip,
		HelpButton,
		MultilingualProgress,
		FieldError,
	},
	extends: FieldBase,
	props: {
		/** One of `small`, `normal` or `large`. Default: `normal`. */
		size: {
			type: String,
			default: 'normal',
			validator: function (value) {
				return ['small', 'normal', 'large'].indexOf(value) !== -1;
			},
		},
	},
	computed: {
		/**
		 * Classes added to the wrapper element
		 *
		 * @return {Array}
		 */
		classes() {
			return ['pkpFormField--' + this.size];
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--textarea__input {
	padding-top: 0.5em;
	padding-bottom: 0.5em;
	height: 20em;
	width: 100%;
	line-height: 1.8em;
}

.pkpFormField--small .pkpFormField--textarea__input {
	max-width: 20em;
	height: 8em;
}

.pkpFormField--large .pkpFormField--textarea__input {
	height: 40em;
}
</style>
