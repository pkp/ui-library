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
			@change="(event) => handleChange(event)"
			@focus="() => handleFocus()"
			@blur="() => handleBlur()"
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
import {useSlots, ref, inject} from 'vue';
import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from '@headlessui/vue';
import PkpBadge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';

const slots = useSlots();

const props = defineProps({
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
	currentSelected: {
		type: Array,
		default: () => [],
	},
	isDisabled: {
		type: Boolean,
		default: () => false,
	},
	deselectLabel: {
		type: String,
		required: true,
	},
	inputValue: {
		type: String,
		default: () => '',
	},
	isFocused: {
		type: Boolean,
		default: () => false,
	},
});

const emit = defineEmits([
	'update:inputValue',
	'update:isFocused',
	'select-suggestion',
	'deselect',
]);

const allowCustom = inject('allowCustom', false);
const localInputValue = ref('');
const localIsFocused = ref(props.isFocused);

function handleChange(event) {
	localInputValue.value = event.target.value.trim();
	emit('update:inputValue', localInputValue.value);
}

function handleFocus() {
	localIsFocused.value = true;
	emit('update:isFocused', localIsFocused.value);
}

function handleBlur() {
	localIsFocused.value = false;
	emit('update:isFocused', localIsFocused.value);
}

function selectSuggestion(suggestion) {
	emit('select-suggestion', suggestion);
}

function deselect(item) {
	emit('deselect', item);
}
</script>
