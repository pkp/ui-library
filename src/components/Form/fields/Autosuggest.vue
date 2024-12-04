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
			class="autosuggest__results-container autosuggest__results"
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
						<span v-else>{{ suggestion.label }}</span>
					</li>
				</ComboboxOption>
			</template>
		</ComboboxOptions>
	</Combobox>
</template>
<script setup>
import {useSlots, ref, inject, computed} from 'vue';
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
	/* Prefix of the input's parent container and its label */
	controlPrefixId: {
		type: String,
		default: () => 'default-autosuggest',
	},
});

/**
 * Props to pass to the input field
 */
const inputProps = {
	'aria-describedby': `${props.controlPrefixId}-selected`,
	class: 'pkpAutosuggest__input',
	id: `${props.controlPrefixId}-control`,
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

const allowCustom = inject('allowCustom', false);
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
