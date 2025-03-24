<template>
	<fieldset class="pkpFormField pkpFormField--contrastColor">
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
				class="-screenReader"
				v-html="tooltip"
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
			class="pkpFormField__description"
			v-html="description"
		/>
		<div class="pkpFormField__control">
			<div class="pkpFormField__threeColumnsRow">
				<div class="pkpFormField__colorPickerColumn">
					<div class="pkpFormField__colorPickerLabel">Color 1</div>
					<color-picker
						:model-value="color1"
						:disable-alpha="true"
						@update:model-value="setColor1"
					/>
				</div>
				<div class="pkpFormField__colorPickerColumn">
					<div class="pkpFormField__colorPickerLabel">Color 2</div>
					<color-picker
						:model-value="color2"
						:disable-alpha="true"
						@update:model-value="setColor2"
					/>
				</div>
				<div class="pkpFormField__contrastValueColumn">
					<div class="pkpFormField__colorPickerLabel">Contrast Ratio</div>
					<!-- Text sample with the selected colors -->
					<div
						class="pkpFormField__textSample"
						:style="{
							backgroundColor: color1.hex,
							color: color2.hex,
						}"
					>
						<span class="pkpFormField__textSampleContent">Text</span>
					</div>
					<div class="pkpFormField__contrastValueDisplay">
						<span class="pkpFormField__contrastValueNumber">
							{{ currentContrast.toFixed(2) }}
						</span>
					</div>
				</div>
			</div>

			<div class="pkpFormField__contrastCategories">
				<div
					v-for="category in contrastCategories"
					:key="category.value"
					class="pkpFormField__contrastCategory"
					:class="{
						'pkpFormField__contrastCategory--pass':
							currentContrast >= category.value,
						'pkpFormField__contrastCategory--fail':
							currentContrast < category.value,
					}"
				>
					{{ category.label }}
				</div>
			</div>

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
	name: 'FieldContrastColorPicker',
	components: {
		'color-picker': Chrome,
		Tooltip,
		HelpButton,
		FieldError,
	},
	extends: FieldBase,
	data() {
		return {
			color1: {hex: '#1E6292'},
			color2: {hex: '#FFFFFF'},
			currentContrast: 0,
			contrastCategories: [
				{value: 3, label: 'AA Large Text (3:1)'},
				{value: 4.5, label: 'AA Normal Text (4.5:1)'},
				{value: 7, label: 'AAA Normal Text (7:1)'},
				{value: 14, label: 'Enhanced (14:1)'},
				{value: 21, label: 'Maximum (21:1)'},
			],
		};
	},
	created() {
		if (this.currentValue) {
			try {
				if (
					typeof this.currentValue === 'string' &&
					(this.currentValue.startsWith('{') ||
						this.currentValue.startsWith('['))
				) {
					const values = JSON.parse(this.currentValue);
					if (values && values.color1 && values.color2) {
						this.color1 = {hex: values.color1};
						this.color2 = {hex: values.color2};
					}
				} else if (
					typeof this.currentValue === 'string' &&
					this.currentValue.startsWith('#')
				) {
					this.color1 = {hex: this.currentValue};
				}
			} catch (e) {
				console.error('Error parsing field value:', e);
				if (
					typeof this.currentValue === 'string' &&
					this.currentValue.startsWith('#')
				) {
					this.color1 = {hex: this.currentValue};
				}
			}
		}

		this.$nextTick(() => {
			this.checkContrast();
		});
	},
	methods: {
		/**
		 * Update color 1
		 *
		 * @param {Object} color - Color object from color picker
		 */
		setColor1(color) {
			this.color1 = color;
			this.updateValue();
			this.checkContrast();
		},

		/**
		 * Update color 2
		 *
		 * @param {Object} color - Color object from color picker
		 */
		setColor2(color) {
			this.color2 = color;
			this.updateValue();
			this.checkContrast();
		},

		/**
		 * Update the form value with both colors
		 */
		updateValue() {
			const valueObj = {
				color1: this.color1.hex,
				color2: this.color2.hex,
			};

			this.currentValue = JSON.stringify(valueObj);
		},

		/**
		 * Check if the contrast meets various requirements
		 */
		checkContrast() {
			const rgb1 = this.hexToRgb(this.color1.hex);
			const rgb2 = this.hexToRgb(this.color2.hex);

			if (!rgb1 || !rgb2) return;

			const lum1 = this.calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
			const lum2 = this.calculateLuminance(rgb2.r, rgb2.g, rgb2.b);

			this.currentContrast = this.calculateContrast(lum1, lum2);

			this.updateValue();
		},

		/**
		 * Convert hex color to RGB
		 *
		 * @param {String} hex
		 * @return {Object|null}
		 */
		hexToRgb(hex) {
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result
				? {
						r: parseInt(result[1], 16) / 255,
						g: parseInt(result[2], 16) / 255,
						b: parseInt(result[3], 16) / 255,
					}
				: null;
		},

		/**
		 * Calculate relative luminance using WCAG formula
		 *
		 * @param {Number} r
		 * @param {Number} g
		 * @param {Number} b
		 * @return {Number}
		 */
		calculateLuminance(r, g, b) {
			const a = [r, g, b].map((v) => {
				return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
			});
			return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
		},

		/**
		 * Calculate contrast ratio between two luminance values
		 *
		 * @param {Number} l1
		 * @param {Number} l2
		 * @return {Number}
		 */
		calculateContrast(l1, l2) {
			const lighter = Math.max(l1, l2);
			const darker = Math.min(l1, l2);
			return (lighter + 0.05) / (darker + 0.05);
		},
	},
};
</script>

<style lang="less">
.pkpFormField--contrastColor {
	padding: 0;
	border: none;
}

.pkpFormField__heading--legend {
	font-weight: 700;
}

.pkpFormField--contrastColor .vc-chrome {
	box-shadow: none;
	border: 1px solid #ddd;
	border-radius: 2px;
	margin-bottom: 12px;
	width: 100%;
}

.pkpFormField__threeColumnsRow {
	display: flex;
	gap: 24px;
	margin-bottom: 20px;
}

.pkpFormField__colorPickerColumn {
	flex: 1;
	max-width: calc(50% - 24px);
}

.pkpFormField__contrastValueColumn {
	display: flex;
	flex-direction: column;
	flex: 0 0 120px;
	gap: 8px;
}

.pkpFormField__colorPickerLabel {
	font-weight: 700;
	margin-bottom: 8px;
}

.pkpFormField__textSample {
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 60px;
	margin-bottom: 8px;
	transition:
		background-color 0.2s,
		color 0.2s;
	border: 1px solid #ddd;
}

.pkpFormField__textSampleContent {
	font-size: 16px;
	font-weight: 700;
	text-align: center;
}

.pkpFormField__contrastValueDisplay {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f8f8f8;
	border-radius: 4px;
	padding: 12px;
	height: 40px;
}

.pkpFormField__contrastValueNumber {
	font-weight: 700;
	font-size: 20px;
}

.pkpFormField__contrastCategories {
	display: flex;
	justify-content: space-between;
	gap: 8px;
	margin-bottom: 16px;
}

.pkpFormField__contrastCategory {
	flex: 1;
	text-align: center;
	padding: 8px 4px;
	border-radius: 4px;
	font-weight: 600;
	font-size: 11px;
	white-space: nowrap;

	&--pass {
		background-color: rgba(0, 178, 141, 0.15);
		color: #007a60;
	}

	&--fail {
		background-color: rgba(208, 10, 108, 0.15);
		color: #b00058;
	}
}
</style>
