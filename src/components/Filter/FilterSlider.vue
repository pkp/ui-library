<template>
	<div class="pkpFilter--slider" :class="classes">
		<button v-if="isFilterActive" class="pkpFilter__remove" @click="remove">
			<icon icon="times-circle-o" />
			<span class="-screenReader">
				{{ __('filterRemove', {filterTitle: title}) }}
			</span>
		</button>
		<button v-else class="pkpFilter__add" @click="enable">
			<icon icon="plus-square-o" />
			<span class="-screenReader">
				{{ __('filterAdd', {filterTitle: title}) }}
			</span>
		</button>
		<div
			class="pkpFilter__inputTitle"
			:tabindex="!isFilterActive ? -1 : false"
			aria-hidden="true"
			@click="toggle"
		>
			{{ title }}
		</div>
		<div class="pkpFilter__input pkpFilter__input--slider">
			<label class="-screenReader" for="slider">{{ title }}</label>
			<input
				type="range"
				:min="min"
				:max="max"
				id="slider"
				v-model="currentValue"
			/>
			<output ref="output">
				{{ currentValue }}
			</output>
		</div>
	</div>
</template>

<script>
import Filter from './Filter.vue';
import debounce from 'debounce';

export default {
	extends: Filter,
	props: {
		formatter: {
			type: String,
			default() {
				return '';
			}
		},
		isVisible: {
			type: Boolean,
			required: true
		},
		max: {
			type: Number,
			required: true
		},
		min: {
			type: Number,
			required: true
		},
		starLabel: {
			type: String,
			default() {
				return '';
			}
		},
		useStars: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			currentValue: this.value
		};
	},
	computed: {
		/**
		 * Classes to apply to the root element
		 *
		 * @return {Array}
		 */
		classes() {
			let classes = Filter.computed.classes.apply(this);
			if (this.isVisible) {
				classes.push('-isVisible');
			}
			return classes;
		},

		/**
		 * A unique ID to use as the reference for the slider
		 *
		 * @return {String}
		 */
		sliderRef() {
			return 'slider' + this.param;
		}
	},
	methods: {
		/**
		 * Enable the filter and emit an event to update active
		 * filters with the current value
		 */
		enable() {
			this.$emit('add-filter', this.param, this.value);
		},

		/**
		 * Emit an event to update active filters with the current
		 * value.
		 *
		 * Throttle this method so that slideres don't off dozens of
		 * events as they're being moved.
		 */
		updateCurrentValue: debounce(function(value) {
			this.$emit('update-filter', this.param, value);
		}, 250),
		/**
		 * @copydoc Filter::remove()
		 */
		remove() {
			this.$emit('remove-filter', this.param);
		}
	},
	watch: {
		/**
		 * Refresh any sliders whenever the filter is opened or closed. This
		 * updates the width of the component when the filter has fully expanded.
		 */
		isVisible: function(newVal, oldVal) {
			if (!newVal || newVal === oldVal) {
				return;
			}
			let slider = this.$refs[this.sliderRef];
			setTimeout(function() {
				slider.refresh();
			}, 300);
		},
		currentValue(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			} else {
				this.updateCurrentValue(newVal);
				const val = this.$refs.output.value;
				this.min ? this.min : 0;
				this.max ? this.max : 100;
				newVal = Number(((val - this.min) * 100) / (this.max - this.min));
				this.$refs.output.style.left = newVal + '%';
			}
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

/**
 * Fade the slider in on a slight delay. This gives the slider component time
 * to refresh it's width after the filters have slid into view.
 */
.pkpFilter--slider {
	padding-left: 1rem;
	padding-right: 1rem;
	opacity: 0;
	transition: opacity 0.4s ease-in-out 0.4s, left 0s ease-in-out 0.4s,
		width 0s ease-in-out 0.4s;

	&.-isVisible {
		opacity: 1;
	}
}

.pkpFilter--slider.pkpFilter--disabled {
	.pkpFilter__input {
		opacity: 0.5;
	}

	.vue-slider-tooltip,
	.vue-slider-tooltip--stars,
	.vue-slider-process {
		display: none !important;
	}
}

.pkpFilter--slider .pkpFilter__add,
.pkpFilter--slider .pkpFilter__remove {
	top: 0.7rem;
}

.pkpFilter__input--slider {
	// margin-left: -8px;
	// margin-right: -8px;
	padding-bottom: 3em; // account for title space
	position: relative;
}

.pkpFilter__inputTitle {
	margin-right: @base;
	cursor: pointer;
	line-height: 1.5em;
}

.vue-slider-component {
	.vue-slider-tooltip {
		border-color: @primary;
		background: @primary;
		font-size: @font-tiny;
		line-height: 1.5em;
	}

	.vue-slider-tooltip-wrap.vue-slider-tooltip-bottom
		.vue-slider-tooltip::before {
		border-bottom-color: @primary;
	}

	.vue-slider-process {
		background: @primary;
	}
}

.vue-slider-component--stars .vue-slider-tooltip-wrap {
	width: 70px;
	text-align: center;

	.fa {
		color: @star-on;
	}
}

output {
	position: absolute;
}

input[type='range'] {
	-webkit-appearance: none; /* Hides the slider so that custom slider can be made */
	width: 100%; /* Specific width is required for Firefox. */
	background: transparent; /* Otherwise white in Chrome */
	margin-left: 0;
}

input[type='range']::-webkit-slider-thumb {
	-webkit-appearance: none;
}

input[type='range']:focus {
	outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type='range']::-webkit-slider-thumb {
	-webkit-appearance: none;
	height: 15px;
	width: 15px;
	border-radius: 50%;
	background-color: #fff;
	box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
}

/* All the same stuff for Firefox */
input[type='range']::-moz-range-thumb {
	height: 15px;
	width: 15px;
	border-radius: 50%;
	background-color: #fff;
	box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
}

/* All the same stuff for IE */
input[type='range']::-ms-thumb {
	height: 15px;
	width: 15px;
	border-radius: 50%;
	background-color: #fff;
	box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
}

input[type='range']::-ms-track {
	width: 100%;
	cursor: pointer;

	/* Hides the slider so custom styles can be added */
	background: transparent;
	border-color: transparent;
	color: transparent;
}

input[type='range']::-webkit-slider-runnable-track {
	width: 100%;
	height: 7px;
	cursor: pointer;
	border-radius: 15px;
	background-color: #ccc;
}

input[type='range']:focus::-webkit-slider-runnable-track {
	background: #367ebd;
}

input[type='range']::-moz-range-track {
	width: 100%;
	height: 7px;
	cursor: pointer;
	border-radius: 15px;
	background-color: #ccc;
}

input[type='range']::-ms-track {
	width: 100%;
	height: 7px;
	cursor: pointer;
	border-radius: 15px;
	background-color: #ccc;
}
input[type='range']::-ms-fill-lower {
	background: #0064b4;
	border-radius: 15px;
}
input[type='range']:focus::-ms-fill-lower {
	background: #0064b4;
}
input[type='range']::-ms-fill-upper {
	background: #0064b4;
	border-radius: 15px;
}
input[type='range']:focus::-ms-fill-upper {
	background: #0064b4;
}
</style>
