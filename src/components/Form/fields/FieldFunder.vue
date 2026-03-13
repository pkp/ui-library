<template>
	<div
		:id="`${props.formId}-${props.name}`"
		class="pkpFormField pkpFormField--funder"
	>
		<div class="pkpFormField__heading">
			<label :id="labelId" class="pkpFormFieldLabel">
				{{ t('submission.funders.funder') }}
			</label>
		</div>

		<div :id="descriptionId" class="pkpFormField__description" v-if="!currentValue || !currentValue.name?.[primaryLocale]">
			{{ t('submission.funders.funder.description') }}
		</div>
		<div class="pkpFormField__control">
			<div v-if="currentValue && currentValue.name">
				<div v-if="currentValue.ror">
					<div class="flex items-center text-lg-semibold">
						{{ localize(currentValue.name) }}
						<a
							:href="currentValue.ror"
							class="ms-2"
							target="_blank"
						>
							<Icon icon="ROR" class="w-6" :inline="true" />
						</a>
					</div>

					<a
						:href="currentValue.ror"
						class="block text-lg-semibold"
						target="_blank"
					>
						{{ currentValue.ror }}
					</a>

				</div>

				<div v-else>
					<div
						v-for="locale in supportedLocales"
						:key="locale"
					>
						<FieldText
							:label="getTextFieldLabel(locale)"
							:value="currentValue.name[locale]"
							name="name"
							size="large"
							:is-required="locale === primaryLocale"
							@change="(_, __, value) => updateFunderName(locale, value)"
						/>
					</div>
				</div>
				<div class="mt-3">
					<Button isWarnable @click="removeFunder">
						{{ t('common.delete') }}
					</Button>
				</div>
			</div>
			<div v-else>
				<span class="text-lg-semibold">
					{{
						t('submission.funders.funder.searchPhraseLabel', {
							language: getLocaleDisplayName(primaryLocale),
						})
					}}
				</span>
				<FieldAffiliationsRorAutoSuggest
					ref="autoSuggestRef"
				/>

				<FieldError
					v-if="props.allErrors?.funder"
					:messages="props.allErrors.funder"
				/>

			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, useId, onBeforeUnmount } from 'vue';
import { t } from '@/utils/i18n';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import { localize } from '@/utils/i18n';
import Button from '@/components/Button/Button.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import FieldAffiliationsRorAutoSuggest from '@/components/Form/fields/FieldAffiliationsRorAutoSuggest.vue';
import Icon from '@/components/Icon/Icon.vue';
import FieldError from '@/components/Form/FieldError.vue';

const props = defineProps({
	name: String,
	formId: String,
	value: {
		type: Object,
		default: null,
	},
	primaryLocale: {
		type: String,
	},
	supportedFormLocales: {
		type: Array,
		default: () => [],
	},
	allErrors: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['change', 'set-errors']);

const labelId = useId();
const descriptionId = useId();

const primaryLocale = props.primaryLocale;
const supportedLocales = props.supportedFormLocales.map((language) => language.key);

const currentValue = computed({
	get: () => props.value,
	set: (val) => emit('change', props.name, 'value', val),
});

const {apiUrl} = useUrl('rors/');
function postRorObject(rorObject) {
	const {fetch} = useFetch(apiUrl.value, {
		method: 'POST',
		body: rorObject,
	});
	fetch();
}

const autoSuggestRef = ref(null);
const autoSuggestSelected = computed({
	get: () => autoSuggestRef.value?.currentSelected,
	set: (val) => {
		if (autoSuggestRef.value) {
			autoSuggestRef.value.currentSelected = val;
		}
	},
});

watch(autoSuggestSelected, () => {
	const item = autoSuggestSelected.value?.[0]?.value;
	if (typeof item === 'undefined') return;

	const funder = createTemplate();

	if (typeof item === 'string') {
		funder.name[primaryLocale] = item;
	} else {
		funder.ror = item.ror;
		funder.name[primaryLocale] = item.name[item.displayLocale];
		funder.rorObject = item;
	}

	currentValue.value = funder;

	if (funder.rorObject) {
		postRorObject(funder.rorObject);
	}

	autoSuggestSelected.value = [];
});

function createTemplate() {
	const names = {};
	supportedLocales.forEach(locale => {
		names[locale] = '';
	});
	return {
		id: null,
		ror: null,
		name: names,
		rorObject: null,
	};
}

function updateFunderName(locale, value) {
	currentValue.value = {
		...currentValue.value,
		name: {
			...currentValue.value.name,
			[locale]: value,
		},
	};
}

function removeFunder() {
	currentValue.value = null;
}

function getLocaleDisplayName(locale) {
	const found = props.supportedFormLocales.find(l => l.key === locale);
	return found ? found.label : locale;
}

function getTextFieldLabel(locale) {
	return t('submission.funders.funder.typeTranslationNameInLanguageLabel', {
		language: getLocaleDisplayName(locale),
	});
}

onBeforeUnmount(() => {
	emit('set-errors', props.name, []);
});
</script>