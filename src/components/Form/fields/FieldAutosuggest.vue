<template>
	<div class="pkpFormField pkpFormField--autosuggest">
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="controlId"
				:label="label"
				:localeLabel="localeLabel"
				:isRequired="isRequired"
				:requiredLabel="i18n.required"
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
				:label="i18n.help"
			/>
		</div>
		<div
			v-if="isPrimaryLocale && description"
			class="pkpFormField__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div
			class="pkpFormField__control pkpFormField--autosuggest__control"
			:class="{
				'pkpFormField__control--hasMultilingualIndicator':
					isMultilingual && locales.length > 1
			}"
		>
			<div
				v-if="currentPosition === 'inline'"
				class="pkpFormField--autosuggest__values pkpFormField--autosuggest__values--inline"
				:id="describedBySelectedId"
				ref="values"
			>
				<span class="-screenReader">{{ selectedLabel }}</span>
				<span v-if="!currentValue.length" class="-screenReader">
					{{ noneLabel }}
				</span>
				<pkp-badge v-else v-for="item in currentValue" :key="item">
					{{ item }}
					<button
						class="pkpFormField--autosuggest__valueButton"
						@click="deselect(item)"
					>
						<icon icon="times" />
						<span class="-screenReader">
							{{ deselectLabel.replace('{$item}', item) }}
						</span>
					</button>
				</pkp-badge>
			</div>
			<vue-autosuggest
				v-model="inputValue"
				ref="autosuggest"
				class="pkpFormField--autosuggest__autosuggest"
				:id="autosuggestId"
				:inputProps="inputProps"
				:key="autosuggestId"
				:suggestions="[{data: filteredSuggestions}]"
				@selected="select"
			/>
			<div
				v-if="currentPosition === 'below'"
				class="pkpFormField--autosuggest__values pkpFormField--autosuggest__values--below"
				:id="describedBySelectedId"
				ref="values"
			>
				<span class="-screenReader">{{ selectedLabel }}</span>
				<span v-if="!currentValue.length" class="-screenReader">
					{{ noneLabel }}
				</span>
				<pkp-badge v-else v-for="item in currentValue" :key="item">
					{{ item }}
					<button
						class="pkpFormField--autosuggest__valueButton"
						@click="deselect(item)"
					>
						<icon icon="times" />
						<span class="-screenReader">
							{{ deselectLabel.replace('{$item}', item) }}
						</span>
					</button>
				</pkp-badge>
			</div>
			<multilingual-progress
				v-if="isMultilingual && locales.length > 1"
				:id="multilingualProgressId"
				:count="multilingualFieldsCompleted"
				:total="locales.length"
				:i18n="i18n"
			/>
			<field-error
				v-if="errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpBadge from '@/components/Badge/Badge.vue';
import {VueAutosuggest} from 'vue-autosuggest';
import debounce from 'debounce';
import elementResizeEvent from 'element-resize-event';

export default {
	name: 'FieldAutosuggest',
	extends: FieldBase,
	components: {
		Icon,
		PkpBadge,
		VueAutosuggest
	},
	props: {
		deselectLabel: {
			type: String,
			required: true
		},
		initialPosition: {
			type: String,
			default() {
				return 'inline';
			},
			validator: function(value) {
				return ['inline', 'below'].includes(value);
			}
		},
		noneLabel: {
			type: String,
			required: true
		},
		selectedLabel: {
			type: String,
			required: true
		},
		suggestionsUrl: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {
			currentPosition: this.initialPosition,
			inputValue: '',
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
		 * A filtered set of suggestions matching the current input
		 *
		 * @return {Array}
		 */
		filteredSuggestions() {
			if (!this.inputValue) {
				return [];
			}

			// Escape the input for regex
			// See: https://stackoverflow.com/a/3561711/1723499
			const regex = new RegExp(
				this.inputValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),
				'gi'
			);
			const suggestions = this.suggestions.filter(
				suggestion =>
					!this.inputValue.includes(suggestion) && suggestion.match(regex)
			);
			if (!suggestions.find(suggestion => this.inputValue === suggestion)) {
				suggestions.unshift(this.inputValue);
			}
			return suggestions;
		},

		/**
		 * Props to pass to the input field
		 *
		 * @return {Object}
		 */
		inputProps() {
			return {
				'aria-describedby': this.describedByIds,
				class: 'pkpFormField__input pkpFormField--autosuggest__input',
				id: this.controlId,
				name: this.name
			};
		}
	},
	methods: {
		/**
		 * Remove an item from the selected list
		 *
		 * @param {Object} option
		 */
		deselect(option) {
			this.currentValue.splice(
				this.currentValue.findIndex(item => item === option),
				1
			);
		},

		/**
		 * Get suggestions from a remote URL
		 */
		getSuggestions() {
			var self = this;
			$.ajax({
				url: this.suggestionsUrl,
				type: 'GET',
				error(r) {
					self.ajaxErrorCallback(r);
				},
				success(r) {
					self.suggestions = r;
				}
			});
		},

		/**
		 * An item is selected
		 *
		 * @param {Object|null} option An object representing the value or null
		 */
		select(option) {
			// When hitting enter in the input field, this method will be fired
			// but no option will be set. In such cases, use the input value
			if (!option) {
				const inputEl = this.$refs.autosuggest.$el.querySelector(
					'#' + this.controlId
				);
				if (inputEl.value) {
					this.currentValue.push(inputEl.value);
				}
			} else {
				this.currentValue.push(option.item);
			}
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
		 * Update the padding on the input field when selections
		 * are changed
		 */
		updateInputPadding() {
			const baseInputLeftPadding =
				this.isMultilingual && this.locales.length > 1 ? 48 : 16; // 16px = 1rem
			if (!this.currentValue.length) {
				const inputEl = this.$refs.autosuggest.$el.querySelector(
					'#' + this.controlId
				);
				this.currentPosition = 'inline';
				inputEl.style.paddingLeft = baseInputLeftPadding + 'px';
			} else {
				const inputEl = this.$refs.autosuggest.$el.querySelector(
					'#' + this.controlId
				);

				// Identify the left offset of the values so that it can be used when calculating
				// the remaining with. The remaining width should always be calculated as if the
				// values are inline, to prevent flashing where it jumps between inline and below
				const offsetLeft =
					this.isMultilingual && this.locales.length > 1 ? 48 : 16;
				const valuesWidth = offsetLeft + this.$refs.values.offsetWidth;

				// This may not be accurate if the user has adjusted the zoom level. One line can
				// appear taller than 50px. In such cases, the values are still easy to view
				// when below the input, so this should be a graceful handling of it.
				const isMaybeMultiline = this.$refs.values.offsetHeight > 50;

				if (isMaybeMultiline || inputEl.offsetWidth - valuesWidth < 140) {
					this.currentPosition = 'below';
					inputEl.style.paddingLeft = baseInputLeftPadding + 'px';
				} else {
					this.currentPosition = 'inline';
					inputEl.style.paddingLeft = valuesWidth + 'px';
				}
			}
		}
	},
	watch: {
		currentPosition(newVal, oldVal) {
			if (newVal === oldVal || newVal != 'below') {
				return;
			}
		},
		currentValue(newVal, oldVal) {
			this.$nextTick(() => this.updateInputPadding());
		}
	},
	mounted() {
		/**
		 * Shift the input cursor to make room for any pre-existing selections
		 * and call this method whenever the element is resized
		 */
		this.updateInputPadding();
		elementResizeEvent(
			this.$refs.autosuggest.$el,
			debounce(() => this.updateInputPadding(), 100)
		);

		/**
		 * Load suggestions from a URL or from props
		 *
		 * Use $nextTick() so it fires after other requests when the page is loaded
		 */
		if (this.suggestionsUrl) {
			this.$nextTick(this.getSuggestions);
		}
	},
	beforeDestroy() {
		elementResizeEvent.unbind(this.$refs.autosuggest.$el);
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--autosuggest__values {
	display: inline-block;
	z-index: 999; // must remain less than z-index of .autosuggest__results-container

	.pkpBadge {
		position: relative;
		margin-right: 0.25rem;
		padding-right: 2.5em;
	}
}

.pkpFormField--autosuggest__values--inline {
	position: absolute;
	left: 0.5rem;
	top: 50%;
	transform: translateY(-50%);
	line-height: 1; // Remove extra vertical space around badges
}

.pkpFormField--autosuggest__valueButton {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	width: 2em;
	padding: 0;
	background: transparent;
	border: 1px solid transparent;
	border-left-color: @bg-border-color-light;
	border-top-right-radius: 50%;
	border-bottom-right-radius: 50%;
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

.pkpFormField--autosuggest__autosuggest {
	position: relative;
}

.pkpFormField--autosuggest__input {
	width: 100%;
}

.autosuggest__results-container {
	display: none;
	position: absolute;
	top: 100%;
	margin-top: -2px;
	width: 100%;
	max-width: 100%;
	min-width: 20rem;
	border: 1px solid @primary;
	border-bottom-right-radius: @radius;
	border-bottom-left-radius: @radius;
	background: @lift;
	box-shadow: 0 0.75rem 0.75rem rgba(0, 0, 0, 0.2);
	font-size: @font-sml;
	z-index: 9999;

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
		padding: 0.25rem 1rem;

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

.autosuggest__input--open {
	+ .autosuggest__results-container {
		display: block;
	}
}

.pkpFormField__control--hasMultilingualIndicator {
	.pkpFormField--autosuggest__input {
		padding-left: 3rem;
	}

	.pkpFormField--autosuggest__values--inline {
		left: 3rem;
	}
}

.pkpFormField--autosuggest .multilingualProgress {
	position: absolute;
	top: 0;
	left: 0;

	button {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid transparent;
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
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}

.pkpFormField--autosuggest__input:hover + .multilingualProgress button {
	border-color: @shade;
}

.pkpFormField--autosuggest__input:focus + .multilingualProgress button {
	border-color: @primary;
}
</style>
