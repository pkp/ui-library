<template>
	<fieldset class="pkpFormField pkpFormField--color">
		<legend class="pkpFormField__heading--legend">
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
			class="pkpFormField__description"
		/>
		<div class="pkpFormField__control">
			<color-picker
				:model-value="currentValue"
				:disable-alpha="true"
				@update:model-value="setValue"
			/>
			<FieldError
				v-if="errors && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</fieldset>
</template>

<script>
import FieldBase from './FieldBase.vue';
import {Chrome} from '@lk77/vue3-color';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';

export default {
	name: 'FieldColor',
	components: {
		'color-picker': Chrome,
		Tooltip,
		HelpButton,
		FieldError,
	},
	extends: FieldBase,
	methods: {
		/**
		 * Update the current value when the color picker changes
		 *
		 * @param {String} newVal
		 */
		setValue: function (newVal) {
			if (newVal.hex === this.currentValue) {
				return;
			}
			this.currentValue = newVal.hex;
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--color {
	padding: 0;
	border: none;
}

.pkpFormField__heading--legend {
	font-weight: @bold;
}

.pkpFormField--color .vc-chrome {
	box-shadow: none;
	border: @bg-border;
	border-radius: 2px;
}
</style>
