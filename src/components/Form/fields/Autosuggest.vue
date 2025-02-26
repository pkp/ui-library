<template>
	<span class="-screenReader">{{ selectedLabel }}</span>
	<span v-if="!currentSelected.length" class="-screenReader">
		{{ t('common.none') }}
	</span>
	<PkpBadge
		v-for="item in currentSelected"
		v-else
		:key="item.value"
		class="pkpAutosuggest__selection"
	>
		{{ item.label }}
		<slot v-if="item.hasSlot" name="input-slot" />
		<button
			v-if="!isDisabled"
			class="pkpAutosuggest__deselect text-negative hover:text-on-dark"
			@click.stop.prevent="deselect(item)"
		>
			<Icon icon="Cancel" class="h-3 w-3" />
			<span class="-screenReader">
				{{ t('common.removeItem', {item: item.label}) }}
			</span>
		</button>
	</PkpBadge>
	<Combobox
		v-if="!isDisabled"
		:id="id"
		:key="id"
		:model-value="null"
		class="pkpAutosuggest__autosuggester"
		as="div"
		@update:model-value="selectSuggestion"
	>
		<ComboboxInput
			class="pkpAutosuggest__input"
			v-bind="inputProps"
			autocomplete="off"
			:disabled="isDisabled || !enableSuggestions"
			@change="(event) => handleChange(event)"
			@focus="() => handleFocus(true)"
			@blur="() => handleFocus(false)"
		/>
		<ComboboxOptions
			v-if="
				suggestions.length ||
				(allowCustom && localInputValue?.length) ||
				isLoading
			"
			class="autosuggest__results-container autosuggest__results max-h-80 overflow-auto"
		>
			<ComboboxOption
				v-if="isLoading"
				v-slot="{active}"
				as="template"
				:disabled="true"
			>
				<li
					class="autosuggest__results-item"
					:class="active && 'autosuggest__results-item--highlighted'"
				>
					<Spinner />
					{{ t('common.loading') }}
				</li>
			</ComboboxOption>
			<ComboboxOption
				v-if="
					allowCustom &&
					localInputValue?.length &&
					!suggestions.includes(localInputValue)
				"
				v-slot="{active}"
				as="template"
			>
				<li
					class="autosuggest__results-item"
					:class="active && 'autosuggest__results-item--highlighted'"
				>
					{{ localInputValue }}
				</li>
			</ComboboxOption>
			<template v-if="!isLoading && enableSuggestions">
				<ComboboxOption
					v-for="suggestion in suggestions"
					:key="suggestion.value"
					v-slot="{active}"
					:value="suggestion"
					as="template"
				>
					<li
						class="autosuggest__results-item flex items-center"
						:class="active && 'autosuggest__results-item--highlighted'"
					>
						<slot
							v-if="slots['option']"
							name="option"
							:suggestion="suggestion"
						/>
						<ul v-else>
							<li>
								{{ suggestion.label }}
							</li>
							<li v-if="suggestion.identifier">
								<a
									v-if="suggestion.identifier.match(/^http/)"
									:href="suggestion.identifier"
									target="_blank"
									@click.stop
								>
									{{ suggestion.identifier }}
								</a>
								<template v-else>
									{{ suggestion.identifier }}
								</template>
							</li>
							<li
								v-for="(extraItem, extraItemKey) in suggestion.extraItems ?? {}"
								:key="extraItemKey"
							>
								{{ extraItem }}
							</li>
						</ul>
					</li>
				</ComboboxOption>
			</template>
		</ComboboxOptions>
	</Combobox>
</template>
<script setup>
import {useSlots, ref, computed} from 'vue';
import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from '@headlessui/vue';
import PkpBadge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const slots = useSlots();

const props = defineProps({
	/* ID to be assigned to the Combobox component */
	id: {
		type: String,
		required: true,
	},
	/* Array of suggestions to the autosuggest component */
	suggestions: {
		type: Array,
		default: () => [],
	},
	/* Label to be used for the selected items */
	selectedLabel: {
		type: String,
		required: true,
	},
	/* Array of currently selected items */
	currentSelected: {
		type: Array,
		default: () => [],
	},
	/* The input model value */
	inputValue: {
		type: String,
		default: () => '',
	},
	/* If the autosuggest component is disabled */
	isDisabled: {
		type: Boolean,
		default: () => false,
	},
	/* If the list of suggestions is loading */
	isLoading: {
		type: Boolean,
		default: () => false,
	},
	/* If multiple entries are allowed to be selected */
	isMultiple: {
		type: Boolean,
		default: () => true,
	},
	/** If custom items can be selected */
	allowCustom: {
		type: Boolean,
		default: () => false,
	},
	/** Field input id, usually used to connect with FormFieldLabel  */
	inputId: {type: String, required: false, default: null},
	/** aria-describedby ids */
	describedBy: {type: String, required: false, default: ''},
});

/**
 * Props to pass to the input field
 */
const inputProps = {
	'aria-describedby': `${props.describedBy}`,
	class: 'pkpAutosuggest__input',
	id: props.inputId,
	disabled: props.isDisabled,
};

const enableSuggestions = computed(() => {
	if (props.isMultiple) {
		return true;
	}

	// disable multiple selections if only a single item is allowed and an item is already selected.
	return !props.currentSelected.length;
});

const emit = defineEmits([
	'update:inputValue',
	'focus-changed',
	'select-suggestion',
	'deselect',
]);

const localInputValue = ref('');
const isFocused = ref(false);

function handleChange(event) {
	localInputValue.value = event.target.value.trim();
	emit('update:inputValue', localInputValue.value);
}

function handleFocus(state) {
	isFocused.value = state;
	emit('focus-changed', state);
}

function selectSuggestion(suggestion) {
	emit('select-suggestion', suggestion);
}

function deselect(item) {
	emit('deselect', item);
}

defineExpose({handleFocus});
</script>

<style lang="less">
@import '../../../styles/_import';

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

		& ul li {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.autosuggest__results-item--highlighted {
		background: @bg;
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

.pkpAutosuggest__input {
	border: none;
	width: 100%;
	&:focus {
		outline: none;
	}
}
</style>
