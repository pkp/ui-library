<template>
	<div class="pkpFormField__control">
		<!-- Checkbon as button select/unselect switch -->
		<div v-if="viewAsButton" class="mb-2 mt-2 flex items-center">
			<input
				v-model="selectedValue"
				type="checkbox"
				class="hidden"
				:name="localizedName"
				:aria-describedby="describedByIds"
				:aria-invalid="errors && errors.length"
			/>
			<label
				class="rounded-xl border-blue-300 text-blue-600 peer-checked:bg-gray-400 peer-checked:text-blue-700 peer-checked:border-blue-600 min-w-20 max-w-40 cursor-pointer select-none border-2 px-4 py-2 font-bold transition-colors duration-200 ease-in-out"
				@click="selectedValue = !selectedValue"
				v-html="labelText"
			></label>
			<div
				v-if="isPrimaryLocale && description"
				:id="describedByDescriptionId"
				class="text-lg text-blue-900 dark:text-gray-900 ml-6 py-4 font-normal"
				v-html="description"
			></div>
		</div>

		<!-- Simple checkbox -->
		<div v-else class="mb-2 mt-2 flex">
			<div class="flex h-5 items-center">
				<input
					:id="controlId"
					v-model="selectedValue"
					class="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 cursor-pointer rounded focus:ring-2"
					type="checkbox"
					:disabled="disable"
					:checked="selectedValue"
					:name="localizedName"
					:aria-describedby="describedByIds"
					:aria-invalid="errors && errors.length"
				/>
			</div>
			<div class="text-sm ms-2 leading-snug">
				<label
					class="text-gray-900 dark:text-gray-300 cursor-pointer font-medium"
					:for="controlId"
					v-html="labelText"
				></label>
				<div
					v-if="isPrimaryLocale && description"
					:id="describedByDescriptionId"
					class="text-xs text-gray-500 dark:text-gray-300 font-normal"
					v-html="description"
				></div>
			</div>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';

export default {
	name: 'FieldCheckbox',
	extends: FieldBase,
	props: {
		/** The disable state of checkbox */
		disable: {
			type: Boolean,
			required: false,
			default: false,
		},

		/** The current value for this field. */
		value: {
			type: Boolean,
			required: false,
			default: false,
		},

		/** Should show the checkbox as a button. */
		viewAsButton: {
			type: Boolean,
			default: false,
		},

		/** The default label */
		label: {
			type: String,
			required: false,
			default: null,
		},

		/** Label to show when the checkbox is selected */
		checkedLabel: {
			type: String,
			required: false,
			default: '',
		},

		/** Label to show when the checkbox is unselected */
		uncheckedLabel: {
			type: String,
			required: false,
			default: '',
		},
	},
	data() {
		return {
			labelText: this.label,

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
	computed: {},
	watch: {
		/**
		 * Sync the selectedValue to the value if it is changed programatically
		 */
		value: function () {
			this.selectedValue = this.isMultilingual
				? this.value[this.localeKey]
				: this.value;
		},

		/**
		 * When selected value changes, update the label text
		 */
		selectedValue: {
			immediate: true,
			handler: function (newVal) {
				if (newVal && this.checkedLabel.trim().length !== 0) {
					this.labelText = this.checkedLabel;
				}

				if (!newVal && this.uncheckedLabel.trim().length !== 0) {
					this.labelText = this.uncheckedLabel;
				}
			},
		},
	},
	methods: {},
};
</script>

<style lang="less">
@import '../../../styles/_import';
</style>
