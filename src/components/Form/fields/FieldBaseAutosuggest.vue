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
			/>
			<Tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				:id="describedByTooltipId"
				class="-screenReader"
				v-html="tooltip"
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
			class="pkpFormField__description"
			v-html="description"
		/>
		<div class="pkpFormField__control pkpAutosuggest__control">
			<div
				:id="describedBySelectedId"
				ref="values"
				class="pkpAutosuggest__inputWrapper pkpFormField__input"
				:class="{
					'pkpAutosuggest__inputWrapper--multilingual':
						isMultilingual && locales.length > 1,
					'pkpAutosuggest__inputWrapper--focus': isFocused,
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
						class="-screenReader"
						v-html="tooltip"
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
				<span class="-screenReader">{{ selectedLabel }}</span>
				<span v-if="!currentValue.length" class="-screenReader">
					{{ t('common.none') }}
				</span>
				<PkpBadge
					v-for="item in currentSelected"
					v-else
					:key="item.value"
					class="pkpAutosuggest__selection"
				>
					{{ item.label }}
					<button
						v-if="!isDisabled"
						class="pkpAutosuggest__deselect"
						@click.stop.prevent="deselect(item)"
					>
						<Icon icon="times" />
						<span class="-screenReader">
							{{ deselectLabel.replace('{$item}', item.label) }}
						</span>
					</button>
				</PkpBadge>
				<Combobox
					v-if="!isDisabled"
					:id="autosuggestId"
					:key="autosuggestId"
					:model-value="null"
					class="pkpAutosuggest__autosuggester"
					as="div"
					@update:modelValue="selectSuggestion"
				>
					<ComboboxInput
						ref="autosuggestInput"
						class="pkpAutosuggest__input"
						v-bind="inputProps"
						@change="inputValue = $event.target.value.trim()"
						@focus="() => (isFocused = true)"
						@blur="() => (isFocused = false)"
					/>
					<ComboboxOptions
						v-if="suggestions.length || (allowCustom && inputValue?.length)"
						class="autosuggest__results-container autosuggest__results"
					>
						<ComboboxOption
							v-if="
								allowCustom &&
								inputValue?.length &&
								!suggestions.includes(inputValue)
							"
							v-slot="{active}"
							as="template"
						>
							<li
								class="autosuggest__results-item"
								:class="active && 'autosuggest__results-item--highlighted'"
							>
								{{ inputValue }}
							</li>
						</ComboboxOption>
						<ComboboxOption
							v-for="suggestion in suggestions"
							:key="suggestion.value"
							v-slot="{active}"
							:value="suggestion"
							as="template"
						>
							<li
								class="autosuggest__results-item"
								:class="active && 'autosuggest__results-item--highlighted'"
							>
								{{ suggestion.label }}
							</li>
						</ComboboxOption>
					</ComboboxOptions>
				</Combobox>
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
import PkpBadge from '@/components/Badge/Badge.vue';
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import FieldError from '@/components/Form/FieldError.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import Icon from '@/components/Icon/Icon.vue';

import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from '@headlessui/vue';
import ajaxError from '@/mixins/ajaxError';
import debounce from 'debounce';

export default {
	name: 'FieldBaseAutosuggest',
	components: {
		PkpBadge,
		Combobox,
		ComboboxInput,
		ComboboxOption,
		ComboboxOptions,
		FormFieldLabel,
		Tooltip,
		HelpButton,
		FieldError,
		Icon,
		MultilingualProgress,
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
	},
	data() {
		return {
			inputValue: '',
			isFocused: false,
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
		 * Props to pass to the input field
		 *
		 * @return {Object}
		 */
		inputProps() {
			let props = {
				'aria-describedby': this.describedByIds,
				class: 'pkpAutosuggest__input',
				id: this.controlId,
				name: this.name,
			};
			if (this.isDisabled) {
				props.disabled = 'disabled';
			}
			return props;
		},

		/**
		 * Is this field in a right-to-left language
		 */
		isRTL() {
			var direction = document.body.getAttribute('dir');
			return direction === 'rtl';
		},
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

			this.$refs.autosuggestInput.$el.focus();
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

// Space between items in the input wrapper
.pkpAutosuggest__selection,
.pkpAutosuggest__autosuggester {
	margin-top: 0.125rem;
	margin-bottom: 0.125rem;
	margin-inline-end: 0.25rem;
}

.pkpAutosuggest__selection {
	position: relative;
	padding-right: 2.5em;
}

.pkpAutosuggest__deselect {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 2em;
	padding: 0;
	background: transparent;
	border: 1px solid transparent;
	border-left-color: @bg-border-color-light;
	border-top-right-radius: 1.2em; // matches radius on button in Badge.vue
	border-bottom-right-radius: 1.2em;
	color: @no;

	.fa {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin-left: -1px;
	}

	&:hover,
	&:focus {
		outline: 0;
		border-color: @no;
		background: @no;
		color: #fff;
	}
}

.pkpAutosuggest__autosuggester {
	position: relative;
	line-height: 1.6rem; // prevent jank when value is added or removed
	flex-grow: 1;
}

.pkpAutosuggest__input {
	border: none;
	width: 100%;
	&:focus {
		outline: none;
	}
}

.autosuggest__results-container {
	position: absolute;
	top: 100%;
	margin-top: -2px;
	width: 100%;
	max-width: 100%;
	min-width: 20rem;
	z-index: 9999;
}

.autosuggest__results {
	border: 1px solid @primary;
	border-bottom-right-radius: @radius;
	border-bottom-left-radius: @radius;
	background: @lift;
	box-shadow: 0 0.75rem 0.75rem rgba(0, 0, 0, 0.2);
	font-size: @font-sml;

	&:after {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		height: 100%;
		width: 3px;
		background: @primary;
	}

	margin: 0;
	padding: 0;
	list-style: none;

	.autosuggest__results-item {
		position: relative;
		padding: 0.5rem 1rem;
		line-height: 1.5em;

		&:before {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
			width: 3px;
			height: 100%;
			background: @primary;
			transition: width 0.3s;
		}
	}

	.autosuggest__results-item--highlighted {
		background: @bg;
	}
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
