<template>
	<fieldset class="pkpFormField pkpFormField--color">
		<legend class="pkpFormField__heading--legend">
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
			class="pkpFormField__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div class="pkpFormField__control">
			<color-picker :value="currentValue" @input="setValue" :disableAlpha="true" />
			<field-error v-if="errors.length" :id="describedByErrorId" :messages="errors" />
		</div>
	</fieldset>
</template>

<script>
import FieldBase from './FieldBase.vue';
import {Chrome} from 'vue-color';

export default {
	name: 'FieldColor',
	extends: FieldBase,
	components: {
		'color-picker': Chrome
	},
	methods: {
		/**
		 * Update the current value when the color picker changes
		 *
		 * @param {String} newVal
		 */
		setValue: function(newVal) {
			if (newVal.hex === this.currentValue) {
				return;
			}
			this.currentValue = newVal.hex;
		}
	}
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
