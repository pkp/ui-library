<template>
	<div class="mt-5 max-w-lg">
		<div class="pkpFormField__heading">
			<FormFieldLabel
				:id="labelId"
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
		<div class="mt-2 flex">
			<div class="mt-3 grow">
				<div class="px-2">
					<Slider
						v-model="currentValue"
						:min="min"
						:max="max"
						:step="step"
						class="w-full"
						:aria-labelledby="labelId"
						:pt="sliderStyling"
					/>
				</div>
				<div class="mt-2 flex justify-between text-base-normal text-secondary">
					<div>{{ minLabel || min }}</div>
					<div>{{ maxLabel || max }}</div>
				</div>
			</div>
			<div
				class="ms-3 w-48 self-start rounded border border-form-fields p-2 text-center text-base-normal text-secondary"
			>
				{{ displayedValue }}
			</div>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import Slider from 'primevue/slider';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';

export default {
	name: 'FieldSlider',
	components: {Slider, Tooltip, HelpButton, FormFieldLabel},
	extends: FieldBase,
	props: {
		min: {required: true, type: Number},
		max: {required: true, type: Number},
		step: {required: false, type: Number, default: 1},
		minLabel: {required: false, type: String, default: null},
		maxLabel: {required: false, type: String, default: null},
		/** Expecting translation key, which gets the value passed to it as {$value} */
		valueLabel: {required: false, type: String, default: null},
		valueLabelMin: {required: false, type: String, default: null},
		valueLabelMax: {required: false, type: String, default: null},
	},
	data() {
		const sliderStyling = {
			root: ({props}) => ({
				class: [
					'relative',
					// Size
					{
						'h-1 w-60': props.orientation == 'horizontal',
					},
					// Shape
					'border-0',
					// Colors
					'bg-[#BBBBBB]',
					// States
					{
						// Disabled use cases is not used, styling to be refine when needed

						'select-none pointer-events-none cursor-default': props.disabled,
					},
				],
			}),
			range: ({props}) => ({
				class: [
					// Position
					'block absolute',
					{
						'top-0 left-0': props.orientation == 'horizontal',
					},
					//Size
					{
						'h-full': props.orientation == 'horizontal',
					},
					// Colors
					'bg-primary',
				],
			}),
			handle: ({props, options}) => {
				return {
					id: this.controlId,
					'aria-valuetext': this.displayedValue,
					'aria-describedby': this.describedByIds,

					class: [
						'block',
						// Size
						'h-[1.143rem]',
						'w-[1.143rem]',
						{
							'top-[50%] mt-[-0.5715rem] ml-[-0.5715rem]':
								props.orientation == 'horizontal',
							'left-[50%] mb-[-0.5715rem] ml-[-0.5715rem]':
								props.orientation == 'vertical',
						},
						// Shape
						'rounded-full',
						'border-2',
						// Colors
						'bg-primary',
						'border-primary',

						// States
						'hover:bg-hover hover:border-primary-500',
						'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring',
						'ring-primary/50',
						// Transitions
						'transition duration-200',
						// Misc
						'cursor-grab',
						'touch-action-none',
					],
				};
			},
			// Additional styling is available if we need to have two handlers for range capabilities
		};

		return {sliderStyling};
	},
	computed: {
		displayedValue() {
			if (
				this.valueLabelMin &&
				(this.currentValue == this.min ||
					this.currentValue == null ||
					this.currentValue == undefined)
			) {
				return this.replaceLocaleParams(this.valueLabelMin, {
					value: this.currentValue,
				});
			}
			if (this.valueLabelMax && this.currentValue == this.max) {
				return this.replaceLocaleParams(this.valueLabelMax, {
					value: this.currentValue,
				});
			}

			if (this.valueLabel) {
				return this.replaceLocaleParams(this.valueLabel, {
					value: this.currentValue,
				});
			}

			return this.currentValue;
		},
	},
};
</script>
