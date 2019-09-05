<template>
	<div class="pkpDateRange">
		<span class="-screenReader">{{ i18n.dateRange }}</span>
		<span class="pkpDateRange__current" v-html="currentRange" />
		<button
			class="pkpDateRange__button"
			ref="toggleButton"
			@click="toggle"
			@blur="closeOnBlur"
		>
			<icon icon="calendar" />
			<span class="-screenReader">
				{{ i18n.changeDateRange }}
			</span>
		</button>
		<div v-if="options && this.isOpen" class="pkpDateRange__options">
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
					<legend>{{ i18n.customRange }}</legend>
					<div class="-screenReader" :id="uniqueId + '-describedBy'">
						{{ i18n.dateFormatInstructions }}
					</div>
					<label>
						<span class="-screenReader">{{ i18n.fromDate }}</span>
						<input
							class="pkpDateRange__input pkpDateRange__input--start"
							ref="dateStart"
							v-model="localDateStart"
							placeholder="YYYY-MM-DD"
							:aria-describedby="uniqueId + '-describedBy'"
							:aria-invalid="!!errorMessage"
							@focus="focus"
						/>
					</label>
					<span class="pkpDateRange__separator">&mdash;</span>
					<label>
						<span class="-screenReader">{{ i18n.toDate }}</span>
						<input
							class="pkpDateRange__input pkpDateRange__input--end"
							ref="dateEnd"
							v-model="localDateEnd"
							placeholder="YYYY-MM-DD"
							:aria-describedby="uniqueId + '-describedBy'"
							:aria-invalid="!!errorMessage"
							@focus="focus"
						/>
					</label>
				</fieldset>
				<pkp-button :label="i18n.apply" @click="applyCustomRange" />
				<div v-if="errorMessage" class="pkpDateRange__error">
					<icon icon="exclamation-triangle" :inline="true" />
					<span v-html="errorMessage" />
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	components: {
		PkpButton,
		Icon
	},
	props: {
		uniqueId: {
			type: String,
			required: true
		},
		dateStart: {
			type: String,
			default: ''
		},
		dateStartMin: {
			type: String,
			default: ''
		},
		dateEnd: {
			type: String,
			default: ''
		},
		dateEndMax: {
			type: String,
			default: ''
		},
		options: Array,
		i18n: Object
	},
	data() {
		return {
			isOpen: false,
			localDateStart: '',
			localDateEnd: '',
			errorMessage: ''
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
				return this.__('sinceDate', {date: this.dateStart});
			} else if (!this.dateStart && this.dateEnd) {
				return this.__('untilDate', {date: this.dateEnd});
			} else if (!this.dateStart && !this.dateEnd) {
				return this.i18n.allDates;
			}
			return this.dateStart + ' &mdash; ' + this.dateEnd;
		}
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
					this.errorMessage = this.i18n.invalidDate;
					return;
				}
				if (!this.validateDateExists(this.localDateStart)) {
					this.errorMessage = this.i18n.dateDoesNotExist;
					return;
				}
			}

			if (this.localDateEnd.length) {
				if (!this.validateFormat(this.localDateEnd)) {
					this.errorMessage = this.i18n.invalidDate;
					return;
				}
				if (!this.validateDateExists(this.localDateEnd)) {
					this.errorMessage = this.i18n.dateDoesNotExist;
					return;
				}
			}

			if (!this.validateRange(this.localDateStart, this.localDateEnd)) {
				this.errorMessage = this.i18n.invalidDateRange;
				return;
			}

			if (!this.validateDateStartMin(this.localDateStart)) {
				this.errorMessage = this.__('invalidStartDateMin', {
					date: this.dateStartMin
				});
				return;
			}

			if (!this.validateDateEndMax(this.localDateEnd)) {
				this.errorMessage = this.__('invalidEndDateMax', {
					date: this.dateEndMax
				});
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
			const dateExists = new Date(date);
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
		}
	},
	mounted() {
		this.localDateStart = this.dateStart;
		this.localDateEnd = this.dateEnd;
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpDateRange {
	position: relative;
	display: inline-block;
	min-width: 12em;
	height: @double + 2px;
	background: @lift;
	font-size: @font-sml;
}

.pkpDateRange__current {
	margin-left: 2rem;
	padding: 0.5rem;
	line-height: @double + 2px;
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

		.fa {
			border-right-color: @primary;
		}
	}

	.fa {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 2rem;
		border-right: @bg-border-light;
		color: @primary;

		&:before {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
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
	margin-left: -0.25rem;
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
		margin-left: 0.25em;
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

.pkpDateRange__error {
	padding-top: 0.5rem;
	font-size: @font-tiny;
	line-height: 1.5em;
}
</style>
