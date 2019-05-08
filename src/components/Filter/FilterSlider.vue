<template>
	<div class="pkpFilter--slider" :class="classes">
		<button v-if="isFilterActive" class="pkpFilter__remove" @click="remove">
			<icon icon="times-circle-o" />
			<span class="-screenReader">{{
				__('filterRemove', {filterTitle: title})
			}}</span>
		</button>
		<button v-else class="pkpFilter__add" @click="enable">
			<icon icon="plus-square-o" />
			<span class="-screenReader">{{
				__('filterAdd', {filterTitle: title})
			}}</span>
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
			<vue-slider
				:ref="sliderRef"
				:value="value"
				:min="min"
				:max="max"
				:formatter="formatter"
				:disabled="!isFilterActive"
				:speed="0.3"
				tooltip-dir="bottom"
				:class="{'vue-slider-component--stars': useStars}"
				@callback="val => update(val)"
			>
				<template v-if="useStars" slot="tooltip" slot-scope="{value}">
					<span class="vue-slider-tooltip--stars">
						<icon v-for="index in value" :key="index" icon="star" />
						<span class="-screenReader">{{
							starLabel.replace('{$rating}', value)
						}}</span>
					</span>
				</template>
			</vue-slider>
		</div>
	</div>
</template>

<script>
import Filter from './Filter.vue';
import VueSlider from 'vue-slider-component';
import debounce from 'debounce';

export default {
	extends: Filter,
	components: {
		VueSlider
	},
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
		update: debounce(function(value) {
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
	margin-left: -8px;
	margin-right: -8px;
	padding-bottom: 3em; // account for title space
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
</style>
