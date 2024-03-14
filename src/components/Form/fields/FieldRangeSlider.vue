<template>
	<div class="pkpFormField__control">
		<div class="mb-2 text-left leading-6">
			<label
				v-if="label"
				class="text-md text-gray-900 dark:text-gray-900 block font-semibold"
				:for="localizedName"
				v-html="label"
			></label>
			<div
				v-if="isPrimaryLocale && description"
				:id="describedByDescriptionId"
				class="text-xs text-black-500 dark:text-white-300 font-normal"
				v-html="description"
			></div>
		</div>
		<div class="flex">
			<div class="relative w-7/12 flex-initial text-center">
				<input
					:id="controlId"
					v-model="currentValue"
					type="range"
					class="bg-gray-200 rounded-lg dark:bg-black-700 h-2 w-full cursor-pointer appearance-none"
					:style="sliderSize[size]"
					:name="localizedName"
					:step="step"
					:min="min"
					:max="max"
					:disabled="rangeDisableState"
				/>
				<span
					class="text-sm text-black-500 dark:text-black-400 absolute bottom-2 start-0 font-semibold"
					v-html="min"
				></span>
				<span
					class="text-sm text-black-500 dark:text-black-400 absolute bottom-2 end-0 font-semibold"
					v-html="max"
				></span>
			</div>

			<div
				v-if="updateLabel.trim().length > 0"
				class="ml-6 w-4/12 flex-initial text-left"
			>
				<button
					type="button"
					class="text-sm text-gray-900 bg-white rounded-lg border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 mb-2 me-2 border px-4 py-2 font-medium focus:z-10 focus:outline-none focus:ring-4"
				>
					<span
						v-if="valuePositionInUpdateLabel === 'before'"
						v-html="currentValue ? currentValue + '' : ''"
					></span>
					<span v-html="updateLabel"></span>
					<span
						v-if="valuePositionInUpdateLabel === 'after'"
						v-html="currentValue ? currentValue + '' : ''"
					></span>
				</button>
			</div>
		</div>

		<!-- Checkbon as button select/unselect switch -->
		<div v-if="allowStateToggle" class="mb-2 mt-2 flex items-center">
			<input type="checkbox" class="hidden" />
			<label
				class="rounded-xl border-blue-300 text-blue-600 peer-checked:bg-gray-400 peer-checked:text-blue-700 peer-checked:border-blue-600 min-w-20 max-w-40 cursor-pointer select-none border-2 px-4 py-2 font-bold transition-colors duration-200 ease-in-out"
				@click="toogleRangeState()"
				v-html="toggleControlLabelText"
			></label>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';

export default {
	name: 'FieldRangeSlider',
	extends: FieldBase,
	props: {
		/** The disable state of range slider */
		disable: {
			type: Boolean,
			default: false,
		},

		/** Range slider should be disable if input field value set to NULL on render */
		disableOnNull: {
			type: Boolean,
			default: true,
		},

		/** The current value for this field. */
		value: {
			type: Number,
			required: false,
			default: null,
		},

		/** Range value to set on reset when enabiling/disbaling. */
		onResetValue: {
			type: Number,
			required: false,
			default: null,
		},

		/** The min value of the slider range. */
		min: {
			type: Number,
			required: true,
		},

		/** The max value of the slider range. */
		max: {
			type: Number,
			required: true,
		},

		/** The step at which the range value increase/decrease */
		step: {
			type: Number,
			required: false,
			default: 1,
		},

		/** Slider value update label on realtime */
		updateLabel: {
			type: String,
			required: false,
			default: '',
		},

		/** The slider size,One of `small`, `normal` or `large`. Default: `small` */
		size: {
			type: String,
			required: true,
			default: 'normal',
			validator: function (value) {
				return ['small', 'normal', 'large'].indexOf(value) !== -1;
			},
		},

		/** The slider value position in the update label ,One of `before`, or `after` */
		valuePositionInUpdateLabel: {
			type: String,
			required: false,
			default: 'before',
			validator: function (value) {
				return ['before', 'after'].indexOf(value) !== -1;
			},
		},

		/** Should allow the toggle to slider state disable/enable */
		allowStateToggle: {
			type: Boolean,
			default: true,
		},

		/** The disable/enable control label when disable */
		controlLabelOnDisable: {
			type: String,
			required: function () {
				return this.allowStateToggle;
			},
		},

		/** The disable/enable control label when enable */
		controlLabelOnEnable: {
			type: String,
			required: function () {
				return this.allowStateToggle;
			},
		},
	},
	data() {
		return {
			sliderSize: {
				small: {
					'--thumb-height': '0.5em',
					'--track-height': '0.075em',
				},
				normal: {
					'--thumb-height': '0.8em',
					'--track-height': '0.125em',
				},
				large: {
					'--thumb-height': '1.2em',
					'--track-height': '0.250em',
				},
			},

			rangeDisableState: this.disable,
		};
	},
	computed: {
		toggleControlLabelText() {
			return this.rangeDisableState
				? this.controlLabelOnDisable
				: this.controlLabelOnEnable;
		},
	},
	created() {
		if (
			this.disableOnNull &&
			(this.value === null || this.value === undefined)
		) {
			this.rangeDisableState = true;
		}
	},
	methods: {
		toogleRangeState() {
			this.rangeDisableState = !this.rangeDisableState;
			this.currentValue = this.rangeDisableState
				? null
				: this.value ?? this.onResetValue;
		},
	},
};
</script>

<style lang="less" scoped>
@import '../../../styles/_import';

/* === range theme and appearance === */
input[type='range'] {
	font-size: 1.5rem;
}

input[type='range'] {
	color: rgb(0 103 152 / 1);
	--track-color: rgb(187, 187, 187, 0.8);
	--brightness-hover: 180%;
	--brightness-down: 80%;
	--clip-edges: 0.125em;
}

@media (prefers-color-scheme: dark) {
	input[type='range'] {
		color: rgb(0 103 152 / 1);
		--track-color: rgb(187, 187, 187, 0.8);
	}
}

/* === range commons === */
input[type='range'] {
	position: relative;
	background: #fff0;
	overflow: hidden;
}

input[type='range']:active {
	cursor: grabbing;
}

input[type='range']:disabled {
	filter: grayscale(1);
	opacity: 0.3;
	cursor: not-allowed;
}

/* === WebKit specific styles === */
input[type='range'],
input[type='range']::-webkit-slider-runnable-track,
input[type='range']::-webkit-slider-thumb {
	-webkit-appearance: none;
	transition: all ease 100ms;
	height: var(--thumb-height);
}

input[type='range']::-webkit-slider-runnable-track,
input[type='range']::-webkit-slider-thumb {
	position: relative;
}

input[type='range']::-webkit-slider-thumb {
	--thumb-radius: calc((var(--thumb-height) * 0.5) - 1px);
	--clip-top: calc((var(--thumb-height) - var(--track-height)) * 0.5 - 0.5px);
	--clip-bottom: calc(var(--thumb-height) - var(--clip-top));
	--clip-further: calc(100% + 1px);
	--box-fill: calc(-100vmax - var(--thumb-width, var(--thumb-height))) 0 0
		100vmax currentColor;

	width: var(--thumb-width, var(--thumb-height));
	background: linear-gradient(currentColor 0 0) scroll no-repeat left center /
		50% calc(var(--track-height) + 1px);
	background-color: currentColor;
	box-shadow: var(--box-fill);
	border-radius: var(--thumb-width, var(--thumb-height));

	filter: brightness(100%);
	clip-path: polygon(
		100% -1px,
		var(--clip-edges) -1px,
		0 var(--clip-top),
		-100vmax var(--clip-top),
		-100vmax var(--clip-bottom),
		0 var(--clip-bottom),
		var(--clip-edges) 100%,
		var(--clip-further) var(--clip-further)
	);
}

input[type='range']:hover::-webkit-slider-thumb {
	filter: brightness(var(--brightness-hover));
	cursor: grab;
}

input[type='range']:active::-webkit-slider-thumb {
	filter: brightness(var(--brightness-down));
	cursor: grabbing;
}

input[type='range']::-webkit-slider-runnable-track {
	background: linear-gradient(var(--track-color) 0 0) scroll no-repeat center /
		100% calc(var(--track-height) + 1px);
}

input[type='range']:disabled::-webkit-slider-thumb {
	cursor: not-allowed;
}

/* === Firefox specific styles === */
input[type='range'],
input[type='range']::-moz-range-track,
input[type='range']::-moz-range-thumb {
	appearance: none;
	transition: all ease 100ms;
	height: var(--thumb-height);
}

input[type='range']::-moz-range-track,
input[type='range']::-moz-range-thumb,
input[type='range']::-moz-range-progress {
	background: #fff0;
}

input[type='range']::-moz-range-thumb {
	background: currentColor;
	border: 0;
	width: var(--thumb-width, var(--thumb-height));
	border-radius: var(--thumb-width, var(--thumb-height));
	cursor: grab;
}

input[type='range']:active::-moz-range-thumb {
	cursor: grabbing;
}

input[type='range']::-moz-range-track {
	width: 100%;
	background: var(--track-color);
}

input[type='range']::-moz-range-progress {
	appearance: none;
	background: currentColor;
	transition-delay: 30ms;
}

input[type='range']::-moz-range-track,
input[type='range']::-moz-range-progress {
	height: calc(var(--track-height) + 1px);
	border-radius: var(--track-height);
}

input[type='range']::-moz-range-thumb,
input[type='range']::-moz-range-progress {
	filter: brightness(100%);
}

input[type='range']:hover::-moz-range-thumb,
input[type='range']:hover::-moz-range-progress {
	filter: brightness(var(--brightness-hover));
}

input[type='range']:active::-moz-range-thumb,
input[type='range']:active::-moz-range-progress {
	filter: brightness(var(--brightness-down));
}

input[type='range']:disabled::-moz-range-thumb {
	cursor: not-allowed;
}
/* === end of range theme and appearance === */
</style>
