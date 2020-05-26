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
				:max="max"
				:min="min"
				:disabled="!isFilterActive"
				id="slider"
				v-model="currentValue"
			/>
			<output
				ref="output"
				v-if="isFilterActive"
				class="pkpFilter__value"
				:style="valueStyles"
			>
				<span class="pkpFilter__valueCaret" aria-hidden="true" />
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
		},
		valueStyles() {
			if (this.isFilterActive) {
				const position = Number(
					((this.currentValue - this.min) * 100) / (this.max - this.min)
				);
				// The numbers here account for the way that the native input
				// range filter aligns the handle on the left and right. The
				// exact position of the center of the handle is not the same
				// as position. The offset here accounts for the shift in
				// position that must occur when the handle is on the left
				// or right of the range.
				const offset = 8 + (position / 100) * -17;
				return {
					left: `calc(${position}% + ${offset}px)`
				};
			}
			return {};
		}
	},
	methods: {
		/**
		 * Enable the filter and emit an event to update active
		 * filters with the current value
		 */
		enable() {
			this.$emit('add-filter', this.param, parseInt(this.currentValue, 0));
		},

		/**
		 * Emit an event to update active filters with the current
		 * value.
		 *
		 * Throttle this method so that sliders don't fire off dozens of
		 * events as they're being moved.
		 */
		updateCurrentValue: debounce(function(value) {
			this.$emit('update-filter', this.param, parseInt(value, 0));
		}, 250),

		/**
		 * @copydoc Filter::remove()
		 */
		remove() {
			this.$emit('remove-filter', this.param);
		}
	},
	mounted() {
		// this.showValueBubble(this.currentValue);
	},
	watch: {
		currentValue: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			} else {
				this.updateCurrentValue(newVal);
				return newVal;
			}
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFilter--slider {
	padding-left: 1rem;
	padding-right: 1rem;
}

.pkpFilter--disabled {
	.pkpFilter__input--slider {
		opacity: 0.5;
	}
}

.pkpFilter--slider .pkpFilter__add,
.pkpFilter--slider .pkpFilter__remove {
	top: 0.6rem;
}

.pkpFilter__input--slider {
	position: relative;
	padding-bottom: 1.5rem; // account for value bubble below input
}

.pkpFilter__inputTitle {
	margin-right: @base;
	color: @primary;
	line-height: 1.5em;
	cursor: pointer;
}

.pkpFilter__value {
	position: absolute;
	top: 1.75rem;
	padding: 0.25em;
	background-color: @bg-anchor;
	border-radius: @radius;
	text-align: center;
	line-height: 1;
	color: @lift;
	transform: translateX(-50%);
}

.pkpFilter__valueCaret {
	content: '';
	position: absolute;
	width: 0;
	height: 0;
	border-bottom: 0.25rem solid @bg-anchor;
	border-left: 0.25rem solid transparent;
	border-right: 0.25rem solid transparent;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
}

// Cross-browser range input styles
.pkpFilter__input--slider {
	input[type='range'] {
		-webkit-appearance: none; /* Hides the slider so that custom slider can be made */
		width: 100%; /* Specific width is required for Firefox. */
		background: transparent; /* Otherwise white in Chrome */
		margin-left: 0;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: @base;
		width: @base;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.25);
	}

	// Firefox
	input[type='range']::-moz-range-thumb {
		height: @base;
		width: @base;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.25);
	}

	// IE
	input[type='range']::-ms-thumb {
		height: @base;
		width: @base;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.25);
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
		height: 5px;
		cursor: pointer;
		border-radius: @base;
		background-color: @bg-dark;
	}

	input[type='range']:focus::-webkit-slider-runnable-track {
		background: #367ebd;
	}

	input[type='range']::-moz-range-track {
		width: 100%;
		height: 5px;
		cursor: pointer;
		border-radius: @base;
		background-color: @bg-dark;
	}

	input[type='range']::-ms-track {
		width: 100%;
		height: 5px;
		cursor: pointer;
		border-radius: @base;
		background-color: @bg-dark;
	}
	input[type='range']::-ms-fill-lower {
		background: @bg-dark;
		border-radius: @base;
	}
	input[type='range']:focus::-ms-fill-lower {
		background: @bg-dark;
	}
	input[type='range']::-ms-fill-upper {
		background: @bg-dark;
		border-radius: @base;
	}
	input[type='range']:focus::-ms-fill-upper {
		background: @bg-dark;
	}
}
</style>
