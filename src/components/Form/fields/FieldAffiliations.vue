<template>
	<!-- To be able to scroll to this field on error-->
	<div
		:id="`${props.formId}-${props.name}`"
		class="pkpFormField pkpFormField--affiliations"
	>
		<div class="pkpFormField__heading">
			<label class="pkpFormFieldLabel">
				{{ t('user.affiliations', {}) }}
			</label>
		</div>
		<div class="pkpFormField__description">
			{{ t('user.affiliations.description', {}) }}
		</div>
		<div class="pkpFormField__control pkpFormField--affiliations__control">
			<PkpTable aria-label="Affiliations">
				<TableHeader>
					<TableColumn id="">
						{{ t('user.affiliations.institution', {}) }}
					</TableColumn>
					<TableColumn id="">
						{{ t('user.affiliations.translation', {}) }}
					</TableColumn>
					<TableColumn id="">&nbsp;</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow
						v-for="(affiliation, affiliationIndex) in currentValue"
						:key="affiliationIndex"
					>
						<TableCell>
							<div v-if="affiliation.name[primaryLocale].trim()">
								<span class="text-lg-semibold">
									{{ affiliation.name[primaryLocale] }}
								</span>
								<a
									v-if="affiliation.ror"
									:href="affiliation.ror"
									target="_blank"
								>
									<Icon :icon="'ROR'" :class="'ml-1 h-6 w-6'" :inline="true" />
								</a>
							</div>
							<div v-else>
								<span class="text-lg-semibold text-negative">
									{{
										t('user.affiliations.primaryLocaleRequired', {
											primaryLocale: getLocaleDisplayName(primaryLocale),
										})
									}}
								</span>
							</div>
						</TableCell>
						<TableCell>
							<div v-if="affiliation.ror">
								<span class="text-lg-semibold">
									{{ affiliation.ror }}
								</span>
							</div>
							<div v-else>
								<a
									class="pkpButton cursor-pointer border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
									@click="toggleEditMode(affiliationIndex)"
								>
									<Icon
										:icon="
											translations(affiliation).count ===
											translations(affiliation).total
												? 'Complete'
												: 'InProgress'
										"
										:class="'h-6 w-6'"
										:inline="true"
									/>
									{{ translations(affiliation).label }}
								</a>
								<div
									v-if="
										affiliationIndex === indexEditMode ||
										errors?.[affiliationIndex]?.name
									"
								>
									<div
										v-for="[affiliationNameLocale] in Object.entries(
											affiliation.name,
										)"
										:key="affiliationNameLocale"
									>
										<div
											v-if="supportedLocales.includes(affiliationNameLocale)"
										>
											<FieldText
												:label="getTextFieldLabel(affiliationNameLocale)"
												:value="affiliation.name[affiliationNameLocale]"
												name="name"
												:all-errors="{
													name: errors?.[affiliationIndex]?.name?.[
														affiliationNameLocale
													],
												}"
												size="large"
												:is-required="affiliationNameLocale === primaryLocale"
												@change="
													(fieldName, _, fieldValue) => {
														updateAffiliationName(
															affiliationIndex,
															affiliationNameLocale,
															fieldValue,
														);
													}
												"
											/>
										</div>
									</div>
								</div>
							</div>
						</TableCell>
						<TableCell>
							<DropdownActions
								v-if="!(affiliationIndex === indexEditMode)"
								v-bind="rowActionsArgs(affiliationIndex)"
								@action="rowActionsHandler"
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<span class="text-lg-semibold">
								{{
									t('user.affiliations.searchPhraseLabel', {
										language: getLocaleDisplayName(defaultLocale),
									})
								}}
							</span>
							<FieldAffiliationsRorAutoSuggest ref="autoSuggestRef" />
						</TableCell>
						<TableCell>
							<div v-if="showNewAffiliationForm">
								<div v-if="newAffiliation.ror">
									<span class="text-lg-semibold">
										{{ newAffiliation.ror }}
									</span>
									<a
										:href="newAffiliation.ror"
										class="inline-block py-2"
										target="_blank"
									>
										<Icon
											:icon="'ROR'"
											:class="'ml-1 h-6 w-6'"
											:inline="true"
										/>
									</a>
								</div>
								<div v-else>
									<div>
										<span class="inline-block py-2 text-lg-semibold">
											<Icon
												:icon="
													translations(newAffiliation).count ===
													translations(newAffiliation).total
														? 'Complete'
														: 'InProgress'
												"
												:class="'h-6 w-6'"
												:inline="true"
											/>
											{{ translations(newAffiliation).label }}
										</span>
									</div>
									<div
										v-for="[newAffiliationNameLocale] in Object.entries(
											newAffiliation.name,
										)"
										:key="newAffiliationNameLocale"
									>
										<div
											v-if="supportedLocales.includes(newAffiliationNameLocale)"
										>
											<div>
												<span class="text-lg-normal">
													{{ getTextFieldLabel(newAffiliationNameLocale) }}
												</span>
												<span
													v-if="newAffiliationNameLocale === primaryLocale"
													class="pkpFormFieldLabel__required"
												>
													<span class="aria-hidden">*</span>
													<span class="-screenReader">Required</span>
												</span>
											</div>
											<div class="pkpFormField--sizelarge">
												<input
													:id="
														'contributors-affiliations-newAffiliation-' +
														newAffiliationNameLocale
													"
													v-model="
														newAffiliation.name[newAffiliationNameLocale]
													"
													:name="
														'contributors-affiliations-newAffiliation-' +
														newAffiliationNameLocale
													"
													class="pkpFormField__input pkpFormField--text__input"
													type="text"
													aria-invalid="false"
												/>
												<FieldError
													v-if="
														newAffiliationNameLocale === primaryLocale &&
														!newAffiliation.name[
															newAffiliationNameLocale
														].trim()
													"
													:messages="[t('validator.required', {})]"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</TableCell>
						<TableCell>
							<div v-if="showNewAffiliationForm">
								<button
									class="pkpButton border-transparent py-2 text-lg-semibold"
									:class="
										!newAffiliation.name[primaryLocale]
											? 'disabled text-disabled'
											: 'cursor-pointer text-primary hover:enabled:underline'
									"
									:disabled="!newAffiliation.name[primaryLocale]"
									@click="insertToAffiliationsList"
								>
									{{ t('common.add', {}) }}
								</button>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
		</div>
	</div>
</template>

<script setup>
import {ref, computed, onMounted, watch, onBeforeUnmount} from 'vue';
import {t} from '@/utils/i18n';
import {useModal} from '@/composables/useModal';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import FieldError from '@/components/Form/FieldError.vue';
import FieldAffiliationsRorAutoSuggest from '@/components/Form/fields/FieldAffiliationsRorAutoSuggest.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';

const props = defineProps({
	/** Field key used for form submission */
	name: {
		type: String,
		default: null,
	},
	/** Current value of the field */
	value: {
		type: Array,
		default: () => [],
	},
	/** ID of the author associated with the affiliations */
	authorId: {
		type: Number,
		default: null,
	},
	/** Default locale of the form */
	primaryLocale: {
		type: String,
		default: 'en',
	},
	/** Locale key for multilingual support */
	localeKey: {
		type: String,
		default: '',
	},
	/** List of supported locales */
	locales: {
		type: Array,
		default: () => [],
	},
	/** Object containing all form errors */
	allErrors: {
		type: Object,
		default() {
			return {};
		},
	},
	/** Indicates if the field supports multiple languages */
	isMultilingual: {
		type: Boolean,
		default: true,
	},
});
const authorId = props.authorId;
const primaryLocale = props.primaryLocale;
const locales = props.locales;
const currentValue = computed({
	get: () => props.value,
	set: (newVal) => emit('change', props.name, 'value', newVal),
});
const supportedLocales = props.locales.map((language) => language.key);
const defaultLocale = 'en';
const autoSuggestRef = ref(null);
const autoSuggestSelected = computed({
	get: () => autoSuggestRef.value?.currentSelected,
	set: (newVal) => (autoSuggestRef.value.currentSelected = newVal),
});
const indexEditMode = ref(-1);
const newAffiliation = ref({});
const emit = defineEmits(['change', 'set-errors']);
const {apiUrl} = useApiUrl('rors/');
const rorObjectToBeUpdated = computed(() => {
	return Object.hasOwn(newAffiliation.value, 'rorObject')
		? newAffiliation.value['rorObject']
		: {};
});
const {fetch: postRorObject} = useFetch(apiUrl.value, {
	method: 'POST',
	body: rorObjectToBeUpdated,
});

const errors = computed(() => {
	if (!Object.keys(props.allErrors).includes(props.name)) {
		return [];
	}
	return props.allErrors[props.name];
});

watch(
	currentValue,
	() => {
		makeCurrentValueCompatible();
	},
	{immediate: true},
);

// new affiliation form

const showNewAffiliationForm = computed(() => {
	return Object.hasOwn(newAffiliation.value, 'id');
});

watch(autoSuggestSelected, () => {
	if (typeof autoSuggestSelected.value[0]?.value !== 'undefined') {
		addToNewAffiliationForm(autoSuggestSelected.value[0].value);
	} else {
		newAffiliation.value = {};
	}
});

function addToNewAffiliationForm(item) {
	newAffiliation.value = getNewAffiliationTemplate();
	switch (typeof item) {
		case 'string':
			newAffiliation.value.name[primaryLocale] = item;
			break;
		case 'object':
			newAffiliation.value.ror = item.ror;
			newAffiliation.value.name[primaryLocale] =
				item['name'][item['displayLocale']];
			newAffiliation.value.rorObject = item;
			break;
		default:
			break;
	}
}

function insertToAffiliationsList() {
	if (Object.hasOwn(newAffiliation.value, 'id')) {
		currentValue.value.push(JSON.parse(JSON.stringify(newAffiliation.value)));
		if (Object.hasOwn(newAffiliation.value['rorObject'], 'id')) {
			postRorObject();
		}
		newAffiliation.value = {};
		autoSuggestSelected.value = [];
	}
}

function getNewAffiliationTemplate() {
	let names = {};
	names[primaryLocale] = '';
	supportedLocales.forEach((locale) => {
		names[locale] = '';
	});
	names = sortNamesPrimaryLocaleFirst(names);
	return {
		id: null,
		authorId: authorId,
		ror: null,
		name: names,
		rorObject: {},
	};
}

// row methods

const rowActionsArgs = function (index) {
	let actions = [];
	if (!currentValue.value[index].ror) {
		actions.push({
			label: t('user.affiliations.translationEditActionLabel', {}),
			name: 'edit',
			id: index,
		});
	}
	actions.push({
		label: t('user.affiliations.translationDeleteActionLabel', {}),
		name: 'delete',
		isWarnable: true,
		id: index,
	});
	return {
		actions: actions,
		label: t('user.affiliations.translationActionsAriaLabel', {}),
		ariaLabel: t('user.affiliations.translationActionsAriaLabel', {}),
		direction: 'left',
		buttonVariant: 'ellipsis',
	};
};

function rowActionsHandler(param) {
	if (typeof param === 'object' && param.length === 2) {
		const name = param[0].trim();
		const index = param[1];

		switch (name) {
			case 'edit':
				toggleEditMode(index);
				break;
			case 'delete':
				deleteRow(index);
				break;
			default:
				console.error(`No handler for action: ${name}`);
		}
	}
}

function toggleEditMode(index) {
	if (indexEditMode.value === index) {
		indexEditMode.value = -1;
	} else {
		indexEditMode.value = index;
	}
}

function deleteRow(index) {
	const {openDialog} = useModal();
	openDialog({
		name: 'sendAuthorEmail',
		title: t('user.affiliations.deleteModal.title', {}),
		message: t('user.affiliations.deleteModal.message', {
			affiliation: currentValue.value[index]['name'][primaryLocale],
		}),
		actions: [
			{
				label: t('common.yes', {}),
				isWarnable: true,
				callback: async (close) => {
					currentValue.value.splice(index, 1);
					close();
				},
			},
			{
				label: t('common.no', {}),
				isPrimary: true,
				callback: (close) => {
					close();
				},
			},
		],
		close: () => {},
	});
}

function updateAffiliationName(affiliationIndex, locale, value) {
	currentValue.value = currentValue.value.map((affiliation, index) => {
		if (index !== affiliationIndex) {
			return affiliation;
		}
		return {
			...affiliation,
			name: {
				...affiliation.name,
				[locale]: value,
			},
		};
	});
}

// helper methods

function makeCurrentValueCompatible() {
	currentValue.value.forEach((affiliation, index) => {
		supportedLocales.forEach((locale) => {
			if (!(locale in currentValue.value[index].name)) {
				currentValue.value[index].name[locale] = '';
			}
		});
		currentValue.value[index].name = sortNamesPrimaryLocaleFirst(
			currentValue.value[index].name,
		);
	});
}

function getLocaleDisplayName(locale) {
	let displayName = locale;
	locales.forEach((language) => {
		if (language.key === locale) {
			displayName = language.label;
		}
	});
	return displayName;
}

function sortNamesPrimaryLocaleFirst(names) {
	let nameFirst = {};
	let nameRest = {};
	Object.keys(names).forEach((key) => {
		if (key === primaryLocale) {
			nameFirst[primaryLocale] = names[key];
		} else {
			nameRest[key] = names[key];
		}
	});
	return {...nameFirst, ...nameRest};
}

function translations(affiliation) {
	let result = {
		label: '',
		count: 0,
		total: supportedLocales.length,
	};
	let names = affiliation.name;
	Object.keys(names).forEach((key) => {
		if (supportedLocales.includes(key) && names[key].length > 0) {
			result.count++;
		}
	});
	if (result.total === result.count) {
		result.label = t('user.affiliations.translationsAllAvailable', {});
	} else {
		result.label = t('user.affiliations.translationsSomeAvailable', {
			count: result.count,
			total: result.total,
		});
	}
	return result;
}

function getTextFieldLabel(locale) {
	return t('user.affiliations.typeTranslationNameInLanguageLabel', {
		language: getLocaleDisplayName(locale),
	});
}

onMounted(() => {
	makeCurrentValueCompatible();
});

onBeforeUnmount(() => {
	emit('set-errors', props.name, []);
});
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--affiliations {
	position: relative;
}

.pkpFormField--affiliations__control {
	position: relative;

	table th:nth-child(1) {
		width: 45%;
	}

	table th:nth-child(3) {
		width: 100px;
	}

	table td a {
		display: inline-block;
		line-height: 24px;
	}

	table td:nth-child(3) {
		text-align: right;
	}
}
</style>
