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
				<span class="-screenReader">{{ componentKeys.required }}</span>
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
			>
				{{ tooltip }}
			</span>
			<HelpButton
				v-if="isPrimaryLocale && helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="componentKeys.help"
			/>
		</legend>
		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			class="pkpFormField__description"
		>
			{{ description }}
		</div>
		<div class="pkpFormField__control">
			<div class="pkpFormField__threeColumnsRow">
				<div class="pkpFormField__colorPickerColumn">
					<div class="pkpFormField__colorPickerLabel">
						{{ componentKeys.color1 }}
					</div>
					<div class="pkpFormField__colorPickerWrapper">
						<div
							class="pkpFormField__customSaturationBox"
							tabindex="0"
							:style="{background: `hsl(${hueValues.color1}, 100%, 50%)`}"
							:aria-label="componentKeys.saturationValue + ' 1'"
							@mousedown="startCustomSatValueDrag($event, 'color1')"
							@touchstart="startCustomSatValueDrag($event, 'color1')"
							@keydown="handleCustomSatValueKeydown($event, 'color1')"
							@focus="handleFocus('color1')"
							@blur="handleBlur('color1')"
						>
							<div class="pkpFormField__customSaturationBox--white"></div>
							<div class="pkpFormField__customSaturationBox--black"></div>
							<div
								class="pkpFormField__customSaturationPointer"
								:style="{
									left: `${satValues.color1}%`,
									top: `${100 - valueValues.color1}%`,
								}"
							>
								<div class="pkpFormField__customSaturationCircle"></div>
							</div>
						</div>
						<div class="pkpFormField__huePreviewRow">
							<div
								class="pkpFormField__colorPreview"
								:style="{backgroundColor: color1.hex}"
								:aria-label="componentKeys.preview + ' 1'"
							></div>
							<div
								class="pkpFormField__customHueSlider"
								tabindex="0"
								:aria-label="componentKeys.hueSlider + ' 1'"
								@click="handleCustomHueClick($event, 'color1')"
								@mousedown="startCustomHueDrag($event, 'color1')"
								@touchstart="startCustomHueDrag($event, 'color1')"
								@keydown="handleCustomHueKeydown($event, 'color1')"
							>
								<div
									class="pkpFormField__customHueHandle"
									:style="{left: `${(hueValues.color1 / 360) * 100}%`}"
								></div>
							</div>
						</div>
						<div class="pkpFormField__inputFormatRow">
							<div class="pkpFormField__formatArrows">
								<button
									type="button"
									class="pkpFormField__formatArrowUp"
									aria-label="Previous color format"
									@click="cycleColorFormat('color1', -1)"
								>
									<span aria-hidden="true">▲</span>
								</button>
								<button
									type="button"
									class="pkpFormField__formatArrowDown"
									aria-label="Next color format"
									@click="cycleColorFormat('color1', 1)"
								>
									<span aria-hidden="true">▼</span>
								</button>
							</div>
							<input
								:value="getFormattedColorValue('color1')"
								class="pkpFormField__colorValueInput"
								type="text"
								:aria-label="componentKeys.format + ' 1'"
								@input="handleColorValueInput($event, 'color1')"
								@focus="handleFocus('color1')"
								@blur="handleBlur('color1')"
							/>
						</div>
						<div class="pkpFormField__formatLabel">
							{{ componentKeys[colorFormats.color1] }}
						</div>
						<div
							aria-live="polite"
							class="pkpFormField__a11yAnnouncer"
							aria-atomic="true"
						>
							<span v-if="shouldAnnounceColor('color1')">
								{{ getColorFormatAnnouncement('color1') }}
							</span>
						</div>
					</div>
				</div>
				<div class="pkpFormField__colorPickerColumn">
					<div class="pkpFormField__colorPickerLabel">
						{{ componentKeys.color2 }}
					</div>
					<div class="pkpFormField__colorPickerWrapper">
						<div
							class="pkpFormField__customSaturationBox"
							tabindex="0"
							:style="{background: `hsl(${hueValues.color2}, 100%, 50%)`}"
							:aria-label="componentKeys.saturationValue + ' 2'"
							@mousedown="startCustomSatValueDrag($event, 'color2')"
							@touchstart="startCustomSatValueDrag($event, 'color2')"
							@keydown="handleCustomSatValueKeydown($event, 'color2')"
							@focus="handleFocus('color2')"
							@blur="handleBlur('color2')"
						>
							<div class="pkpFormField__customSaturationBox--white"></div>
							<div class="pkpFormField__customSaturationBox--black"></div>
							<div
								class="pkpFormField__customSaturationPointer"
								:style="{
									left: `${satValues.color2}%`,
									top: `${100 - valueValues.color2}%`,
								}"
							>
								<div class="pkpFormField__customSaturationCircle"></div>
							</div>
						</div>
						<div class="pkpFormField__huePreviewRow">
							<div
								class="pkpFormField__colorPreview"
								:style="{backgroundColor: color2.hex}"
								:aria-label="componentKeys.preview + ' 2'"
							></div>
							<div
								class="pkpFormField__customHueSlider"
								tabindex="0"
								:aria-label="componentKeys.hueSlider + ' 2'"
								@click="handleCustomHueClick($event, 'color2')"
								@mousedown="startCustomHueDrag($event, 'color2')"
								@touchstart="startCustomHueDrag($event, 'color2')"
								@keydown="handleCustomHueKeydown($event, 'color2')"
							>
								<div
									class="pkpFormField__customHueHandle"
									:style="{left: `${(hueValues.color2 / 360) * 100}%`}"
								></div>
							</div>
						</div>
						<div class="pkpFormField__inputFormatRow">
							<div class="pkpFormField__formatArrows">
								<button
									type="button"
									class="pkpFormField__formatArrowUp"
									aria-label="Previous color format"
									@click="cycleColorFormat('color2', -1)"
								>
									<span aria-hidden="true">▲</span>
								</button>
								<button
									type="button"
									class="pkpFormField__formatArrowDown"
									aria-label="Next color format"
									@click="cycleColorFormat('color2', 1)"
								>
									<span aria-hidden="true">▼</span>
								</button>
							</div>
							<input
								:value="getFormattedColorValue('color2')"
								class="pkpFormField__colorValueInput"
								type="text"
								:aria-label="componentKeys.format + ' 2'"
								@input="handleColorValueInput($event, 'color2')"
								@focus="handleFocus('color2')"
								@blur="handleBlur('color2')"
							/>
						</div>
						<div class="pkpFormField__formatLabel">
							{{ componentKeys[colorFormats.color2] }}
						</div>
						<div
							aria-live="polite"
							class="pkpFormField__a11yAnnouncer"
							aria-atomic="true"
						>
							<span v-if="shouldAnnounceColor('color2')">
								{{ getColorFormatAnnouncement('color2') }}
							</span>
						</div>
					</div>
				</div>
				<div class="pkpFormField__contrastValueColumn">
					<div class="pkpFormField__colorPickerLabel">
						{{ componentKeys.contrastRatio }}
					</div>
					<div
						class="pkpFormField__textSample"
						:style="{backgroundColor: color1.hex, color: color2.hex}"
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
							<span class="pkpFormField__contrastCategoryIcon">
								<span
									v-if="currentContrast >= category.value"
									class="fa fa-check"
								></span>
								<span v-else class="fa fa-times"></span>
							</span>
						</div>
					</div>
					<div
						aria-live="polite"
						class="pkpFormField__a11yAnnouncer"
						aria-atomic="true"
					>
						<span v-if="shouldAnnounceContrast()">
							{{ getContrastAnnouncement() }}
						</span>
					</div>
				</div>
			</div>

			<div class="pkpFormField__accessibilityInfoRow">
				<div class="pkpFormField__accessibilityInfo">
					<a
						href="https://docs.pkp.sfu.ca/accessible-content/en/principles#contrast-ratio"
						target="_blank"
						rel="noopener"
						:aria-label="
							componentKeys.contrastGuideText +
							' ' +
							componentKeys.opensInNewWindowText
						"
					>
						{{ componentKeys.contrastGuideText }}
						<span class="pkpFormField__newWindowNotice">
							<span class="fa fa-external-link" aria-hidden="true"></span>
							<span class="pkpFormField__srOnly">
								{{ componentKeys.opensInNewWindowText }}
							</span>
						</span>
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
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';

export default {
	name: 'FieldContrastColorPicker',
	components: {
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
				{value: 3, label: this.t('common.colorPicker.AALargeText')},
				{value: 4.5, label: this.t('common.colorPicker.AANormalText')},
				{value: 7, label: this.t('common.colorPicker.AAANormalText')},
			],
			keyboardStep: 1,
			keyboardHueStep: 2,
			keyboardSatStep: 5,
			hueValues: {
				color1: 210,
				color2: 0,
			},
			satValues: {
				color1: 100,
				color2: 0,
			},
			valueValues: {
				color1: 60,
				color2: 100,
			},
			isDraggingHue: false,
			isDraggingSat: false,
			currentDragTarget: null,
			colorFormats: {
				color1: 'hex',
				color2: 'hex',
			},
			lastUpdated: null,
			focused: {
				color1: false,
				color2: false,
			},
			previousColors: {
				color1: '#1E6292',
				color2: '#FFFFFF',
			},
			debounceTimer: null,
			// Preloaded translation keys for SSR
			componentKeys: {
				required: this.t('common.required'),
				help: this.t('help.help'),
				color1: this.t('common.colorPicker.color1'),
				color2: this.t('common.colorPicker.color2'),
				saturationValue: this.t('common.colorPicker.saturationValue'),
				preview: this.t('common.colorPicker.preview'),
				hueSlider: this.t('common.colorPicker.hueSlider'),
				format: this.t('common.colorPicker.format'),
				hex: this.t('common.colorPicker.hex'),
				rgb: this.t('common.colorPicker.rgb'),
				rgba: this.t('common.colorPicker.rgba'),
				hsl: this.t('common.colorPicker.hsl'),
				hsv: this.t('common.colorPicker.hsv'),
				contrastRatio: this.t('common.colorPicker.contrastRatio'),
				contrastGuideText: this.t('common.colorPicker.contrastGuideText'),
				colorFormatChanged: this.t('common.colorPicker.colorFormatChanged'),
				contrastRatioAnnouncement: this.t(
					'common.colorPicker.contrastRatioAnnouncement',
				),
				levelAccessible: this.t('common.colorPicker.levelAccessible'),
				levelNotAccessible: this.t('common.colorPicker.levelNotAccessible'),
				opensInNewWindowText: this.t('common.colorPicker.opensInNewWindowText'),
			},
		};
	},
	mounted() {
		if (this.color1 && this.color1.hex) {
			const hsv1 = this.hexToHsv(this.color1.hex);
			this.hueValues.color1 = hsv1.h;
			this.satValues.color1 = hsv1.s;
			this.valueValues.color1 = hsv1.v;
		}

		if (this.color2 && this.color2.hex) {
			const hsv2 = this.hexToHsv(this.color2.hex);
			this.hueValues.color2 = hsv2.h;
			this.satValues.color2 = hsv2.s;
			this.valueValues.color2 = hsv2.v;
		}

		document.addEventListener('mousemove', this.handleCustomHueDrag);
		document.addEventListener('touchmove', this.handleCustomHueDrag);
		document.addEventListener('mouseup', this.endCustomHueDrag);
		document.addEventListener('touchend', this.endCustomHueDrag);

		this.checkContrast();
	},
	beforeUnmount() {
		document.removeEventListener('mousemove', this.handleCustomHueDrag);
		document.removeEventListener('touchmove', this.handleCustomHueDrag);
		document.removeEventListener('mouseup', this.endCustomHueDrag);
		document.removeEventListener('touchend', this.endCustomHueDrag);
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

		if (this.$filters && !this.$filters.t('common.colorPicker.preview')) {
			this.$filters.add('t', (value, params) => {
				if (value === 'common.colorPicker.preview') {
					return 'Color preview';
				}
				return value;
			});
		}

		this.$nextTick(() => {
			this.checkContrast();
		});
	},
	methods: {
		/**
		 * Get formatted color value based on selected format
		 *
		 * @param {String} colorId - Which color (color1 or color2)
		 * @return {String} Formatted color value
		 */
		getFormattedColorValue(colorId) {
			const color = colorId === 'color1' ? this.color1 : this.color2;
			const format = this.colorFormats[colorId];
			const hexColor = color.hex;
			const rgb = this.hexToRgb(hexColor);

			if (!rgb) return '';

			const h = this.hueValues[colorId];
			const s = this.satValues[colorId];
			const v = this.valueValues[colorId];

			const r = Math.round(rgb.r * 255);
			const g = Math.round(rgb.g * 255);
			const b = Math.round(rgb.b * 255);

			switch (format) {
				case 'hex':
					return hexColor;
				case 'rgb':
					return `rgb(${r}, ${g}, ${b})`;
				case 'rgba':
					return `rgba(${r}, ${g}, ${b}, 1)`;
				case 'hsl': {
					const l = v * (1 - s / 200);
					const sat =
						l === 0 || l === 1 ? 0 : ((v - l) / Math.min(l, 1 - l)) * 100;
					return `hsl(${h}, ${Math.round(sat)}%, ${Math.round(l * 100)}%)`;
				}
				case 'hsv':
					return `hsv(${h}, ${s}%, ${v}%)`;
				default:
					return hexColor;
			}
		},

		/**
		 * Handle input from color value field
		 *
		 * @param {Event} event - Input event
		 * @param {String} colorId - Which color (color1 or color2)
		 */
		handleColorValueInput(event, colorId) {
			const inputValue = event.target.value.trim();
			const format = this.colorFormats[colorId];
			let newHex = null;

			let rgbMatch, rgbaMatch, hslMatch, hsvMatch;
			let r, g, b, h, s, l, v, sv;

			try {
				switch (format) {
					case 'hex':
						if (/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(inputValue)) {
							newHex = inputValue;
						}
						break;

					case 'rgb':
						rgbMatch = inputValue.match(
							/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/,
						);
						if (rgbMatch) {
							r = parseInt(rgbMatch[1]) / 255;
							g = parseInt(rgbMatch[2]) / 255;
							b = parseInt(rgbMatch[3]) / 255;
							newHex = this.rgbToHex(r, g, b);
						}
						break;

					case 'rgba':
						rgbaMatch = inputValue.match(
							/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/,
						);
						if (rgbaMatch) {
							r = parseInt(rgbaMatch[1]) / 255;
							g = parseInt(rgbaMatch[2]) / 255;
							b = parseInt(rgbaMatch[3]) / 255;
							newHex = this.rgbToHex(r, g, b);
						}
						break;

					case 'hsl':
						hslMatch = inputValue.match(
							/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/,
						);
						if (hslMatch) {
							h = parseInt(hslMatch[1]);
							s = parseInt(hslMatch[2]);
							l = parseInt(hslMatch[3]);

							v = l + (s * Math.min(l, 100 - l)) / 100;
							sv = s === 0 ? 0 : (200 * (v - l)) / v;

							newHex = this.hsvToHex({h, s: sv, v});
						}
						break;

					case 'hsv':
						hsvMatch = inputValue.match(
							/hsv\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/,
						);
						if (hsvMatch) {
							h = parseInt(hsvMatch[1]);
							s = parseInt(hsvMatch[2]);
							v = parseInt(hsvMatch[3]);
							newHex = this.hsvToHex({h, s, v});
						}
						break;
				}

				if (newHex) {
					const previousColor =
						colorId === 'color1' ? this.color1.hex : this.color2.hex;

					if (colorId === 'color1') {
						this.color1.hex = newHex;
					} else {
						this.color2.hex = newHex;
					}

					const hsv = this.hexToHsv(newHex);
					this.hueValues[colorId] = hsv.h;
					this.satValues[colorId] = hsv.s;
					this.valueValues[colorId] = hsv.v;

					this.updateValue();
					this.debouncedCheckContrast();

					if (previousColor !== newHex) {
						this.lastUpdated = colorId;
						this.previousColors[colorId] = newHex;
					}
				}
			} catch (e) {
				console.error('Error parsing color input:', e);
			}
		},

		/**
		 * Convert RGB to hex
		 *
		 * @param {Number} r - Red (0-1)
		 * @param {Number} g - Green (0-1)
		 * @param {Number} b - Blue (0-1)
		 * @return {String} Hex color
		 */
		rgbToHex(r, g, b) {
			const toHex = (x) => {
				const hex = Math.round(x * 255).toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			};

			return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
		},

		handleHexInput(colorId) {
			const color = colorId === 'color1' ? this.color1 : this.color2;
			const previousHex = color.hex;

			let hex = color.hex.trim();

			if (!hex.startsWith('#')) {
				hex = '#' + hex;
			}

			if (!/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/.test(hex)) {
				return;
			}

			if (colorId === 'color1') {
				this.color1 = {hex};
			} else {
				this.color2 = {hex};
			}

			const hsv = this.hexToHsv(hex);
			this.hueValues[colorId] = hsv.h;
			this.satValues[colorId] = hsv.s;
			this.valueValues[colorId] = hsv.v;

			this.updateValue();
			this.debouncedCheckContrast();

			if (previousHex !== hex) {
				this.lastUpdated = colorId;
				this.previousColors[colorId] = hex;
			}
		},

		handleCustomHueClick(event, colorId) {
			const rect = event.currentTarget.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const width = rect.width;
			const hueValue = Math.round((x / width) * 360);

			this.updateHueValue(colorId, hueValue);
		},

		startCustomHueDrag(event, colorId) {
			if (event.preventDefault) {
				event.preventDefault();
			}

			this.isDraggingHue = true;
			this.currentDragTarget = colorId;

			if (event.touches && event.touches[0]) {
				const rect = event.currentTarget.getBoundingClientRect();
				const x = event.touches[0].clientX - rect.left;
				const width = rect.width;
				const hueValue = Math.round((x / width) * 360);
				this.updateHueValue(colorId, hueValue);
			}
		},

		handleCustomHueDrag(event) {
			if (!this.isDraggingHue || !this.currentDragTarget) return;

			const sliderElement = document.querySelector(
				`.pkpFormField__colorPickerColumn:nth-child(${this.currentDragTarget === 'color1' ? 1 : 2}) .pkpFormField__customHueSlider`,
			);

			if (!sliderElement) return;

			const rect = sliderElement.getBoundingClientRect();
			let x;

			if (event.touches && event.touches[0]) {
				x = event.touches[0].clientX - rect.left;
			} else {
				x = event.clientX - rect.left;
			}

			x = Math.max(0, Math.min(x, rect.width));

			const width = rect.width;
			const hueValue = Math.round((x / width) * 360);

			this.updateHueValue(this.currentDragTarget, hueValue);
		},

		endCustomHueDrag() {
			this.isDraggingHue = false;
			this.currentDragTarget = null;
		},

		updateHueValue(colorId, hueValue) {
			hueValue = Math.max(0, Math.min(359, hueValue));

			this.hueValues[colorId] = hueValue;

			const hsv = {
				h: hueValue,
				s: this.satValues[colorId],
				v: this.valueValues[colorId],
			};

			const hex = this.hsvToHex(hsv);

			if (colorId === 'color1') {
				this.color1 = {hex};
			} else {
				this.color2 = {hex};
			}

			this.updateValue();
			this.debouncedCheckContrast();

			const currentColor =
				colorId === 'color1' ? this.color1.hex : this.color2.hex;
			if (this.previousColors[colorId] !== currentColor) {
				this.lastUpdated = colorId;
				this.previousColors[colorId] = currentColor;
			}
		},

		handleCustomHueKeydown(event, colorId) {
			let hueValue = this.hueValues[colorId];
			let step = this.keyboardHueStep;
			let modified = false;

			switch (event.key) {
				case 'ArrowRight':
					hueValue = (hueValue + step) % 360;
					modified = true;
					break;
				case 'ArrowLeft':
					hueValue = (hueValue - step + 360) % 360;
					modified = true;
					break;
				case 'Home':
					hueValue = 0;
					modified = true;
					break;
				case 'End':
					hueValue = 359;
					modified = true;
					break;
				case 'PageUp':
					hueValue = (hueValue + 30) % 360;
					modified = true;
					break;
				case 'PageDown':
					hueValue = (hueValue - 30 + 360) % 360;
					modified = true;
					break;
			}

			if (modified) {
				event.preventDefault();
				this.updateHueValue(colorId, hueValue);
			}
		},

		handleCustomSatValueKeydown(event, colorId) {
			let s = this.satValues[colorId];
			let v = this.valueValues[colorId];
			let modified = false;

			switch (event.key) {
				case 'ArrowUp':
					v = Math.min(100, v + this.keyboardStep);
					modified = true;
					break;
				case 'ArrowDown':
					v = Math.max(0, v - this.keyboardStep);
					modified = true;
					break;
				case 'ArrowRight':
					s = Math.min(100, s + this.keyboardStep);
					modified = true;
					break;
				case 'ArrowLeft':
					s = Math.max(0, s - this.keyboardStep);
					modified = true;
					break;
				case 'Home':
					s = 0;
					v = 100;
					modified = true;
					break;
				case 'End':
					s = 100;
					v = 0;
					modified = true;
					break;
				case 'PageUp':
					v = Math.min(100, v + 10);
					modified = true;
					break;
				case 'PageDown':
					v = Math.max(0, v - 10);
					modified = true;
					break;
			}

			if (modified) {
				event.preventDefault();
				this.updateSatValueValues(colorId, s, v);
			}
		},

		startCustomSatValueDrag(event, colorId) {
			if (event.preventDefault) {
				event.preventDefault();
			}

			this.isDraggingSat = true;
			this.currentDragTarget = colorId;

			this.handleCustomSatValueDrag(event);

			window.addEventListener('mousemove', this.handleCustomSatValueDrag);
			window.addEventListener('mouseup', this.endCustomSatValueDrag);
			window.addEventListener('touchmove', this.handleCustomSatValueDrag);
			window.addEventListener('touchend', this.endCustomSatValueDrag);
		},

		handleCustomSatValueDrag(event) {
			if (!this.isDraggingSat || !this.currentDragTarget) return;

			const colorId = this.currentDragTarget;
			const boxElement = document.querySelector(
				`.pkpFormField__colorPickerColumn:nth-child(${colorId === 'color1' ? 1 : 2}) .pkpFormField__customSaturationBox`,
			);

			if (!boxElement) return;

			const rect = boxElement.getBoundingClientRect();
			let x, y;

			if (event.touches && event.touches[0]) {
				x = event.touches[0].clientX - rect.left;
				y = event.touches[0].clientY - rect.top;
			} else {
				x = event.clientX - rect.left;
				y = event.clientY - rect.top;
			}

			x = Math.max(0, Math.min(x, rect.width));
			y = Math.max(0, Math.min(y, rect.height));

			const s = Math.round((x / rect.width) * 100);
			const v = Math.round(100 - (y / rect.height) * 100);

			this.updateSatValueValues(colorId, s, v);
		},

		endCustomSatValueDrag() {
			this.isDraggingSat = false;

			if (!this.isDraggingHue) {
				this.currentDragTarget = null;
			}

			window.removeEventListener('mousemove', this.handleCustomSatValueDrag);
			window.removeEventListener('mouseup', this.endCustomSatValueDrag);
			window.removeEventListener('touchmove', this.handleCustomSatValueDrag);
			window.removeEventListener('touchend', this.endCustomSatValueDrag);
		},

		updateSatValueValues(colorId, satValue, valueValue) {
			satValue = Math.max(0, Math.min(100, satValue));
			valueValue = Math.max(0, Math.min(100, valueValue));

			this.satValues[colorId] = satValue;
			this.valueValues[colorId] = valueValue;

			const hsv = {
				h: this.hueValues[colorId],
				s: satValue,
				v: valueValue,
			};

			const hex = this.hsvToHex(hsv);
			const previousHex =
				colorId === 'color1' ? this.color1.hex : this.color2.hex;

			if (colorId === 'color1') {
				this.color1 = {hex};
			} else {
				this.color2 = {hex};
			}

			this.updateValue();
			this.debouncedCheckContrast();

			if (previousHex !== hex) {
				this.lastUpdated = colorId;
				this.previousColors[colorId] = hex;
			}
		},

		updateValue() {
			const valueObj = {
				color1: this.color1.hex,
				color2: this.color2.hex,
			};

			this.currentValue = JSON.stringify(valueObj);
		},

		checkContrast() {
			const rgb1 = this.hexToRgb(this.color1.hex);
			const rgb2 = this.hexToRgb(this.color2.hex);

			if (!rgb1 || !rgb2) return;

			const lum1 = this.calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
			const lum2 = this.calculateLuminance(rgb2.r, rgb2.g, rgb2.b);

			const previousContrast = this.currentContrast;
			this.currentContrast = this.calculateContrast(lum1, lum2);

			this.updateValue();

			if (previousContrast !== this.currentContrast) {
				this.lastUpdated = 'contrast';
			}
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

		/**
		 * Get announcement text for color format change
		 *
		 * @param {String} colorId - Which color (color1 or color2)
		 * @returns {String} - Announcement text
		 */
		getColorFormatAnnouncement(colorId) {
			const colorName =
				colorId === 'color1'
					? this.componentKeys.color1
					: this.componentKeys.color2;
			const formatName = this.componentKeys[this.colorFormats[colorId]];
			const colorValue = this.getFormattedColorValue(colorId);

			return this.componentKeys.colorFormatChanged
				.replace('{$colorName}', colorName)
				.replace('{$formatName}', formatName)
				.replace('{$colorValue}', colorValue);
		},

		/**
		 * Get announcement text for contrast ratio
		 *
		 * @returns {String} - Announcement text
		 */
		getContrastAnnouncement() {
			let announcement = this.componentKeys.contrastRatioAnnouncement.replace(
				'{$ratio}',
				this.currentContrast.toFixed(2),
			);

			for (const category of this.contrastCategories) {
				const isAccessible = this.currentContrast >= category.value;
				const accessibilityStatus = isAccessible
					? this.componentKeys.levelAccessible
					: this.componentKeys.levelNotAccessible;

				announcement += ' ' + category.label + ' ' + accessibilityStatus + '.';
			}

			return announcement;
		},

		/**
		 * Cycle through available color formats
		 *
		 * @param {String} colorId - Which color (color1 or color2)
		 * @param {Number} direction - Direction to cycle (1 for next, -1 for previous)
		 */
		cycleColorFormat(colorId, direction) {
			const formats = ['hex', 'rgb', 'rgba', 'hsl', 'hsv'];
			const currentIndex = formats.indexOf(this.colorFormats[colorId]);
			let newIndex = currentIndex + direction;

			if (newIndex < 0) {
				newIndex = formats.length - 1;
			} else if (newIndex >= formats.length) {
				newIndex = 0;
			}

			this.colorFormats[colorId] = formats[newIndex];
			this.lastUpdated = colorId;
		},

		handleFocus(colorId) {
			this.focused[colorId] = true;
			this.previousColors[colorId] =
				colorId === 'color1' ? this.color1.hex : this.color2.hex;
		},

		handleBlur(colorId) {
			this.focused[colorId] = false;
		},

		shouldAnnounceColor(colorId) {
			const currentColor =
				colorId === 'color1' ? this.color1.hex : this.color2.hex;
			// On first focus, announce even if no change
			if (this.focused[colorId] && this.lastUpdated === null) {
				return true;
			}
			// For subsequent changes, only announce if color actually changed
			return (
				this.lastUpdated === colorId &&
				this.previousColors[colorId] !== currentColor
			);
		},

		shouldAnnounceContrast() {
			// Only announce contrast changes after debounce
			return this.lastUpdated === 'contrast' && this.debounceTimer === null;
		},

		debouncedCheckContrast() {
			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer);
			}

			this.debounceTimer = setTimeout(() => {
				this.checkContrast();
				this.debounceTimer = null;
			}, 300); // 300ms debounce
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/components/field-contrast-color-picker.less';
</style>
