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
					<TableColumn id="" class="w-[45%]">
						{{ t('user.affiliations.institution', {}) }}
					</TableColumn>
					<TableColumn id="">
						{{ t('user.affiliations.translation', {}) }}
					</TableColumn>
					<TableColumn id="" class="w-[100px]">&nbsp;</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow
						v-for="(affiliation, affiliationIndex) in currentValue"
						:key="affiliationIndex"
					>
						<TableCell>
							<div
								v-if="affiliation.name[primaryLocale]"
								class="flex items-center"
							>
								<span class="inline-block align-middle text-lg-semibold">
									{{ affiliation.name[primaryLocale] }}
								</span>
								<a
									v-if="affiliation.ror"
									:href="affiliation.ror"
									class="inline-block align-middle"
									target="_blank"
								>
									<Icon
										icon="ROR"
										:class="'ms-2 inline-block h-auto w-6 align-middle'"
										:inline="true"
									/>
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
								<a
									:href="affiliation.ror"
									class="flex cursor-pointer py-2 align-middle text-lg-semibold"
									target="_blank"
								>
									{{ affiliation.ror }}
								</a>
							</div>
							<div v-else>
								<a
									class="pkpButton flex cursor-pointer items-center border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
									@click="toggleEditMode(affiliationIndex)"
								>
									<Icon
										:icon="
											translations(affiliation).count ===
											translations(affiliation).total
												? 'Complete'
												: 'InProgress'
										"
										:class="'inline-block h-auto w-6 align-middle'"
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
								:class="'dropDownActions border-transparent py-1.5'"
								@action="
									(actionName) =>
										rowActionsHandler(actionName, affiliationIndex)
								"
							/>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell class="align-top">
							<span class="text-lg-semibold">
								{{
									t('user.affiliations.searchPhraseLabel', {
										language: getLocaleDisplayName(primaryLocale),
									})
								}}
							</span>
							<FieldAffiliationsRorAutoSuggest
								ref="autoSuggestRef"
								:filter-ids="currentValueRorIds"
							/>
						</TableCell>
						<TableCell class="align-bottom">
							<div v-if="showNewAffiliationForm">
								<div v-if="newAffiliation.ror">
									<a
										:href="newAffiliation.ror"
										class="flex cursor-pointer items-center py-[0.625rem] text-lg-semibold"
										target="_blank"
									>
										{{ newAffiliation.ror }}
										<Icon
											icon="ROR"
											:class="'ms-2 inline-block h-auto w-6 align-middle'"
											:inline="true"
										/>
									</a>
								</div>
								<div v-else>
									<div>
										<span
											class="flex items-center py-[0.5rem] text-lg-semibold"
										>
											<Icon
												:icon="
													translations(newAffiliation).count ===
													translations(newAffiliation).total
														? 'Complete'
														: 'InProgress'
												"
												:class="'inline-block h-auto w-6 align-middle'"
												:inline="true"
											/>
											<span class="align-middle">
												{{ translations(newAffiliation).label }}
											</span>
										</span>
									</div>
									<div
										v-for="[
											newAffiliationNameLocale,
											newAffiliationNameLocaleIndex,
										] in Object.entries(newAffiliation.name)"
										:key="newAffiliationNameLocale"
									>
										<div
											v-if="
												supportedLocales.includes(newAffiliationNameLocale) &&
												newAffiliationNameLocale !== primaryLocale
											"
										>
											<div>
												<FieldText
													:label="getTextFieldLabel(newAffiliationNameLocale)"
													:value="newAffiliation.name[newAffiliationNameLocale]"
													name="name"
													:all-errors="{
														name: errors?.[newAffiliationNameLocaleIndex]
															?.name?.[newAffiliationNameLocale],
													}"
													size="large"
													:is-required="
														newAffiliationNameLocale === primaryLocale
													"
													@change="
														(fieldName, _, fieldValue) => {
															updateNewAffiliationName(
																newAffiliationNameLocale,
																fieldValue,
															);
														}
													"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</TableCell>
						<TableCell class="text-right">
							<div v-if="showNewAffiliationForm">
								<Button
									:is-required="true"
									:disabled="!newAffiliation.name[primaryLocale]"
									@click="handleInsertToAffiliationsList"
								>
									{{ t('common.add', {}) }}
								</Button>
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
import Button from '@/components/Button/Button.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
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
	/** The ID of the form this field should appear in. This is passed down from the `Form`.  */
	formId: {
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
});
const authorId = props.authorId;
const primaryLocale = props.primaryLocale;
const locales = props.locales;
const currentValue = computed({
	get: () => props.value,
	set: (newVal) => emit('change', props.name, 'value', newVal),
});
const currentValueRorIds = computed(() => {
	return currentValue.value
		.filter((item) => item['ror'])
		.map((item) => {
			return item['ror'];
		});
});
const supportedLocales = props.locales.map((language) => language.key);
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

// new affiliation form

const showNewAffiliationForm = computed(() => {
	return Object.hasOwn(newAffiliation.value, 'id');
});

watch(autoSuggestSelected, () => {
	if (typeof autoSuggestSelected.value[0]?.value !== 'undefined') {
		handleAddToNewAffiliationForm(autoSuggestSelected.value[0].value);
	} else {
		newAffiliation.value = {};
	}
});

function handleAddToNewAffiliationForm(item) {
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

function handleInsertToAffiliationsList() {
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

function updateNewAffiliationName(locale, value) {
	newAffiliation.value = (() => {
		return {
			...newAffiliation.value,
			name: {
				...newAffiliation.value.name,
				[locale]: value,
			},
		};
	})();
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

function rowActionsHandler(actionName, affiliationIndex) {
	switch (actionName) {
		case 'edit':
			toggleEditMode(affiliationIndex);
			break;
		case 'delete':
			deleteRow(affiliationIndex);
			break;
		default:
			console.error(`No handler for action: ${actionName}`);
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
		name: 'deleteAffiliation',
		title: t('user.affiliations.deleteModal.title', {}),
		message: t('user.affiliations.deleteModal.message', {
			affiliation: currentValue.value[index]['name'][primaryLocale],
		}),
		actions: [
			{
				label: t('common.yes', {}),
				isWarnable: true,
				callback: async (close) => {
					currentValue.value = currentValue.value.filter((_, i) => i !== index);
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
	currentValue.value = currentValue.value.map((affiliation) => {
		affiliation.name = sortNamesPrimaryLocaleFirst(affiliation.name);
		return affiliation;
	});
});

onBeforeUnmount(() => {
	emit('set-errors', props.name, []);
});
</script>
