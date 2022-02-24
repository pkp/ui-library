<template>
	<div
		class="pkpFormField pkpAutosuggest"
		:class="{
			'pkpAutosuggest--disabled': isDisabled,
			'pkpAutosuggest--inline': isLabelInline,
			'pkpAutosuggest--rtl': isRTL
		}"
	>
		<div class="pkpFormField__heading" ref="heading">
			<form-field-label
				:controlId="controlId"
				:label="label"
				:localeLabel="localeLabel"
				:isRequired="isRequired"
				:requiredLabel="__('common.required')"
				:multilingualLabel="multilingualLabel"
			/>
			<tooltip v-if="tooltip" aria-hidden="true" :tooltip="tooltip" label="" />
			<span
				v-if="tooltip"
				class="-screenReader"
				:id="describedByTooltipId"
				v-html="tooltip"
			/>
			<help-button
				v-if="helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="__('help.help')"
			/>
		</div>
		<div
			v-if="isPrimaryLocale && description"
			class="pkpFormField__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div class="pkpFormField__control pkpAutosuggest__control">
			<div
				class="pkpAutosuggest__inputWrapper pkpFormField__input"
				:class="{
					'pkpAutosuggest__inputWrapper--multilingual':
						isMultilingual && locales.length > 1,
					'pkpAutosuggest__inputWrapper--focus': isFocused
				}"
				ref="values"
				:id="describedBySelectedId"
				@click="setFocusToInput"
			>
				<span class="-screenReader">{{ selectedLabel }}</span>
				<span v-if="!currentValue.length" class="-screenReader">
					{{ __('common.none') }}
				</span>
				<pkp-badge
					v-else
					v-for="item in currentSelected"
					:key="item.value"
					class="pkpAutosuggest__selection"
				>
					{{ item.label }}
					<button
						v-if="!isDisabled"
						class="pkpAutosuggest__deselect"
						@click.stop.prevent="deselect(item)"
					>
						<icon icon="times" />
						<span class="-screenReader">
							{{ deselectLabel.replace('{$item}', item.label) }}
						</span>
					</button>
				</pkp-badge>
				<vue-autosuggest
					v-if="!isDisabled"
					v-model="inputValue"
					ref="autosuggest"
					class="pkpAutosuggest__autosuggester"
					v-bind="autosuggestOptions"
					@selected="selectSuggestion"
					@focus="() => (isFocused = true)"
					@blur="() => (isFocused = false)"
				/>
			</div>
			<multilingual-progress
				v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
			/>
			<field-error
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
import {VueAutosuggest} from 'vue-autosuggest';
import ajaxError from '@/mixins/ajaxError';
import debounce from 'debounce';
import elementResizeEvent from 'element-resize-event';

export default {
	name: 'FieldBaseAutosuggest',
	extends: FieldBase,
	mixins: [ajaxError],
	components: {
		PkpBadge,
		VueAutosuggest
	},
	props: {
		apiUrl: {
			type: String,
			default() {
				return '';
			}
		},
		deselectLabel: {
			type: String,
			required: true
		},
		isDisabled: {
			type: Boolean,
			default() {
				return false;
			}
		},
		isLabelInline: {
			type: Boolean,
			default() {
				return false;
			}
		},
		getParams: {
			type: Object,
			default() {
				return {};
			}
		},
		selected: {
			type: [Array, Object],
			default() {
				return this.isMultilingual ? {} : [];
			}
		},
		selectedLabel: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			inputValue: '',
			isFocused: false,
			suggestions: []
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
		 * Options to pass to the vue-autosuggest component
		 *
		 * @return {Object}
		 */
		autosuggestOptions() {
			return {
				id: this.autosuggestId,
				inputProps: this.inputProps,
				key: this.autosuggestId,
				suggestions: [{data: this.suggestions}],
				getSuggestionValue: suggestion => suggestion.item.label,
				renderSuggestion: suggestion => suggestion.item.label
			};
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
				name: this.name
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
			return $.pkp.app.rtlLocales.includes(this.localeKey);
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
				newSelected.findIndex(item => item.value === itemToRemove.value),
				1
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
			this.$refs.autosuggest.$el.querySelector('#' + this.controlId).focus();
		},

		/**
		 * Get suggestions from the API url
		 */
		getSuggestions: debounce(function() {
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
					searchPhrase: this.inputValue
				},
				error(r) {
					self.ajaxErrorCallback(r);
				},
				success(r) {
					self.setSuggestions(r.items);
				}
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
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.$nextTick(() =>
						this.$el.querySelector('#' + this.controlId).focus()
					);
				});
			});
		},

		/**
		 * Respond to selected events from vue-autosuggest
		 *
		 * This wrapper passes the selected item to the select method.
		 *
		 * @param {Object|null} suggestion
		 */
		selectSuggestion(suggestion) {
			this.select(suggestion ? suggestion.item : null);
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
				selected.map(s => s.value),
				this.localeKey
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
				'The setSuggestions method must be implemented in any component that extends FieldBaseAutosuggest.'
			);
		},

		/**
		 * Update the padding if the label is inline
		 */
		updateInlineLabelPadding() {
			if (!this.isLabelInline) {
				return;
			}
			let value = this.$refs.heading.offsetWidth + 'px';
			if (this.isRTL) {
				this.$refs.values.style.paddingRight = value;
			} else {
				this.$refs.values.style.paddingLeft = value;
			}
		},

		/**
		 * Update the width of the input field
		 *
		 * The input field should expand to fill the input area after the
		 * values have been positioned. The input field should take up any
		 * remaining width or, if there is less than 172px, move to the
		 * next line and take the full width.
		 */
		updateInputWidth() {
			if (this.isDisabled) {
				return;
			}

			// Use the full width when there are no values
			if (!this.currentValue.length) {
				this.$refs.autosuggest.$el.style.width = '100%';
			} else {
				// Otherwise use the remaining width based on the
				// bottom right corner of the last value (or bottom
				// left corner for RTL languages)
				const containerStyle = window.getComputedStyle(this.$refs.values);
				const containerLeftPadding = parseFloat(
					containerStyle.getPropertyValue('padding-left')
				);
				const containerRightPadding = parseFloat(
					containerStyle.getPropertyValue('padding-right')
				);
				const containerWidth =
					parseFloat(containerStyle.getPropertyValue('width')) -
					containerLeftPadding -
					containerRightPadding;
				const valueEls = this.$refs.values.querySelectorAll(
					'.pkpAutosuggest__selection'
				);
				const lastValueEl = valueEls[valueEls.length - 1];
				// Right-to-left languages need to calculate distance from the right edge
				const lastPixelPosition = this.isRTL
					? containerWidth - (lastValueEl.offsetLeft - containerRightPadding)
					: lastValueEl.offsetLeft -
					  containerLeftPadding +
					  lastValueEl.offsetWidth;
				// remainingWidth = total available space - width of values
				const remainingWidth = containerWidth - lastPixelPosition;
				if (remainingWidth < 172) {
					this.$refs.autosuggest.$el.style.width = '100%';
				} else {
					// 32 = 16px padding + extra space for the browser's scroll bar.
					// when the suggestion list is shown/hidden, it can cause the whole
					// page height to exceed the viewport, which means the browser's
					// scroll bar pops in and out of view. this causes the input field
					// width to expand/contract. The extra space allows this to happen
					// without shifting the input field to the next line
					this.$refs.autosuggest.$el.style.width = remainingWidth - 32 + 'px';
				}
			}
		}
	},
	watch: {
		currentValue(newVal, oldVal) {
			this.$nextTick(() => this.updateInputWidth());
		},
		inputValue(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}
			this.getSuggestions();
		}
	},
	mounted() {
		this.updateInlineLabelPadding();
		this.updateInputWidth();
		elementResizeEvent(
			this.$refs.values,
			debounce(() => {
				this.updateInlineLabelPadding();
				this.updateInputWidth();
			}, 100)
		);

		// Inline labels can not be used with multilingual fields
		if (this.isMultilingual && this.isLabelInline) {
			throw new Error(
				'An inline label can not be used with a multilingual autosuggest field. This error encountered in the field ' +
					this.name
			);
		}
	},
	beforeDestroy() {
		elementResizeEvent.unbind(this.$refs.values);
	}
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
	margin-right: 0.25rem;
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
	width: 100%;
}

.pkpAutosuggest__input {
	width: 100%;
	border: none;

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

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

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
.pkpAutosuggest--inline {
	.pkpFormField__heading {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0.5rem;
		line-height: 1.5rem;
		z-index: 999;
		font-size: @font-sml;
	}

	// Right-to-left languages
	&.pkpAutosuggest--rtl {
		.pkpFormField__heading {
			left: auto;
			right: 0.5rem;
		}
	}
}
</style>
