<template>
	<vue-autosuggest
			class="autosuggest"
			ref="autosuggest"
			:suggestions="suggestions"
			:renderSuggestion="renderSuggestion"
			:getSuggestionValue="getSuggestionValue"
			:onSelected="onSelected"
			:inputProps="inputProps"
	/>
</template>

<script>
import { VueAutosuggest } from 'vue-autosuggest';

export default {
	name: 'ListPanelFilterAutoSuggest',
	components: {
		VueAutosuggest,
	},
	props: {
		name: {
			type: String,
			required: true,
		},
		options: {
			type: Array,
			required: true,
		},
		selected: {
			validator: function (value) {
				return typeof value === 'undefined' || Array.isArray(value);
			},
			required: true,
		},
		placeholder: {
			type: String,
		},
	},
	data: function () {
		return {
			suggestions: [],
		};
	},
	computed: {
		/**
		 * Props to pass to the <input> element. Required by autosuggest
		 *
		 * @return object
		 */
		inputProps: function () {
			return {
				id: 'autosuggest' + this.name,
				onInputChange: this.onInputChange,
				placeholder: this.placeholder,
				class: 'autosuggest__input',
			};
		},
	},
	methods: {
		/**
		 * Emit an event when an option is selected
		 *
		 * @param object val Information about the selection from vue-autosuggest
		 */
		onSelected: function (val) {
			this.suggestions = [];
			this.$refs.autosuggest.searchInput = '';
			this.$emit('select', {name: this.name, value: val});
		},

		/**
		 * Update suggestions when the user changes the input
		 *
		 * @param string newVal The updated input value
		 * @param string oldVal The last input value
		 */
		onInputChange: function (newVal, oldVal) {
			if (!newVal || newVal.length < 2) {
				this.suggestions = [];
				return;
			}

			if (newVal === oldVal) {
				return;
			}

			newVal = newVal.toLowerCase();
			let suggestions = this.options.filter((option) => {
				if (this.selected && this.selected.includes(option.val)) {
					return false;
				}
				// The value may not be a string
				let valMatch = false;
				if (typeof option.val === 'number') {
					valMatch = option.val === newVal;
				} else if (typeof option.val === 'string') {
					valMatch = option.val.toLowerCase().indexOf(newVal);
				}
				return option.title.toLowerCase().indexOf(newVal) > -1 || valMatch;
			});

			this.suggestions = [{data: suggestions}];
		},

		/**
		 * Use filter titles when displaying suggestions
		 *
		 * @param object data Info on option from vue-autosuggest
		 */
		renderSuggestion: function (data) {
			return data.item.title;
		},

		/**
		 * Show filter titles as value in input field
		 *
		 * @param object data Info on option from vue-autosuggest
		 */
		getSuggestionValue: function (data) {
			return this.renderSuggestion(data);
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.autosuggest__input {
	padding: 0 0.5em;
	width: 25em;
	max-width: 100%;
	border: @bg-border-light;
	border-radius: @radius;
	line-height: @double;

	&:hover {
		border-color: @primary;
	}

	&:focus {
		outline: 0;
		border-color: @primary;
	}
}

.autosuggest__results {
	position: absolute;
	top: 100%;
	width: 100%;
	margin-top: -1px;
	overflow-y: scroll;
	max-height: 300px;
	background: @lift;
	border: @bg-border-light;
	z-index: 999;
}

.autosuggest__results_item {
  padding: 0.5em;
	border-left: 0.25em solid transparent;
  line-height: 1.3em;
  border-bottom: @bg-border-light;
	cursor: pointer;

	&:hover,
	&:focus {
		border-left-color: @primary;
	}
}
</style>
