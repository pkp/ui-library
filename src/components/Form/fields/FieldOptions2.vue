<template>
	<div class="pkpFormField pkpFormField--options" :class="classes">
		<h2 class="pkpFormField--options__legend">
			<template v-if="localeLabel">
				<span class="aria-hidden">{{ localeLabel }}</span>
				<span class="-screenReader">{{ multilingualLabel }}</span>
			</template>
			<template v-else>
				{{ label }}
			</template>
		</h2>
		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			class="pkpFormField__description pkpFormField--options__description"
			v-html="description"
		/>
		<div class="pkpFormField__control">
			<VueDraggable
				ref="el"
				v-model="localizedOptions"
				tag="ul"
				:disabled="!isOrderable"
				@end="updateValueOrder"
			>
				<li
					v-for="option in localizedOptions"
					:key="option.value"
					class="pkpFormField--options__option"
				>
					<span
						class="pkpFormField--options__optionLabel"
						v-html="option.label"
					/>
					<orderer
						v-if="isOrderable"
						:item-id="option.value"
						:item-title="option.label"
						@up="optionOrderUp"
						@down="optionOrderDown"
					/>
				</li>
			</VueDraggable>
		</div>
		<field-error
			v-if="errors && errors.length"
			:id="describedByErrorId"
			:messages="errors"
		/>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import {VueDraggable} from 'vue-draggable-plus';
import Orderer from '@/components/Orderer/Orderer.vue';

export default {
	name: 'FieldOptions',
	components: {
		VueDraggable,
		Orderer,
	},
	extends: FieldBase,
	props: {
		/** Type of the `<input>` field. Either `checkbox` or `radio`. */
		type: {
			validator: function (value) {
				return ['checkbox', 'radio'].includes(value);
			},
			default: 'checkbox',
		},
		/** Allow the user to reorder the options. Reordering will resort the items in the `value` property.  */
		isOrderable: {
			type: Boolean,
			default: false,
		},
		/** An array of objects defining the options which can be selected. */
		options: {
			type: [Array, Object],
			required: true,
		},
		/** The current value for this field. */
		value: {
			type: [Array, Number, String, Boolean],
			required: true,
		},
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
				: this.value,
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
		},
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
		selectedValue: function (newVal, oldVal) {
			if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
				return;
			}
			if (this.isOrderable) {
				newVal = this.localizedOptions
					.filter((option) => newVal.includes(option.value))
					.map((option) => option.value);
			}
			this.$emit('change', this.name, 'value', newVal, this.localeKey);
		},

		/**
		 * Whenever the options change, override the localized options with them
		 */
		options: function (newVal) {
			this.localizedOptions = this.isMultilingual
				? newVal[this.localeKey]
				: newVal;
		},
	},
	methods: {
		/**
		 * Move an option up in the list
		 *
		 * @param {Number} optionValue The value of the option to move up
		 */
		optionOrderUp: function (optionValue) {
			const index = this.localizedOptions.findIndex((option) => {
				return option.value === optionValue;
			});
			if (!index) {
				return;
			}
			this.localizedOptions.splice(
				index - 1,
				0,
				this.localizedOptions.splice(index, 1)[0],
			);
			this.updateValueOrder();
		},

		/**
		 * Move an option down in the list
		 *
		 * @param {Number} optionValue The value of the option to move down
		 */
		optionOrderDown: function (optionValue) {
			const index = this.localizedOptions.findIndex((option) => {
				return option.value === optionValue;
			});
			if (index < 0 || index >= this.localizedOptions.length - 1) {
				return;
			}
			this.localizedOptions.splice(
				index + 1,
				0,
				this.localizedOptions.splice(index, 1)[0],
			);
			this.updateValueOrder();
		},

		/**
		 * Update the order of selected values when the order of options is changed
		 */
		updateValueOrder() {
			this.selectedValue = this.localizedOptions
				.filter((option) => this.selectedValue.includes(option.value))
				.map((option) => option.value);
		},
	},
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
	display: flex;
	align-items: flex-start;
	gap: 0.5rem;
	font-size: @font-sml;
	line-height: 1.8em;
	cursor: pointer;

	+ .pkpFormField--options__option {
		margin-top: 0.5rem;
	}
}

.pkpFormField--options__input {
	margin-top: 0.4rem; // align with first line of option text

	&:focus {
		outline: 2px solid @primary;
		outline-offset: 1px;
	}
}

.pkpFormField--options .multilingualProgress {
	margin-top: 1rem;
}

.pkpFormField--options .pkpFieldError {
	&:before {
		display: none;
	}
}

// Adjust when options can be ordered
.pkpFormField--optionsOrderable {
	.pkpFormField--options__option {
		position: relative;
		padding: 0.5rem;
		padding-inline-start: 4rem;
		padding-inline-end: 7rem;
		border: @bg-border-light;
	}
}
</style>
