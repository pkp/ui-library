<template>
	<div class="pkpFilter--slider pkpFilter--sliderMultirange" :class="classes">
		<button v-if="isFilterActive" class="pkpFilter__remove" @click="remove">
			<Icon icon="Cancel" class="h-4 w-4 text-negative" />
			<span class="-screenReader">
				{{ t('common.filterRemove', {filterTitle: title}) }}
			</span>
		</button>
		<button v-else class="pkpFilter__add" @click="enable">
			<Icon icon="Add" class="h-4 w-4" />
			<span class="-screenReader">
				{{ t('common.filterAdd', {filterTitle: title}) }}
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
					id="sliderMore"
					v-model.number="currentValue[0]"
					type="range"
					:max="moreThanMax"
					:min="min"
					:disabled="!isFilterActive"
				/>
			</div>
			<div class="pkpFilter__multirangeInput">
				<label class="-screenReader" for="sliderLess">
					{{ lessThanLabel }}
				</label>
				<input
					id="sliderLess"
					v-model.number="currentValue[1]"
					type="range"
					:max="max"
					:min="lessThanMin"
					:disabled="!isFilterActive"
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
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {Icon},
	extends: FilterSlider,
	props: {
		/** An accessible label for the higher value. Typically "Less than". */
		lessThanLabel: {
			type: String,
			required: true,
		},
		/** An accessible label for the lower value. Typically "Higher than". */
		moreThanLabel: {
			type: String,
			required: true,
		},
		/** An accessible label to show current value. Typically "{$min}-{$max}"  */
		valueLabel: {
			type: String,
			required: true,
		},
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
		},
	},
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
