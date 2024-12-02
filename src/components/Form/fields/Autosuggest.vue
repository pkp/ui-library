<template>
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
		<slot v-if="item.hasSlot" name="input-slot" />
		<button
			v-if="!isDisabled"
			class="pkpAutosuggest__deselect text-negative hover:text-on-dark"
			@click.stop.prevent="deselect(item)"
		>
			<Icon icon="Cancel" class="h-3 w-3" />
			<span class="-screenReader">
				{{ deselectLabel.replace('{$item}', item.label) }}
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
			ref="autosuggestInput"
			class="pkpAutosuggest__input"
			v-bind="inputProps"
			@change="(event) => handleChange(event, emit)"
			@focus="() => handleFocus(emit)"
			@blur="() => handleBlur(emit)"
		/>
		<ComboboxOptions
			v-if="suggestions.length || (allowCustom && localInputValue?.length)"
			class="autosuggest__results-container autosuggest__results"
		>
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
					<slot v-if="slots['option']" name="option" :suggestion="suggestion" />
					<span v-else>{{ suggestion.label }}</span>
				</li>
			</ComboboxOption>
		</ComboboxOptions>
	</Combobox>
</template>
<script setup>
import {useSlots} from 'vue';
import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from '@headlessui/vue';
import PkpBadge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useAutosuggest} from '@/composables/useAutosuggest';

const slots = useSlots();

defineProps({
	id: {
		type: String,
		required: true,
	},
	inputProps: {
		type: Object,
		required: true,
	},
	suggestions: {
		type: Array,
		default: () => [],
	},
	selectedLabel: {
		type: String,
		required: true,
	},
	currentValue: {
		type: Array,
		default: () => [],
	},
	currentSelected: {
		type: Array,
		default: () => [],
	},
	isDisabled: {
		type: Boolean,
		default() {
			return false;
		},
	},
	deselectLabel: {
		type: String,
		required: true,
	},
});

const emit = defineEmits([
	'update:inputValue',
	'update:isFocused',
	'select-suggestion',
	'deselect',
]);

const {allowCustom, localInputValue, handleChange, handleFocus, handleBlur} =
	useAutosuggest();

function selectSuggestion(suggestion) {
	emit('select-suggestion', suggestion);
}

function deselect(item) {
	emit('deselect', item);
}
</script>
