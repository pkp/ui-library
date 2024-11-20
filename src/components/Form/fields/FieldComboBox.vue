<template>
	<Combobox
		:id="id"
		:key="id"
		:model-value="null"
		class="pkpAutosuggest__autosuggester"
		as="div"
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
});

const emit = defineEmits(['update:inputValue', 'update:isFocused']);

const {allowCustom, localInputValue, handleChange, handleFocus, handleBlur} =
	useAutosuggest();
</script>
