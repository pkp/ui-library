<template>
	<fieldset class="pkpFormField pkpFormField--options" :class="classes">
		<legend class="pkpFormField--options__legend">
			<template v-if="localeLabel">
				<span class="aria-hidden">{{ localeLabel }}</span>
				<span class="-screenReader">{{ multilingualLabel }}</span>
			</template>
			<template v-else>
				{{ label }}
			</template>
			<span v-if="isRequired" class="pkpFormFieldLabel__required">
				*
				<span class="-screenReader">{{ __('common.required') }}</span>
			</span>
			<tooltip
				v-if="isPrimaryLocale && tooltip"
				aria-hidden="true"
				:tooltip="tooltip"
				label=""
			/>
			<span
				v-if="isPrimaryLocale && tooltip"
				class="-screenReader"
				:id="describedByTooltipId"
				v-html="tooltip"
			/>
			<help-button
				v-if="isPrimaryLocale && helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="__('help.help')"
			/>
		</legend>
		<div
			v-if="isPrimaryLocale && description"
			class="pkpFormField__description pkpFormField--options__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<field-error
			v-if="errors && errors.length"
			:id="describedByErrorId"
			:messages="errors"
		/>
		<div class="pkpFormField__control">
			<draggable
				v-model="localizedOptions"
				@end="updateValueOrder"
				:disabled="!isOrderable"
			>
				<label
					v-for="option in localizedOptions"
					:key="option.value"
					class="pkpFormField--options__option"
				>
					<!--
						The `type` property can not be dynamic when using the
						v-model and value properties together, or it results
						in an error in IE 11.
						See: https://stackoverflow.com/a/59999459/1723499
					-->
					<input
						v-if="type === 'checkbox'"
						class="pkpFormField--options__input"
						v-model="selectedValue"
						:value="option.value"
						type="checkbox"
						:name="localizedName"
						:aria-describedby="describedByIds"
						:aria-invalid="errors && errors.length"
						:disabled="option.disabled"
					/>
					<input
						v-else
						class="pkpFormField--options__input"
						v-model="selectedValue"
						:value="option.value"
						type="radio"
						:name="localizedName"
						:aria-describedby="describedByIds"
						:aria-invalid="errors && errors.length"
						:disabled="option.disabled"
					/>
					<span
						class="pkpFormField--options__optionLabel"
						v-html="option.label"
					/>
					<orderer
						v-if="isOrderable"
						@up="optionOrderUp"
						@down="optionOrderDown"
						:itemId="option.value"
						:itemTitle="option.label"
					/>
				</label>
			</draggable>
			<multilingual-progress
				v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
			/>
		</div>
	</fieldset>
</template>

<script>
import FieldBase from './FieldBase.vue';
import draggable from 'vuedraggable';
import Orderer from '@/components/Orderer/Orderer.vue';

export default {
	name: 'FieldOptions',
	extends: FieldBase,
	components: {
		draggable,
		Orderer
	},
	props: {
		type: {
			validator: function(value) {
				return ['checkbox', 'radio'].includes(value);
			},
			default: 'checkbox'
		},
		isOrderable: {
			type: Boolean,
			default: false
		},
		options: {
			type: Array,
			required: true
		},
		value: {
			type: [Array, Number, String, Boolean],
			required: true
		}
	},
	data() {
		return {
			/**
			 *
			 */
			localizedOptions: this.isMultilingual
				? this.options[this.localeKey]
				: this.options,

			/**
			 * This replaces the computed `currentValue` property in FieldBase. We
			 * use a custom watcher for checkboxes so that all change events are
			 * recorded. The setter function for the computed property `currentValue`
			 * is not called when an option is deselected. See:
			 * https://github.com/vuejs/vuex/issues/249
			 */
			selectedValue: this.isMultilingual
				? this.value[this.localeKey]
				: this.value
		};
	},
	computed: {
		/**
		 * Get classes for the wrapper element
		 *
		 * @return {Array}
		 */
		classes() {
			let classes = [];
			if (this.isOrderable) {
				classes.push('pkpFormField--optionsOrderable');
			}
			return classes;
		}
	},
	methods: {
		/**
		 * Move an option up in the list
		 *
		 * @param {Number} optionValue The value of the option to move up
		 */
		optionOrderUp: function(optionValue) {
			const index = this.localizedOptions.findIndex(option => {
				return option.value === optionValue;
			});
			if (!index) {
				return;
			}
			this.localizedOptions.splice(
				index - 1,
				0,
				this.localizedOptions.splice(index, 1)[0]
			);
			this.updateValueOrder();
		},

		/**
		 * Move an option down in the list
		 *
		 * @param {Number} optionValue The value of the option to move down
		 */
		optionOrderDown: function(optionValue) {
			const index = this.localizedOptions.findIndex(option => {
				return option.value === optionValue;
			});
			if (index < 0 || index >= this.localizedOptions.length - 1) {
				return;
			}
			this.localizedOptions.splice(
				index + 1,
				0,
				this.localizedOptions.splice(index, 1)[0]
			);
			this.updateValueOrder();
		},

		/**
		 * Update the order of selected values when the order of options is changed
		 */
		updateValueOrder() {
			this.selectedValue = this.localizedOptions
				.filter(option => this.selectedValue.includes(option.value))
				.map(option => option.value);
		}
	},
	watch: {
		/**
		 * Sync the selectedValue to the value if it is changed programatically
		 */
		value(newVal, oldVal) {
			if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
				return;
			}
			this.selectedValue = this.isMultilingual
				? this.value[this.localeKey]
				: this.value;
		},

		/**
		 * Whenever the selected value changes, emit an event to update the value of
		 * this field in the form component.
		 */
		selectedValue: function(newVal, oldVal) {
			if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
				return;
			}
			if (this.isOrderable) {
				newVal = this.localizedOptions
					.filter(option => newVal.includes(option.value))
					.map(option => option.value);
			}
			this.$emit('change', this.name, 'value', newVal, this.localeKey);
		},

		/**
		 * Whenever the options change, override the localized options with them
		 */
		options: function(newVal) {
			this.localizedOptions = this.isMultilingual
				? newVal[this.localeKey]
				: newVal;
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--options {
	margin: 0;
	padding: 0.5rem 1rem 1rem;
	border: @bg-border;
	border-radius: @radius;
}

.pkpFormField--options__legend {
	padding: 0 0.5rem;
	font-weight: @bold;
}

.pkpFormField--options__description {
	margin-bottom: 1rem;
}

.pkpFormField--options__option {
	position: relative;
	display: block;
	padding-left: 1.5rem;
	font-size: @font-sml;
	line-height: 1.8em;
	cursor: pointer;

	+ .pkpFormField--options__option {
		margin-top: 0.5rem;
	}
}

.pkpFormField--options__input {
	position: absolute;
	top: 0.9em;
	left: 0;
	transform: translateY(-50%);

	&:focus {
		outline: 2px solid @primary;
	}
}

.pkpFormField--options .multilingualProgress {
	margin-top: 1rem;
}

.pkpFormField--options .pkpFieldError {
	margin-top: 0;
	margin-bottom: 1rem;

	&:before {
		display: none;
	}
}

// Adjust when options can be ordered
.pkpFormField--optionsOrderable {
	.pkpFormField--options__option {
		position: relative;
		padding: 0.5em 0.5em 0.5em 6em;
		border: @bg-border-light;
	}

	.pkpFormField--options__input {
		position: absolute;
		top: 1.5em;
		left: 4em;
		transform: translateY(-50%);
	}
}
</style>
