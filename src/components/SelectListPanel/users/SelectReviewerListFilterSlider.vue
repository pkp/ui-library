<template>
	<div class="pkpListPanel__filterSet pkpListPanel__filterSet--hasSlider" :class="{'pkpListPanel__filterSet--disabled': !isFilterActive}">
		<button	v-if="isFilterActive"
			class="pkpListPanel__filterRemove"
			@click="clearFilter"
		>
			<icon icon="times-circle-o" />
			<span class="-screenReader">{{ __('filterRemove', {filterTitle: label}) }}</span>
		</button>
		<button	v-else
			class="pkpListPanel__filterAdd"
			@click="enableFilter"
		>
			<icon icon="plus-square-o" />
			<span class="-screenReader">{{ __('filterAdd', {filterTitle: label}) }}</span>
		</button>
		<label
			class="pkpListPanel__filterInputLabel"
			:tabindex="!isFilterActive ? -1 : false"
			@click="enableFilter"
		>
			{{ label }}
		</label>
		<div class="pkpListPanel__filterInput pkpListPanel__filterInput--slider">
			<vue-slider
				:ref="sliderRef"
				:value="filterValue"
				:min="min"
				:max="max"
				:formatter="formatter"
				:disabled="!isFilterActive"
				:speed="0.3"
				tooltip-dir="bottom"
				:class="{'vue-slider-component--stars': useStars}"
				@callback="(val) => filterBy(val)"
			>
				<template v-if="useStars" slot="tooltip" slot-scope="{ value }">
					<span class="vue-slider-tooltip--stars">
						<icon v-for="index in value" :key="index" icon="star" />
						<span class="-screenReader">{{ __(starLabel, {rating: value}) }}</span>
					</span>
				</template>
			</vue-slider>
		</div>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import VueSlider from 'vue-slider-component';
import debounce from 'debounce';

export default {
	name: 'SelectReviewerListFilterSlider',
	components: {
		Icon,
		VueSlider,
	},
	props: [
		'filterId',
		'filterValue',
		'isFilterActive',
		'label',
		'min',
		'max',
		'formatter',
		'isVisible',
		'useStars',
		'starLabel',
		'i18n',
	],
	computed: {
		sliderRef: function () {
			return 'slider' + this.filterId;
		},
	},
	methods: {
		enableFilter: function () {
			this.$emit('filterBy', this.filterId, this.filterValue);
		},
		/**
		 * Throttle this so that sliders don't fire off dozens of
		 * filtering requests as they're being moved.
		 */
		filterBy: debounce(function (val) {
			this.$emit('filterBy', this.filterId, val);
		}, 250),

		clearFilter: function () {
			this.$emit('clearFilter', this.filterId);
		},
	},
	watch: {
		/**
		 * Refresh any sliders whenever the filter is opened or closed. This
		 * updates the width of the component when the filter has fully expanded.
		 */
		isVisible: function (newVal, oldVal) {
			if (!newVal || newVal === oldVal) {
				return;
			}
			let slider = this.$refs[this.sliderRef];
			setTimeout(function () {
				slider.refresh();
			}, 300);
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

/**
 * Fade the slider in on a slight delay. This gives the slider component time
 * to refresh it's width after the filters have slid into view.
 */
.pkpListPanel__filterSet--hasSlider {
	opacity: 0;
	transition: opacity 0.4s ease-in-out 0.4s, left 0s ease-in-out 0.4s, width 0s ease-in-out 0.4s;
}

.pkpListPanel__filter.-isVisible {

	.pkpListPanel__filterSet--hasSlider {
		opacity: 1;
	}
}

.pkpListPanel__filterSet--disabled {

	.pkpListPanel__filterInput {
		opacity: 0.5;
	}

	.vue-slider-tooltip,
	.vue-slider-tooltip--stars,
	.vue-slider-process {
		display: none !important;
	}
}

.pkpListPanel__filterAdd,
.pkpListPanel__filterRemove {
	top: 0.8em;
}

.pkpListPanel__filterInput--slider {
	margin-left: -8px;
	margin-right: -8px;
	padding-bottom: 3em; // account for label space
}

.pkpListPanel__filterInputLabel {
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

	.vue-slider-tooltip-wrap.vue-slider-tooltip-bottom .vue-slider-tooltip::before {
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
