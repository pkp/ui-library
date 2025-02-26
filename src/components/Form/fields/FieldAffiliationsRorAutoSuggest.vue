<template>
	<div
		class="relative"
		:class="{
			'pkpAutosuggest--disabled': autoSuggestProps.isDisabled,
		}"
	>
		<div class="relative mt-1 w-full">
			<div
				:id="autosuggestContainerId"
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
							<Icon
								icon="OpenNewTab"
								class="h-5 w-5 text-primary"
								:inline="true"
							/>
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
import {useId} from '@/composables/useId';

const props = defineProps({
	filterIds: {
		type: Array,
		default: () => [],
	},
});
const {generateId} = useId();
const autosuggestContainerId = generateId();
const currentSelected = ref([]);
const inputValue = ref('');
const isFocused = ref(false);
const url = 'https://api.ror.org/v2/organizations';
const queryParams = computed(() => ({
	query: inputValue.value,
}));
const noLangCode = 'no_lang_code';

const {
	data: suggestions,
	isLoading,
	fetch: fetchSuggestions,
} = useFetch(url, {
	query: queryParams,
	debouncedMs: 400,
});

const staticProps = {
	id: 'default-autosuggest-autosuggest',
	selectedLabel: 'Selected',
	isMultiple: false,
	describedBy: autosuggestContainerId,
	allowCustom: true,
};

const autoSuggestProps = computed(() => ({
	...staticProps,
	suggestions: mappedSuggestions.value,
	currentSelected: currentSelected.value,
	isLoading: isLoading.value,
}));

const mappedSuggestions = computed(() => {
	return suggestions.value?.items
		.filter((item) => !props.filterIds?.includes(item.id))
		.map((item) => {
			return mapSuggestion(item);
		});
});

function mapSuggestion(item) {
	const displayLocale =
		item.names?.find((i) => i.types.includes('ror_display'))?.lang !== null
			? item.names?.find((i) => i.types.includes('ror_display'))?.lang
			: noLangCode;

	let names = {};
	item.names?.forEach((name) => {
		if (name.types.includes('label') || name.types.includes('ror_display')) {
			const locale = name.lang !== null ? name.lang : noLangCode;
			names[locale] = name.value;
		}
	});

	return {
		value: {
			id: null,
			ror: item.id,
			displayLocale: displayLocale,
			isActive: item.status === 'active' ? 1 : 0,
			name: names,
			_href: null,
		},
		label: names[displayLocale],
		hasSlot: true,
		href: item.id,
	};
}

watch(queryParams, () => {
	if (inputValue.value.length > 3) {
		getSuggestions();
	}
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
	if (!suggestion) {
		if (!inputValue.value) {
			return;
		}

		suggestion = {
			value: inputValue.value,
			label: inputValue.value,
		};
	}

	if (currentSelected.value !== suggestion.value) {
		currentSelected.value = [suggestion];
	}
}

function handleDeselect(item) {
	currentSelected.value = currentSelected.value.filter(
		(selected) => selected.value !== item.value,
	);
}

defineExpose({
	currentSelected,
});
</script>
