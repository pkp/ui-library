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
				<span class="-screenReader">{{ i18n.required }}</span>
			</span>
			<tooltip v-if="isPrimaryLocale && tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span v-if="isPrimaryLocale && tooltip" class="-screenReader" :id="describedByTooltipId" v-html="tooltip" />
			<help-button v-if="isPrimaryLocale && helpTopic" :id="describedByHelpId" :topic="helpTopic" :section="helpSection" :label="i18n.help" />
		</legend>
		<div v-if="isPrimaryLocale && description"
			class="pkpFormField__description pkpFormField--options__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<field-error v-if="errors.length" :id="describedByErrorId" :messages="errors" />
		<div class="pkpFormField__control">
			<draggable v-model="localizedOptions" @end="updateValueOrder" :options="{disabled: !isOrderable}">
				<label v-for="option in localizedOptions" :key="option.value" class="pkpFormField--options__option">
					<input
						class="pkpFormField--options__input"
						v-model="selectedValue"
						:value="option.value"
						:type="type"
						:aria-describedby="describedByIds"
						:aria-invalid="!!errors.length"
						:disabled="option.disabled"
					/>
					<span class="pkpFormField--options__optionLabel" v-html="option.label" />
					<orderer v-if="isOrderable"
						@up="optionOrderUp"
						@down="optionOrderDown"
						:itemId="option.value"
						:itemTitle="option.label"
						:i18n="i18n"
					/>
				</label>
			</draggable>
			<multilingual-progress v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
				:i18n="i18n"
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
			type: [Array, String, Boolean],
			required: true
		}
	},
	data() {
		return {
			/**
			 *
			 */
			localizedOptions: this.isMultingual
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
		 * @return array
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
		 * @param optionValue int The value of the option to move up
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
		 * @param optionValue int The value of the option to move down
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
		 * Whenever the selected value changes, emit an event to update the value of
		 * this field in the form component.
		 */
		selectedValue: function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			if (this.isOrderable) {
				newVal = this.localizedOptions
					.filter(option => newVal.includes(option.value))
					.map(option => option.value);
			}
			this.$emit('change', {
				name: this.name,
				value: newVal,
				localeKey: this.localeKey
			});
		},

		/**
		 * Whenever the options change, override the localized options with them
		 */
		options: function(newVal) {
			this.localizedOptions = this.isMultingual
				? newVal[this.localeKey]
				: newVal;
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--options {
	padding: 0.5rem 1rem 1rem;
	border: @bg-border;
	border-radius: @radius;
}

.pkpFormField--options__legend {
	padding: 0 @half;
	font-weight: @bold;
}

.pkpFormField--options__description {
	margin-bottom: @base;
}

.pkpFormField--options__option {
	position: relative;
	display: block;
	padding-left: @base + @half;
	font-size: @font-sml;
	line-height: 1.8em;
	cursor: pointer;

	+ .pkpFormField--options__option {
		margin-top: @half;
	}
}

.pkpFormField--options__input {
	position: absolute;
	top: 0.9em;
	left: 0;
	transform: translateY(-50%);
}

.pkpFormField--options .multilingualProgress {
	margin-top: @base;
}

.pkpFormField--options .pkpFieldError {
	margin-top: 0;
	margin-bottom: @base;

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
