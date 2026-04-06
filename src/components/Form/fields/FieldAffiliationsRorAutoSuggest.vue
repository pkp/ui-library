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
						{{ suggestion.label }}&nbsp;
						<sub class="opacity-75">{{ suggestion.country }}</sub>
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
							rel="noopener noreferrer"
							class="ms-auto flex"
							@mousedown.stop=""
						>
							<span class="sr-only">
								{{ t('common.openLinkNewTab', {}) }}
							</span>
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
import {ref, watch, computed, useId} from 'vue';
import Autosuggest from './Autosuggest.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	filterIds: {
		type: Array,
		default: () => [],
	},
});

const autosuggestContainerId = useId();
const currentSelected = ref([]);
const inputValue = ref('');
const isFocused = ref(false);
const hasError = ref(false);
const url = 'https://api.ror.org/v2/organizations';
const queryParams = computed(() => ({
	query: inputValue.value,
}));
const noLangCode = 'no_lang_code';

const {
	data: suggestions,
	isLoading,
	isSuccess,
	fetch: fetchSuggestions,
} = useFetch(url, {
	query: queryParams,
	debouncedMs: 400,
	onError: (error) => {
		const {openDialog} = useModal();

		hasError.value = true;

		if (error.status === 410) {
			openDialog({
				name: 'rorApiDeprecated',
				title: t('user.affiliations.error.rorApi', {}),
				message: t('user.affiliations.error.rorApiDeprecated', {}),
				actions: [
					{
						label: t('common.ok'),
						isPrimary: true,
						callback: (close) => close(),
					},
				],
				modalStyle: 'negative',
			});
			return true;
		}

		if (error.status >= 500 && error.status < 600) {
			openDialog({
				name: 'rorApiServerError',
				title: t('user.affiliations.error.rorApi'),
				message: t('user.affiliations.error.rorApiUnavailable'),
				actions: [
					{
						label: t('common.ok'),
						isPrimary: true,
						callback: (close) => close(),
					},
				],
				modalStyle: 'negative',
			});
			return true;
		}

		return false; // Show default error modal for other errors
	},
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
	suggestions: hasError.value ? [] : mappedSuggestions.value,
	currentSelected: currentSelected.value,
	isLoading: !hasError.value && isLoading.value,
}));

const mappedSuggestions = computed(() => {
	const items = suggestions.value?.items ?? [];
	return items
		.filter((item) => !props.filterIds?.includes(item.id))
		.map((item) => {
			return mapSuggestion(item);
		});
});

watch(isSuccess, (value) => {
	if (value) {
		hasError.value = false;
	}
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
		country: item.locations?.[0]?.geonames_details.country_name ?? '',
	};
}

watch(queryParams, () => {
	if (hasError.value) {
		return;
	}
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
	if (hasError.value && suggestion && typeof suggestion !== 'string') {
		return;
	}

	let nextSuggestion = suggestion;

	if (!nextSuggestion) {
		if (!inputValue.value) {
			return;
		}

		nextSuggestion = {
			value: inputValue.value,
			label: inputValue.value,
		};
	} else if (typeof nextSuggestion === 'string') {
		nextSuggestion = {
			value: nextSuggestion,
			label: nextSuggestion,
		};
	}

	if (currentSelected.value?.[0]?.value !== nextSuggestion.value) {
		currentSelected.value = [nextSuggestion];
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
