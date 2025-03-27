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
					<div class="pkpFormField__colorPickerLabel">
						{{ t('common.colorPicker.color1') }}
					</div>
					<color-picker
						ref="color1Picker"
						:model-value="color1"
						:disable-alpha="true"
						aria-label="Color 1"
						@update:model-value="setColor1"
					/>
				</div>
				<div class="pkpFormField__colorPickerColumn">
					<div class="pkpFormField__colorPickerLabel">
						{{ t('common.colorPicker.color2') }}
					</div>
					<color-picker
						ref="color2Picker"
						:model-value="color2"
						:disable-alpha="true"
						aria-label="Color 2"
						@update:model-value="setColor2"
					/>
				</div>
				<div class="pkpFormField__contrastValueColumn">
					<div class="pkpFormField__colorPickerLabel">
						{{ t('common.colorPicker.contrastRatio') }}
					</div>
					<div
						class="pkpFormField__textSample"
						:style="{
							backgroundColor: color1.hex,
							color: color2.hex,
						}"
						aria-label="Text preview with selected colors"
					>
						<span class="pkpFormField__textSampleContent">Text</span>
					</div>
					<div class="pkpFormField__contrastValueDisplay">
						<span class="pkpFormField__contrastValueNumber">
							{{ currentContrast.toFixed(2) }}
						</span>
					</div>

					<div class="pkpFormField__contrastCategoriesInColumn">
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
							:aria-label="`${category.label}: ${currentContrast >= category.value ? 'Pass' : 'Fail'}`"
						>
							{{ category.label }}
						</div>
					</div>
				</div>
			</div>

			<div class="pkpFormField__accessibilityInfoRow">
				<div class="pkpFormField__accessibilityInfo">
					<a
						href="https://docs.pkp.sfu.ca/accessible-content/en/principles#contrast-ratio"
						target="_blank"
						rel="noopener"
						:aria-label="t('common.colorPicker.contrastGuideText')"
					>
						{{ t('common.colorPicker.contrastGuideText') }}
					</a>
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
			],
			keyboardStep: 1,
			keyboardHueStep: 2,
		};
	},
	mounted() {
		this.setupKeyboardControls();
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
		 * Setup keyboard controls for the color pickers
		 * This adds event listeners to the specific interactive elements within the color picker
		 */
		setupKeyboardControls() {
			this.$nextTick(() => {
				if (this.$refs.color1Picker) {
					const saturation1 =
						this.$refs.color1Picker.$el.querySelector('.vc-saturation');
					const satPointer1 = saturation1
						? saturation1.querySelector('.vc-saturation-circle')
						: null;

					if (saturation1 && satPointer1) {
						saturation1.setAttribute('tabindex', '0');
						saturation1.setAttribute(
							'aria-label',
							'Color 1 saturation and brightness selector',
						);
						saturation1.addEventListener('keydown', (e) =>
							this.handleSaturationKeydown(e, 'color1'),
						);

						satPointer1.style.transition =
							'box-shadow 0.2s ease, transform 0.1s ease';

						saturation1.addEventListener('focus', () => {
							satPointer1.style.boxShadow =
								'0 0 0 2px white, 0 0 0 4px #1976d2';
							satPointer1.style.transform = 'scale(1.2)';
						});

						saturation1.addEventListener('blur', () => {
							satPointer1.style.boxShadow =
								'0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3)';
							satPointer1.style.transform = 'scale(1)';
						});
					}

					const hueSlider1 =
						this.$refs.color1Picker.$el.querySelector('.vc-hue-container');
					const huePointer1 = hueSlider1
						? hueSlider1.querySelector('.vc-hue-picker')
						: null;

					if (hueSlider1 && huePointer1) {
						hueSlider1.setAttribute('tabindex', '0');
						hueSlider1.setAttribute('aria-label', 'Color 1 hue slider');
						hueSlider1.addEventListener('keydown', (e) =>
							this.handleHueKeydown(e, 'color1'),
						);

						huePointer1.style.transition =
							'box-shadow 0.2s ease, transform 0.1s ease';

						hueSlider1.addEventListener('focus', () => {
							huePointer1.style.boxShadow =
								'0 0 0 2px white, 0 0 0 4px #1976d2';
						});

						hueSlider1.addEventListener('blur', () => {
							huePointer1.style.boxShadow =
								'0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3)';
						});
					}

					const hexInput = this.$refs.color1Picker.$el.querySelector(
						'.vc-chrome-hex input',
					);
					if (hexInput) {
						hexInput.setAttribute('aria-label', 'Color 1 hex value');
					}
				}

				if (this.$refs.color2Picker) {
					const saturation2 =
						this.$refs.color2Picker.$el.querySelector('.vc-saturation');
					const satPointer2 = saturation2
						? saturation2.querySelector('.vc-saturation-circle')
						: null;

					if (saturation2 && satPointer2) {
						saturation2.setAttribute('tabindex', '0');
						saturation2.setAttribute(
							'aria-label',
							'Color 2 saturation and brightness selector',
						);
						saturation2.addEventListener('keydown', (e) =>
							this.handleSaturationKeydown(e, 'color2'),
						);

						satPointer2.style.transition =
							'box-shadow 0.2s ease, transform 0.1s ease';

						saturation2.addEventListener('focus', () => {
							satPointer2.style.boxShadow =
								'0 0 0 2px white, 0 0 0 4px #1976d2';
							satPointer2.style.transform = 'scale(1.2)';
						});

						saturation2.addEventListener('blur', () => {
							satPointer2.style.boxShadow =
								'0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3)';
							satPointer2.style.transform = 'scale(1)';
						});
					}

					const hueSlider2 =
						this.$refs.color2Picker.$el.querySelector('.vc-hue-container');
					const huePointer2 = hueSlider2
						? hueSlider2.querySelector('.vc-hue-picker')
						: null;

					if (hueSlider2 && huePointer2) {
						hueSlider2.setAttribute('tabindex', '0');
						hueSlider2.setAttribute('aria-label', 'Color 2 hue slider');
						hueSlider2.addEventListener('keydown', (e) =>
							this.handleHueKeydown(e, 'color2'),
						);

						huePointer2.style.transition =
							'box-shadow 0.2s ease, transform 0.1s ease';

						hueSlider2.addEventListener('focus', () => {
							huePointer2.style.boxShadow =
								'0 0 0 2px white, 0 0 0 4px #1976d2';
						});

						hueSlider2.addEventListener('blur', () => {
							huePointer2.style.boxShadow =
								'0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3)';
						});
					}

					const hexInput = this.$refs.color2Picker.$el.querySelector(
						'.vc-chrome-hex input',
					);
					if (hexInput) {
						hexInput.setAttribute('aria-label', 'Color 2 hex value');
					}
				}
			});
		},

		/**
		 * Handle keyboard navigation for the saturation/brightness square
		 *
		 * @param {Event} event - Keyboard event
		 * @param {String} colorId - Which color picker is being used (color1 or color2)
		 */
		handleSaturationKeydown(event, colorId) {
			const color = colorId === 'color1' ? this.color1 : this.color2;
			const pickerRef =
				colorId === 'color1'
					? this.$refs.color1Picker
					: this.$refs.color2Picker;
			if (!pickerRef || !pickerRef.$el) return;

			const hsv = this.hexToHsv(color.hex);
			let modified = false;

			const hueContainer = pickerRef.$el.querySelector('.vc-hue-container');
			const huePointer = hueContainer
				? hueContainer.querySelector('.vc-hue-pointer')
				: null;
			let currentHuePosition = '0%';

			if (huePointer) {
				currentHuePosition = huePointer.style.left || '0%';
				if (currentHuePosition !== '0%') {
					const hueValue = Math.round(
						(parseFloat(currentHuePosition) / 100) * 360,
					);
					hsv.h = hueValue;
				}
			}

			switch (event.key) {
				case 'ArrowUp':
					hsv.v = Math.min(100, hsv.v + this.keyboardStep);
					modified = true;
					break;
				case 'ArrowDown':
					hsv.v = Math.max(0, hsv.v - this.keyboardStep);
					modified = true;
					break;
				case 'ArrowRight':
					hsv.s = Math.min(100, hsv.s + this.keyboardStep);
					modified = true;
					break;
				case 'ArrowLeft':
					hsv.s = Math.max(0, hsv.s - this.keyboardStep);
					modified = true;
					break;
				case 'Home':
					hsv.s = 0;
					hsv.v = 100;
					modified = true;
					break;
				case 'End':
					hsv.s = 100;
					hsv.v = 0;
					modified = true;
					break;
				case 'PageUp':
					hsv.s = 100;
					hsv.v = 100;
					modified = true;
					break;
				case 'PageDown':
					hsv.s = 0;
					hsv.v = 0;
					modified = true;
					break;
			}

			if (modified) {
				event.preventDefault();
				const newHex = this.hsvToHex(hsv);

				if (colorId === 'color1') {
					this.setColor1({hex: newHex});
				} else {
					this.setColor2({hex: newHex});
				}

				setTimeout(() => {
					const saturation = pickerRef.$el.querySelector('.vc-saturation');
					if (saturation) {
						saturation.style.background = `hsl(${hsv.h}, 100%, 50%)`;
					}

					if (huePointer) {
						huePointer.style.left = currentHuePosition;
					}
				}, 10);
			}
		},

		/**
		 * Handle keyboard navigation for the hue slider
		 *
		 * @param {Event} event - Keyboard event
		 * @param {String} colorId - Which color picker is being used (color1 or color2)
		 */
		handleHueKeydown(event, colorId) {
			const pickerRef =
				colorId === 'color1'
					? this.$refs.color1Picker
					: this.$refs.color2Picker;
			if (!pickerRef || !pickerRef.$el) return;

			const satPointer = pickerRef.$el.querySelector('.vc-saturation-pointer');
			if (!satPointer) return;
			const currentTop = satPointer.style.top;
			const currentLeft = satPointer.style.left;

			const hueContainer = pickerRef.$el.querySelector('.vc-hue-container');
			const huePointer = hueContainer
				? hueContainer.querySelector('.vc-hue-pointer')
				: null;
			if (!hueContainer || !huePointer) return;

			const color = colorId === 'color1' ? this.color1 : this.color2;
			const currentHsv = this.hexToHsv(color.hex);

			let currentHueLeft;

			if (currentHsv.s === 0) {
				const huePositionStr = huePointer.style.left;
				if (!huePositionStr || huePositionStr === '') {
					currentHueLeft = 0;
				} else {
					currentHueLeft = parseFloat(huePositionStr);
				}
			} else {
				currentHueLeft = (currentHsv.h / 360) * 100;
			}

			let newHuePosition = currentHueLeft;
			const smallStep = (this.keyboardHueStep / 360) * 100;
			const largeStep = (60 / 360) * 100;
			let modified = false;

			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowUp':
					newHuePosition = Math.min(100, currentHueLeft + smallStep);
					modified = true;
					break;
				case 'ArrowLeft':
				case 'ArrowDown':
					newHuePosition = Math.max(0, currentHueLeft - smallStep);
					modified = true;
					break;
				case 'Home':
					newHuePosition = 0;
					modified = true;
					break;
				case 'End':
					newHuePosition = 100;
					modified = true;
					break;
				case 'PageUp':
					newHuePosition = Math.min(100, currentHueLeft + largeStep);
					modified = true;
					break;
				case 'PageDown':
					newHuePosition = Math.max(0, currentHueLeft - largeStep);
					modified = true;
					break;
			}

			if (modified) {
				event.preventDefault();
				event.stopPropagation();

				const hue = Math.round((newHuePosition / 100) * 360);

				huePointer.style.left = `${newHuePosition}%`;
				satPointer.style.top = currentTop;
				satPointer.style.left = currentLeft;

				const saturation = pickerRef.$el.querySelector('.vc-saturation');
				if (saturation) {
					saturation.style.background = `hsl(${hue}, 100%, 50%)`;
				}

				const hsv = {
					h: hue,
					s: currentHsv.s,
					v: currentHsv.v,
				};

				if (currentHsv.s !== 0) {
					const newHex = this.hsvToHex(hsv);
					if (colorId === 'color1') {
						this.setColor1({hex: newHex});
					} else {
						this.setColor2({hex: newHex});
					}
				}

				setTimeout(() => {
					if (satPointer) {
						satPointer.style.top = currentTop;
						satPointer.style.left = currentLeft;
					}

					if (huePointer) {
						huePointer.style.left = `${newHuePosition}%`;
					}

					if (saturation) {
						saturation.style.background = `hsl(${hue}, 100%, 50%)`;
					}
				}, 10);
			}
		},

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

		/**
		 * Convert hex color to HSV
		 *
		 * @param {String} hex - Hex color value
		 * @return {Object} HSV object with h, s, v properties
		 */
		hexToHsv(hex) {
			const rgb = this.hexToRgb(hex);
			if (!rgb) return {h: 0, s: 0, v: 0};

			const r = rgb.r;
			const g = rgb.g;
			const b = rgb.b;

			const max = Math.max(r, g, b);
			const min = Math.min(r, g, b);
			const delta = max - min;

			let h = 0;
			let s = max === 0 ? 0 : delta / max;
			let v = max;

			if (delta > 0) {
				if (max === r) {
					h = ((g - b) / delta) % 6;
				} else if (max === g) {
					h = (b - r) / delta + 2;
				} else {
					h = (r - g) / delta + 4;
				}

				h = Math.round(h * 60);
				if (h < 0) h += 360;
			}

			return {
				h: h,
				s: Math.round(s * 100),
				v: Math.round(v * 100),
			};
		},

		/**
		 * Convert HSV color to hex
		 *
		 * @param {Object} hsv - HSV color object
		 * @return {String} Hex color string
		 */
		hsvToHex(hsv) {
			const h = hsv.h;
			const s = hsv.s / 100;
			const v = hsv.v / 100;

			let r, g, b;

			const i = Math.floor(h / 60) % 6;
			const f = h / 60 - Math.floor(h / 60);
			const p = v * (1 - s);
			const q = v * (1 - f * s);
			const t = v * (1 - (1 - f) * s);

			switch (i) {
				case 0:
					r = v;
					g = t;
					b = p;
					break;
				case 1:
					r = q;
					g = v;
					b = p;
					break;
				case 2:
					r = p;
					g = v;
					b = t;
					break;
				case 3:
					r = p;
					g = q;
					b = v;
					break;
				case 4:
					r = t;
					g = p;
					b = v;
					break;
				default:
					r = v;
					g = p;
					b = q;
					break;
			}

			const toHex = (x) => {
				const hex = Math.round(x * 255).toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			};

			return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
	height: calc(100% - 44px);
}

.pkpFormField--contrastColor .vc-saturation {
	height: 170px !important;
}

.pkpFormField--contrastColor .vc-saturation:focus,
.pkpFormField--contrastColor
	.vc-chrome-controls
	.vc-chrome-sliders
	.vc-chrome-hue-wrap
	.vc-hue-picker:focus {
	outline: 2px solid #1976d2;
	outline-offset: 2px;
	box-shadow: 0 0 5px rgba(25, 118, 210, 0.5);
}

.pkpFormField--contrastColor .vc-hue-container {
	position: relative;
	cursor: pointer;
}

.pkpFormField--contrastColor .vc-hue {
	border-radius: 4px;
}

.pkpFormField--contrastColor .vc-hue-picker {
	transition:
		box-shadow 0.2s ease,
		transform 0.1s ease;
	height: 14px !important;
	transform-origin: center;
}

.pkpFormField--contrastColor .vc-saturation-circle {
	transition:
		box-shadow 0.2s ease,
		transform 0.1s ease;
	transform-origin: center;
}

.pkpFormField--contrastColor .vc-chrome-fields input:focus {
	outline: 2px solid #1976d2;
	outline-offset: 0;
}

.pkpFormField__threeColumnsRow {
	display: flex;
	gap: 24px;
}

.pkpFormField__colorPickerColumn {
	flex: 1;
	max-width: calc(50% - 24px);
	display: flex;
	flex-direction: column;
	height: 340px;
}

.pkpFormField__contrastValueColumn {
	display: flex;
	flex-direction: column;
	flex: 0 0 140px;
	gap: 8px;
	height: 340px;
	justify-content: space-between;
}

.pkpFormField__colorPickerLabel {
	font-weight: 700;
}

.pkpFormField__keyboardInstructions {
	margin-top: 8px;
	font-size: 11px;
	color: #666;
	font-style: italic;
}

.pkpFormField__textSample {
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
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
	height: 50px;
	margin-bottom: 16px;
}

.pkpFormField__contrastValueNumber {
	font-weight: 700;
	font-size: 20px;
}

.pkpFormField__contrastCategoriesInColumn {
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-bottom: 0;
	flex-grow: 1;
}

.pkpFormField__contrastCategory {
	text-align: left;
	padding: 8px;
	border-radius: 4px;
	font-weight: 600;
	font-size: 11px;

	&--pass {
		background-color: rgba(0, 178, 141, 0.15);
		color: #007a60;
	}

	&--fail {
		background-color: rgba(208, 10, 108, 0.15);
		color: #b00058;
	}
}

.pkpFormField__accessibilityInfoRow {
	display: flex;
	justify-content: flex-start;
	margin-bottom: 16px;
}

.pkpFormField__accessibilityInfo {
	font-size: 12px;

	a {
		color: #007bff;
		text-decoration: none;

		&:hover,
		&:focus {
			text-decoration: underline;
		}

		&:focus {
			outline: 2px solid #1976d2;
			outline-offset: 2px;
		}
	}
}
</style>
