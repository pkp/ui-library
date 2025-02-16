<template>
	<div
		class="pkpFormField pkpAutosuggest"
		:class="{
			'pkpAutosuggest--disabled': isDisabled,
			'pkpAutosuggest--rtl': isRTL,
		}"
	>
		<div v-if="!isLabelInline" ref="heading" class="pkpFormField__heading">
			<FormFieldLabel
				:control-id="controlId"
				:label="label"
				:locale-label="localeLabel"
				:is-required="isRequired"
				:required-label="t('common.required')"
				:multilingual-label="multilingualLabel"
				class="align-middle"
			/>
			<Tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				:id="describedByTooltipId"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
			<HelpButton
				v-if="helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="t('help.help')"
			/>
		</div>
		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description"
		/>
		<div class="pkpFormField__control pkpAutosuggest__control">
			<div
				:id="describedBySelectedId"
				ref="values"
				class="pkpAutosuggest__inputWrapper pkpFormField__input"
				:class="{
					'pkpAutosuggest__inputWrapper--multilingual':
						isMultilingual && locales.length > 1,
					'pkpAutosuggest__inputWrapper--focus': inputFocused,
				}"
				@click="setFocusToInput"
			>
				<!-- Begin Heading part repeated for inline scenario -->
				<div v-if="isLabelInline" ref="heading" class="pkpFormField__heading">
					<FormFieldLabel
						:control-id="controlId"
						:label="label"
						:locale-label="localeLabel"
						:is-required="isRequired"
						:required-label="t('common.required')"
						:multilingual-label="multilingualLabel"
					/>
					<Tooltip
						v-if="tooltip"
						aria-hidden="true"
						:tooltip="tooltip"
						label=""
					/>
					<span
						v-if="tooltip"
						:id="describedByTooltipId"
						v-strip-unsafe-html="tooltip"
						class="-screenReader"
					/>
					<HelpButton
						v-if="helpTopic"
						:id="describedByHelpId"
						:topic="helpTopic"
						:section="helpSection"
						:label="t('help.help')"
					/>
				</div>
				<!-- End Heading part repeated for inline scenario -->
				<Autosuggest
					v-bind="autoSuggestProps"
					ref="inputRef"
					v-model:inputValue="inputValue"
					@select-suggestion="selectSuggestion"
					@deselect="deselect"
					@focus-changed="changeFocus"
				>
					<template v-if="$slots['input-slot']" #input-slot>
						<slot name="input-slot"></slot>
					</template>
					<template v-if="$slots.option" #option="{suggestion}">
						<slot name="option" :suggestion="suggestion"></slot>
					</template>
				</Autosuggest>
				<span class="pkpAutosuggest__endslot">
					<slot name="end"></slot>
				</span>
			</div>
			<MultilingualProgress
				v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
			/>
			<FieldError
				v-if="errors && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import Autosuggest from './Autosuggest.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';

import ajaxError from '@/mixins/ajaxError';
import debounce from 'debounce';

export default {
	name: 'FieldBaseAutosuggest',
	components: {
		FormFieldLabel,
		Tooltip,
		HelpButton,
		FieldError,
		MultilingualProgress,
		Autosuggest,
	},
	extends: FieldBase,
	mixins: [ajaxError],
	props: {
		/** A URL where suggestions can be retrieved. Suggestions are expected to be returned in a flat array. */
		apiUrl: {
			type: String,
			default() {
				return '';
			},
		},
		/** A text label for the button to remove a selection. This must be included to be compatible with assistive technology. */
		deselectLabel: {
			type: String,
			required: true,
		},
		/** Whether the input field should be disabled.  */
		isDisabled: {
			type: Boolean,
			default() {
				return false;
			},
		},
		/** When `true`, the label for this field will be shown inline instead of above the input field. See usage guidance below. */
		isLabelInline: {
			type: Boolean,
			default() {
				return false;
			},
		},
		/** Any query params that should be applied when getting suggestions from the API. */
		getParams: {
			type: Object,
			default() {
				return {};
			},
		},
		/** The currently selected options for this field. These should be objects with `value` and `label` keys. */
		selected: {
			type: [Array, Object],
			default(props) {
				return props.isMultilingual ? {} : [];
			},
		},
		/** A text label that proceeds the selected values. This must be included to be compatible with assistive technology. */
		selectedLabel: {
			type: String,
			required: true,
		},
		/** If the combobox should allow multiple options to be selected */
		isMultiple: {
			type: Boolean,
			default: () => true,
		},
		/** If custom items can be selected */
		allowCustom: {
			type: Boolean,
			default: () => false,
		},
	},
	data() {
		return {
			inputValue: '',
			inputFocused: false,
			suggestions: [],
		};
	},
	computed: {
		/**
		 * A unique id for the autosuggest component
		 *
		 * @return {String}
		 */
		autosuggestId() {
			return this.compileId('autosuggest');
		},

		/**
		 * The selected items for this component. This gets locale-specific
		 * selections if this is a multilingual component
		 */
		currentSelected() {
			return this.isMultilingual
				? this.selected[this.localeKey]
				: this.selected;
		},

		/**
		 * A unique id for the field's description
		 *
		 * @return {String}
		 */
		describedBySelectedId() {
			return this.compileId('selected');
		},

		/**
		 * IDs of the elements which describe this field.
		 *
		 * This is used in the aria-describedby attribute for accessibility.
		 *
		 * @return {String}
		 */
		describedByIds() {
			return (
				this.describedBySelectedId +
				' ' +
				FieldBase.computed.describedByIds.apply(this)
			);
		},

		/**
		 * Is this field in a right-to-left language
		 */
		isRTL() {
			var direction = document.body.getAttribute('dir');
			return direction === 'rtl';
		},
		autoSuggestProps() {
			return {
				id: this.autosuggestId,
				suggestions: this.suggestions,
				selectedLabel: this.selectedLabel,
				currentSelected: this.currentSelected,
				isDisabled: this.isDisabled,
				inputId: this.controlId,
				describedBy: this.describedByIds,
				allowCustom: this.allowCustom,
			};
		},
	},
	watch: {
		inputValue(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.getSuggestions();
		},
	},
	mounted() {
		// Inline labels can not be used with multilingual fields
		if (this.isMultilingual && this.isLabelInline) {
			throw new Error(
				'An inline label can not be used with a multilingual autosuggest field. This error encountered in the field ' +
					this.name,
			);
		}
	},
	methods: {
		/**
		 * Remove an item from the selected list
		 *
		 * @param {Object} itemToRemove
		 */
		deselect(itemToRemove) {
			let newSelected = [...this.currentSelected];
			newSelected.splice(
				newSelected.findIndex((item) => item.value === itemToRemove.value),
				1,
			);
			this.setSelected(newSelected);
		},

		/**
		 * Move focus to the input field
		 */
		setFocusToInput() {
			if (this.isDisabled) {
				return;
			}

			this.$refs.inputRef.handleFocus(true);
		},

		/**
		 * Change the input focus state
		 */
		changeFocus(state) {
			this.inputFocused = state;
		},

		/**
		 * Get suggestions from the API url
		 */
		getSuggestions: debounce(function () {
			if (!this.inputValue) {
				this.suggestions = [];
				return;
			}
			var self = this;
			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				data: {
					...this.getParams,
					searchPhrase: this.inputValue,
				},
				error(r) {
					self.ajaxErrorCallback(r);
				},
				success(r) {
					self.setSuggestions(r.items);
				},
			});
		}, 250),

		/**
		 * Add a suggested item to the list of selected items
		 *
		 * This method may be called without a null item argument
		 * when the user types into the field and hits enter. In
		 * such cases, select the first autosuggestion result if
		 * one exists
		 *
		 * @param {Object|null} item The item that was selected
		 */
		select(item) {
			if (!item) {
				if (!this.inputValue || !this.suggestions.length) {
					return;
				}
				item = this.suggestions[0];
			}
			this.setSelected([...this.currentSelected, item]);
			this.inputValue = '';
		},

		/**
		 * Respond to selected events from vue-autosuggest
		 *
		 * This wrapper passes the selected item to the select method.
		 *
		 * @param {Object|null} suggestion
		 */
		selectSuggestion(suggestion) {
			this.select(suggestion ? suggestion : null);
		},

		/**
		 * Emit events to change the selected items and the field's value
		 */
		setSelected(selected) {
			this.$emit('change', this.name, 'selected', selected, this.localeKey);
			this.$emit(
				'change',
				this.name,
				'value',
				selected.map((s) => s.value),
				this.localeKey,
			);
		},

		/**
		 * This must be implemented in a component that extends
		 * this component
		 *
		 * @param {Array} newItems
		 */
		setSuggestions(newItems) {
			throw new Error(
				'The setSuggestions method must be implemented in any component that extends FieldBaseAutosuggest.',
			);
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpAutosuggest {
	position: relative;
}

.pkpAutosuggest__control {
	width: 100%;
}

.pkpAutosuggest__inputWrapper {
	display: flex;
}

// Copy of .pkpFormField:focus
.pkpAutosuggest__inputWrapper--focus {
	border-color: @primary;
	box-shadow: inset 3px 0 0 @primary;
}

.pkpAutosuggest__inputWrapper {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	height: auto;
	padding-top: 0.25rem;
	padding-bottom: 0.25rem;
}

.pkpAutosuggest__inputWrapper--multilingual {
	padding-left: 3rem;
}

.pkpAutosuggest .multilingualProgress {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;

	button {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 2.5rem;
		border-right: @bg-border;

		&:focus {
			outline: 0;
			border-color: @primary;
			box-shadow: inset 0 -3px 0 @primary;

			.fa {
				color: @primary;
			}
		}
	}

	.fa {
		position: absolute;
		top: -1px; // vertically center with text
		left: 0;
		right: 0;
		padding: 0.5rem;
	}
}

.pkpAutosuggest__inputWrapper:hover + .multilingualProgress button {
	border-color: @shade;
}

.pkpAutosuggest__inputWrapper--focus + .multilingualProgress button {
	border-color: @primary;
}

// Disabled input field
.pkpAutosuggest--disabled {
	.pkpBadge {
		border-color: @bg-border-color;
		padding-right: 1em;
	}

	// Copy of .pkpFormField:disabled
	.pkpAutosuggest__inputWrapper {
		cursor: not-allowed;

		&:hover {
			border-color: @bg-border-color;
		}
	}
}

// Inline label
.pkpAutosuggest__control {
	.pkpFormField__heading {
		margin-inline-end: 0.5rem;
		margin-inline-start: -0.5rem;
	}
}

.pkpAutosuggest__endslot {
	margin-inline-start: auto;
}

[dir='rtl'] {
	.pkpAutosuggest--inline {
		.pkpFormField__heading {
			left: auto;
			right: 0;
		}
	}
	.pkpAutosuggest__inputWrapper--focus {
		box-shadow: inset -3px 0 0 @primary;
	}
}
</style>
