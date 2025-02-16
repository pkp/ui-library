<template>
	<div class="pkpDateRange">
		<span class="-screenReader">{{ dateRangeLabel }}</span>
		<span v-strip-unsafe-html="currentRange" class="pkpDateRange__current" />
		<button
			ref="toggleButton"
			class="pkpDateRange__button"
			@click="toggle"
			@blur="closeOnBlur"
		>
			<div
				class="flex h-8 w-8 items-center justify-center border-e border-e-light border-opacity-40 text-primary"
			>
				<Icon icon="Calendar" class="h-5 w-5" :inline="true" />
			</div>
			<span class="-screenReader">
				{{ changeDateRangeLabel }}
			</span>
		</button>
		<div v-if="options && isOpen" class="pkpDateRange__options">
			<div class="pkpDateRange__optionGroup">
				<div v-for="option in options" :key="option.value">
					<button
						:ref="option.value"
						class="pkpDateRange__option"
						@click="selectOption(option.dateStart, option.dateEnd)"
					>
						{{ option.label }}
					</button>
				</div>
			</div>
			<form
				class="pkpDateRange__optionGroup pkpDateRange__form"
				@submit="applyCustomRange"
			>
				<fieldset class="pkpDateRange__inputGroup">
					<legend>{{ customRangeLabel }}</legend>
					<div :id="uniqueId + '-describedBy'" class="-screenReader">
						{{ dateFormatInstructionsLabel }}
					</div>
					<label>
						<span class="-screenReader">{{ fromDateLabel }}</span>
						<input
							ref="dateStart"
							v-model="localDateStart"
							class="pkpDateRange__input pkpDateRange__input--start"
							placeholder="YYYY-MM-DD"
							:aria-describedby="uniqueId + '-describedBy'"
							:aria-invalid="!!errorMessage"
							@focus="focus"
						/>
					</label>
					<span class="pkpDateRange__separator">—</span>
					<label>
						<span class="-screenReader">{{ toDateLabel }}</span>
						<input
							ref="dateEnd"
							v-model="localDateEnd"
							class="pkpDateRange__input pkpDateRange__input--end"
							placeholder="YYYY-MM-DD"
							:aria-describedby="uniqueId + '-describedBy'"
							:aria-invalid="!!errorMessage"
							@focus="focus"
						/>
					</label>
				</fieldset>
				<PkpButton @click="applyCustomRange">{{ applyLabel }}</PkpButton>
				<div v-if="errorMessage" class="pt-2 text-base-normal">
					<Icon icon="Error" class="me-1 h-5 w-5" :inline="true" />
					<span v-strip-unsafe-html="errorMessage" class="align-middle" />
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {PkpButton, Icon},
	props: {
		/** A unique string to be used in <code>id</code> attributes. These ids are used internally for accessible labeling of the date range fields. This string should be unique on the page where the component is rendered. */
		uniqueId: {
			type: String,
			required: true,
		},
		/** The current start date value. Expects <code>YYYY-MM-DD</code>.  */
		dateStart: {
			type: String,
			default: '',
		},
		/** The earliest allowed start date value. <code>YYYY-MM-DD</code>. */
		dateStartMin: {
			type: String,
			default: '',
		},
		/** The current end date value. Expects <code>YYYY-MM-DD</code>. */
		dateEnd: {
			type: String,
			default: '',
		},
		/** The latest allowed end date value. Expects <code>YYYY-MM-DD</code>. */
		dateEndMax: {
			type: String,
			default: '',
		},
		/** Localized label used in the component. */
		dateRangeLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		dateFormatInstructionsLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		changeDateRangeLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		sinceDateLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		untilDateLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		allDatesLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		customRangeLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		fromDateLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		toDateLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		applyLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		invalidDateLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		dateDoesNotExistLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		invalidDateRangeLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		invalidStartDateMinLabel: {
			type: String,
			required: true,
		},
		/** Localized label used in the component. */
		invalidEndDateMaxLabel: {
			type: String,
			required: true,
		},
		/** An array of quick options that the user can select instead of setting a custom range. */
		options: Array,
	},
	emits: [
		/** The start and end dates for the date range. */
		'set-range',
		/** A concatenated string describing the date range. */
		'updated:current-range',
	],
	data() {
		return {
			isOpen: false,
			localDateStart: '',
			localDateEnd: '',
			errorMessage: '',
		};
	},
	computed: {
		/**
		 * The range compiled into a readable string
		 *
		 * @return string
		 */
		currentRange() {
			if (this.dateStart && !this.dateEnd) {
				return this.replaceLocaleParams(this.sinceDateLabel, {
					date: this.dateStart,
				});
			} else if (!this.dateStart && this.dateEnd) {
				return this.replaceLocaleParams(this.untilDateLabel, {
					date: this.dateEnd,
				});
			} else if (!this.dateStart && !this.dateEnd) {
				return this.allDatesLabel;
			}
			return this.dateStart + ' — ' + this.dateEnd;
		},
	},
	watch: {
		currentRange(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.$emit('updated:current-range', newVal);
			}
		},
	},
	mounted() {
		this.localDateStart = this.dateStart;
		this.localDateEnd = this.dateEnd;
	},
	methods: {
		/**
		 * Open and close the range selection popup
		 */
		toggle() {
			this.isOpen = !this.isOpen;
		},

		/**
		 * Open the options panel when an input is focused
		 */
		focus() {
			this.isOpen = true;
		},

		/**
		 * Emit an event to set the range
		 *
		 * @param string dateStart
		 * @param string dateEnd
		 */
		set(dateStart, dateEnd) {
			this.$emit('set-range', dateStart, dateEnd);
		},

		/**
		 * Select one of the quick options
		 *
		 * @param string dateStart
		 * @param string dateEnd
		 */
		selectOption(dateStart, dateEnd) {
			this.set(dateStart, dateEnd);
			this.$refs.toggleButton.focus();
			this.isOpen = false;
		},

		/**
		 * Apply a custom range set by the user
		 */
		applyCustomRange() {
			this.errorMessage = '';

			if (this.localDateStart.length) {
				if (!this.validateFormat(this.localDateStart)) {
					this.errorMessage = this.invalidDateLabel;
					return;
				}
				if (!this.validateDateExists(this.localDateStart)) {
					this.errorMessage = this.dateDoesNotExistLabel;
					return;
				}
			}

			if (this.localDateEnd.length) {
				if (!this.validateFormat(this.localDateEnd)) {
					this.errorMessage = this.invalidDateLabel;
					return;
				}
				if (!this.validateDateExists(this.localDateEnd)) {
					this.errorMessage = this.dateDoesNotExistLabel;
					return;
				}
			}

			if (!this.validateRange(this.localDateStart, this.localDateEnd)) {
				this.errorMessage = this.invalidDateRangeLabel;
				return;
			}

			if (!this.validateDateStartMin(this.localDateStart)) {
				this.errorMessage = this.replaceLocaleParams(
					this.invalidStartDateMinLabel,
					{date: this.dateStartMin},
				);
				return;
			}

			if (!this.validateDateEndMax(this.localDateEnd)) {
				this.errorMessage = this.replaceLocaleParams(
					this.invalidEndDateMaxLabel,
					{date: this.dateEndMax},
				);
				return;
			}

			this.set(this.localDateStart, this.localDateEnd);
			this.$refs.toggleButton.focus();
			this.isOpen = false;
		},

		/**
		 * Close the date range dropdown when it loses focus
		 */
		closeOnBlur() {
			setTimeout(() => {
				if (this.$el.contains(document.activeElement)) {
					var interval = setInterval(() => {
						if (!this.$el.contains(document.activeElement)) {
							this.isOpen = false;
							window.clearInterval(interval);
						}
					}, 1000);
				} else {
					this.isOpen = false;
				}
			}, 10);
		},

		/**
		 * Check if a date is in the format (YYYY-MM-DD)
		 *
		 * @param string date user input
		 * @return boolean
		 */
		validateFormat(date) {
			return date.match(/^[\d]{4}-[\d]{2}-[\d]{2}$/) !== null;
		},

		/**
		 * Check if the date exists
		 *
		 * @param string date
		 * @return boolean
		 */
		validateDateExists(date) {
			const dateExists = this.getBrowserSafeDate(date);
			return !isNaN(dateExists.getTime());
		},

		/**
		 * Check if the date range is valid
		 *
		 * @param string startDate A validated date
		 * @param string endDate A validated date
		 * @return boolean
		 */
		validateRange(startDate, endDate) {
			// Empty strings are valid
			if (!startDate.length || !endDate.length) {
				return true;
			}

			const startDateInt = parseInt(startDate.replace(/-/g, ''));
			const endDateInt = parseInt(endDate.replace(/-/g, ''));

			// A start date can not be later than the end date
			if (startDateInt > endDateInt) {
				return false;
			}

			return true;
		},

		/**
		 * Check if the start date is too early
		 *
		 * @param Date startDate
		 * @return Boolean
		 */
		validateDateStartMin(startDate) {
			if (this.dateStartMin) {
				return (
					parseInt(startDate.replace(/-/g, '')) >=
					parseInt(this.dateStartMin.replace(/-/g, ''))
				);
			}
			return true;
		},

		/**
		 * Check if the end date is too late
		 *
		 * @param Date endDate
		 * @return Boolean
		 */
		validateDateEndMax(endDate) {
			if (this.dateEndMax) {
				return (
					parseInt(endDate.replace(/-/g, '')) <=
					parseInt(this.dateEndMax.replace(/-/g, ''))
				);
			}
			return true;
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpDateRange {
	position: relative;
	display: inline-block;
	min-width: 12em;
	height: calc(2rem + 2px);
	background: @lift;
	font-size: @font-sml;
}

.pkpDateRange__current {
	margin-inline-start: 2rem;
	padding: 0.5rem;
	line-height: calc(2rem + 2px);
	font-weight: @bold;
	color: @primary;
}

.pkpDateRange__button {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: transparent;
	border: @bg-border-light;
	border-radius: @radius;
	box-shadow: 0 1px 0 @bg-border-color-light;
	cursor: pointer;

	&:hover,
	&:focus {
		border-color: @primary;
		outline: 0;

		div {
			@apply border-e-primary;
		}
	}
}

.pkpDateRange__options {
	position: absolute;
	z-index: 9999;
	top: 100%;
	left: 0;
	margin-top: -1px;
	width: 100%;
	min-width: 18rem;
	background: @lift;
	border: @bg-border-light;
}

.pkpDateRange__optionGroup {
	padding: 0.5rem;

	+ .pkpDateRange__optionGroup {
		border-top: @bg-border-light;
	}
}

.pkpDateRange__option {
	display: inline-block;
	padding: 0.25rem;
	margin-inline-start: -0.25rem;
	border: none;
	border-radius: @radius;
	box-shadow: none;
	background: transparent;
	color: @primary;
	cursor: pointer;

	&:hover {
		color: @primary-lift;
	}

	&:focus {
		box-shadow: 0 0 0 1px @primary;
		outline: 0;
	}
}

.pkpDateRange__form {
	font-size: @font-tiny;
	line-height: 1.5em;

	legend {
		font-weight: @bold;
		margin-bottom: 0.25rem;
	}

	.pkpButton {
		font-size: @font-tiny;
		line-height: 1.5em;
		margin-inline-start: 0.25em;
		padding: 0.25rem 0.5rem;
	}
}

.pkpDateRange__inputGroup {
	display: inline-block;
	margin: 0;
	padding: 0;
	border: none;
}

.pkpDateRange__input {
	margin: 0;
	padding: 0.25rem 0.5em;
	max-width: 7.5em;
	border: @bg-border;
	border-radius: @radius;
	font-size: @font-tiny;
	line-height: 1.5em;

	&:focus {
		border-color: @primary;
	}
}

.pkpDateRange__separator {
	color: @bg-border-color;
}

[dir='rtl'] {
	.pkpDateRange__button .fa {
		left: auto;
		right: 0;
	}

	.pkpDateRange__options {
		left: auto;
		right: 0;
	}
}
</style>
