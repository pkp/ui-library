<template>
	<div class="pkpFormField pkpFormField--select">
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
		</div>
		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description"
		/>
		<div
			class="pkpFormField__control"
			:class="{
				'pkpFormField__control--hasMultilingualIndicator':
					isMultilingual && locales.length > 1,
			}"
		>
			<select
				:id="controlId"
				v-model="currentValue"
				class="pkpFormField__input pkpFormField--select__input"
				:class="inputClasses"
				:name="localizedName"
				:aria-describedby="describedByIds"
				:aria-invalid="errors && errors.length"
				:required="isRequired"
			>
				<option
					v-for="option in localizedOptions"
					:key="option.value"
					v-bind="option"
				>
					{{ option.label }}
				</option>
			</select>
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
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';

export default {
	name: 'FieldSelect',
	components: {
		FormFieldLabel,
		Tooltip,
		MultilingualProgress,
		HelpButton,
		FieldError,
	},
	extends: FieldBase,
	props: {
		/**   An optional object containing preset information. When preset information exists, a button will appear in the toolbar. */
		options: Array,
		/** One of `small`, `normal` or `large`. Default: `normal`. */
		size: {
			default: 'normal',
			validator: function (value) {
				return ['normal', 'large'].indexOf(value) !== -1;
			},
		},
	},

	computed: {
		inputClasses() {
			let classes = ['pkpFormField--select__input--size' + this.size];
			return classes;
		},

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

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--select__input--sizenormal {
	width: 20em;
}

.pkpFormField--select__input--sizelarge {
	width: 100%;
}

.pkpFormField--select__input:-moz-focusring {
	color: transparent;
	text-shadow: 0 0 0 @text;
}

.pkpFormField__control--hasMultilingualIndicator .pkpFormField--select__input {
	padding-inline-start: 3rem;
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

[dir='rtl'] {
	.pkpFormField--select .multilingualProgress {
		left: auto;
		right: 0;

		button {
			left: auto;
			right: 0;
		}
	}
}
</style>
