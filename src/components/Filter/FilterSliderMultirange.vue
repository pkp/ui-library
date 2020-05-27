<template>
	<div class="pkpFilter--slider pkpFilter--sliderMultirange" :class="classes">
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
		<fieldset
			class="pkpFilter__input pkpFilter__input--slider pkpFilter__input--sliderMultirange"
		>
			<legend class="-screenReader">{{ title }}</legend>
			<div class="pkpFilter__multirangeInput">
				<label class="-screenReader" for="sliderMore">
					{{ moreThanLabel }}
				</label>
				<input
					type="range"
					:max="moreThanMax"
					:min="min"
					:disabled="!isFilterActive"
					id="sliderMore"
					v-model.number="currentValue[0]"
				/>
			</div>
			<div class="pkpFilter__multirangeInput">
				<label class="-screenReader" for="sliderLess">
					{{ lessThanLabel }}
				</label>
				<input
					type="range"
					:max="max"
					:min="lessThanMin"
					:disabled="!isFilterActive"
					id="sliderLess"
					v-model.number="currentValue[1]"
				/>
			</div>
		</fieldset>
		<div
			class="pkpFilter__value pkpFilter__value--multirange"
			aria-hidden="true"
		>
			<span class="pkpFilter__valueCaret" aria-hidden="true" />
			{{ currentValueLabel }}
		</div>
	</div>
</template>

<script>
import FilterSlider from './FilterSlider.vue';

export default {
	extends: FilterSlider,
	props: {
		lessThanLabel: {
			type: String,
			required: true
		},
		moreThanLabel: {
			type: String,
			required: true
		},
		valueLabel: {
			type: String,
			required: true
		}
	},
	computed: {
		/**
		 * The min option for the second range input,
		 * adjusted so that it is never less than the
		 * current value of the first range input.
		 *
		 * @return {Number}
		 */
		lessThanMin() {
			return Math.max(this.min, this.currentValue[0]);
		},

		/**
		 * The max attribute for the first range input,
		 * adjusted so that it is never more than the
		 * current value of the second range input.
		 *
		 * @return {Number}
		 */
		moreThanMax() {
			return Math.min(this.max, this.currentValue[1]);
		},

		/**
		 * A label to show the current value range
		 *
		 * @return {String}
		 */
		currentValueLabel() {
			return this.valueLabel
				.replace('{$min}', this.currentValue[0])
				.replace('{$max}', this.currentValue[1]);
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFilter__input--sliderMultirange {
	display: flex;
	margin: 0;
	padding: 0;
	border: none;
}

.pkpFilter__multirangeInput {
	position: relative;
	width: 100%;
}

.pkpFilter__value--multirange {
	position: relative;
	left: 50%;
	top: -0.5rem;
	display: inline-block;
}

.pkpFilter--disabled {
	.pkpFilter__value--multirange {
		opacity: 0;
	}
}
</style>
