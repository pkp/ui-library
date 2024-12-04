<template>
	<div
		class="relative"
		:class="{
			'pkpAutosuggest--disabled': autoSuggestProps.isDisabled,
		}"
	>
		<div class="relative mt-1 w-full">
			<div
				:id="autoSuggestProps.inputDescribedByIds"
				ref="values"
				class="pkpAutosuggest__inputWrapper pkpFormField__input"
				:class="{
					'pkpAutosuggest__inputWrapper--focus': isFocused,
				}"
				@click="setFocusToInput"
			>
				<Autosuggest
					v-bind="autoSuggestProps"
					@update:input-value="updateInputValue"
					@select-suggestion="handleSelect"
					@deselect="handleDeselect"
					@focus-changed="changeFocus"
				>
					<template #input-slot>
						<Icon icon="ROR" class="ms-2 h-auto w-6" :inline="true" />
					</template>
					<template #option="{suggestion}">
						{{ suggestion.label }}
						<Icon
							v-if="suggestion.hasSlot"
							icon="ROR"
							class="ms-2 h-auto w-6"
							:inline="true"
						/>
						<a
							v-if="suggestion.hasSlot"
							:href="suggestion.href"
							target="_blank"
							class="ms-auto flex"
						>
							<span class="sr-only">Open link in new tab</span>
							<Icon icon="NewTab" class="h-5 w-5 text-primary" :inline="true" />
						</a>
					</template>
				</Autosuggest>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, watch, computed} from 'vue';
import Autosuggest from './Autosuggest.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useFetch} from '@/composables/useFetch';

const currentSelected = ref([]);
const inputValue = ref('');
const isFocused = ref(false);

const url = 'https://api.ror.org/v2/organizations';
const queryParams = computed(() => ({
	query: inputValue.value,
}));

const {
	data: suggestions,
	isLoading,
	fetch: fetchSuggestions,
} = useFetch(url, {
	query: queryParams,
});

const staticProps = {
	id: 'default-autosuggest-autosuggest',
	selectedLabel: 'Selected',
	inputDescribedByIds: 'default-autosuggest-selected',
	inputControlId: 'default-autosuggest-control',
	isMultiple: false,
};

const autoSuggestProps = computed(() => ({
	...staticProps,
	suggestions: mappedSuggestions.value,
	currentSelected: currentSelected.value,
	isLoading: isLoading.value,
}));

const mappedSuggestions = computed(() => {
	return suggestions.value?.items.map((item) => {
		// get the name from "ror_display" type
		const name = item.names?.find((i) =>
			i.types.includes('ror_display'),
		)?.value;

		return {
			value: item.id,
			label: name,
			hasSlot: true,
			href: item.id,
		};
	});
});

watch(queryParams, () => {
	getSuggestions();
});

async function getSuggestions() {
	await fetchSuggestions();
}

function updateInputValue(value) {
	inputValue.value = value;
}

function changeFocus(focused) {
	isFocused.value = focused;
}

function handleSelect(suggestion) {
	if (!currentSelected.value.some((item) => item.value === suggestion.value)) {
		currentSelected.value.push(suggestion);
	}
}

function handleDeselect(item) {
	currentSelected.value = currentSelected.value.filter(
		(selected) => selected.value !== item.value,
	);
}
</script>
