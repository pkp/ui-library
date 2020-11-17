<template>
	<div class="pkpFilter pkpFilter--slider" :class="classes">
		<button v-if="isFilterActive" class="pkpFilter__remove" @click="remove">
			<icon icon="times-circle-o" />
			<span class="-screenReader">
				{{ __('common.filterRemove', {filterTitle: title}) }}
			</span>
		</button>
		<button v-else class="pkpFilter__add" @click="enable">
			<icon icon="plus-square-o" />
			<span class="-screenReader">
				{{ __('common.filterAdd', {filterTitle: title}) }}
			</span>
		</button>
		<div class="pkpFilter__inputTitle" aria-hidden="true" @click="toggle">
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
				v-model.number="currentValue"
			/>
			<output
				ref="output"
				v-if="isFilterActive"
				for="slider"
				class="pkpFilter__value"
				:style="valueStyles"
			>
				<span class="pkpFilter__valueCaret" aria-hidden="true" />
				<span
					v-if="useStars"
					aria-hidden="true"
					class="pkpFilter__value--stars"
				>
					<icon
						v-for="i in 5"
						:key="i"
						:icon="i <= currentValue ? 'star' : 'star-o'"
					/>
				</span>
				<template v-else>
					{{ currentValueLabel }}
				</template>
			</output>
		</div>
	</div>
</template>

<script>
import Filter from './Filter.vue';
import Icon from '@/components/Icon/Icon.vue';
import debounce from 'debounce';

export default {
	extends: Filter,
	components: {
		Icon
	},
	props: {
		max: {
			type: Number,
			required: true
		},
		min: {
			type: Number,
			required: true
		},
		useStars: {
			type: Boolean,
			default() {
				return false;
			}
		},
		valueLabel: {
			type: String,
			default() {
				return '{$value}';
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
		 * A label to show the current value
		 *
		 * @return {String}
		 */
		currentValueLabel() {
			return this.valueLabel.replace('{$value}', this.currentValue);
		},

		/**
		 * Position the current value "bubble" directly
		 * below the range input's handle
		 *
		 * @return {Object}
		 */
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
			this.$emit('add-filter', this.param, this.currentValue);
		},

		/**
		 * Emit an event to update active filters with the current
		 * value.
		 *
		 * Debounce this method so that sliders don't fire off dozens of
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
		 * Fire a debounced method to update the active filter
		 * value
		 */
		currentValue: function(newVal, oldVal) {
			this.updateCurrentValue(newVal);
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFilter--slider {
	position: relative;
	padding-left: 1rem;
	padding-right: 1rem;

	// Make room for the slider value when another filter
	// immediately follows this one
	+ .pkpFilter {
		margin-top: 1rem;
	}
}

.pkpFilter--slider .pkpFilter__add,
.pkpFilter--slider .pkpFilter__remove {
	top: 0.6rem;
}

.pkpFilter__input--slider {
	position: relative;
}

.pkpFilter__inputTitle {
	margin-right: 1rem;
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
	white-space: nowrap;
	z-index: 3;
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

.pkpFilter__value--stars {
	color: @star-on;
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
		height: 1rem;
		width: 1rem;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.25);
	}

	// Firefox
	input[type='range']::-moz-range-thumb {
		height: 1rem;
		width: 1rem;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.25);
	}

	// IE
	input[type='range']::-ms-thumb {
		height: 1rem;
		width: 1rem;
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
		border-radius: 1rem;
		background-color: @primary;
	}

	input[type='range']:focus::-webkit-slider-runnable-track {
		background: #367ebd;
	}

	input[type='range']::-moz-range-track {
		width: 100%;
		height: 5px;
		cursor: pointer;
		border-radius: 1rem;
		background-color: @primary;
	}

	input[type='range']::-ms-track {
		width: 100%;
		height: 5px;
		cursor: pointer;
		border-radius: 1rem;
		background-color: @primary;
	}
	input[type='range']::-ms-fill-lower {
		background: @primary;
		border-radius: 1rem;
	}
	input[type='range']:focus::-ms-fill-lower {
		background: @primary;
	}
	input[type='range']::-ms-fill-upper {
		background: @primary;
		border-radius: 1rem;
	}
	input[type='range']:focus::-ms-fill-upper {
		background: @primary;
	}
}

.pkpFilter--disabled {
	.pkpFilter__input--slider {
		opacity: 0.5;
	}

	input[type='range']::-webkit-slider-runnable-track {
		background-color: @bg-dark;
	}

	input[type='range']::-moz-range-track {
		background-color: @bg-dark;
	}

	input[type='range']::-ms-track {
		background-color: @bg-dark;
	}

	input[type='range']::-ms-fill-lower {
		background: @bg-dark;
	}

	input[type='range']:focus::-ms-fill-lower {
		background: @bg-dark;
	}

	input[type='range']::-ms-fill-upper {
		background: @bg-dark;
	}

	input[type='range']:focus::-ms-fill-upper {
		background: @bg-dark;
	}
}
</style>
