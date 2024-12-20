<template>
	<div class="pkpFormField pkpFormField--affiliations">
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
							<span
								v-if="affiliation.name[primaryLocale]"
								class="text-lg-semibold"
							>
								{{ affiliation.name[primaryLocale] }}
							</span>
							<Icon
								v-if="!affiliation.name[primaryLocale]"
								v-bind="{icon: 'exclamation-triangle'}"
							/>
							<span
								v-if="!affiliation.name[primaryLocale]"
								class="text-lg-semibold text-negative"
							>
								{{
									t('user.affiliations.primaryLocaleRequired', {
										primaryLocale: getLocaleDisplayName(primaryLocale),
									})
								}}
							</span>
							<a v-if="affiliation.ror" :href="affiliation.ror" target="_blank">
								&nbsp;
								<Icon :icon="'ROR'" :class="'mr-2 h-6 w-6'" :inline="true" />
							</a>
						</TableCell>
						<TableCell>
							<div>
								<a
									class="pkpButton cursor-pointer border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
									@click="toggleEditMode(affiliationIndex)"
								>
									<MultilingualProgress
										v-bind="{
											count: translations(affiliation).count,
											total: translations(affiliation).total,
										}"
									/>
									&nbsp;
									{{ translations(affiliation).label }}
								</a>
							</div>
							<div v-if="affiliationIndex === indexEditMode">
								<div
									v-for="[affiliationNameLocale] in Object.entries(
										affiliation.name,
									)"
									:key="affiliationNameLocale"
								>
									<div>
										<label
											v-if="
												supportedFormLocaleKeys.includes(affiliationNameLocale)
											"
											:for="
												'contributors-affiliations-' +
												affiliationIndex +
												'-' +
												affiliationNameLocale
											"
											class="text-lg-semibold"
										>
											{{
												affiliation.ror
													? getLocaleDisplayName(affiliationNameLocale)
													: t(
															'user.affiliations.typeTranslationNameInLanguageLabel',
															{
																language: getLocaleDisplayName(
																	affiliationNameLocale,
																),
															},
														)
											}}
										</label>
									</div>
									<div>
										<input
											v-if="
												supportedFormLocaleKeys.includes(affiliationNameLocale)
											"
											:id="
												'contributors-affiliations-' +
												affiliationIndex +
												'-' +
												affiliationNameLocale
											"
											v-model="affiliation.name[affiliationNameLocale]"
											:readonly="!!affiliation.ror"
											class="pkpFormField__input pkpFormField--text__input"
											type="text"
											name="searchPhraseInput"
											aria-invalid="false"
										/>
									</div>
								</div>
							</div>
						</TableCell>
						<TableCell>
							<DropdownActions
								v-if="!(affiliationIndex === indexEditMode)"
								v-bind="rowActionsArgs(affiliationIndex)"
								:class="'dropDownActions border-transparent'"
								@action="rowActionsHandler"
							/>
							<button
								v-if="affiliationIndex === indexEditMode"
								class="pkpButton cursor-pointer border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
								@click="closeEditMode()"
							>
								{{ t('common.close', {}) }}
							</button>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<div>
								<label
									for="contributors-affiliations-searchPhrase-control"
									class="text-lg-semibold"
								>
									{{
										t('user.affiliations.searchPhraseLabel', {
											language: getLocaleDisplayName(defaultLocale),
										})
									}}
								</label>
							</div>
							<div>
								<input
									id="contributors-affiliations-searchPhrase-control"
									v-model="searchPhrase"
									class="pkpFormField__input pkpFormField--text__input"
									type="text"
									name="affiliationsSearchPhraseInput"
									aria-invalid="false"
									@keyup="searchPhraseChanged"
								/>
								&nbsp;
							</div>
							<div
								v-if="showSearchResults"
								class="searchPhraseResults text-primary shadow"
							>
								<ul>
									<li>
										<a
											class="cursor-pointer border-transparent px-2 py-2 text-lg-normal text-primary hover:bg-hover hover:text-on-dark hover:enabled:underline"
											@click="selectCustomOrganization"
										>
											{{ searchPhrase }}
										</a>
									</li>
									<li
										v-for="organization in searchResults"
										:key="organization.id"
									>
										<a
											class="cursor-pointer border-transparent px-2 py-2 text-lg-normal text-primary hover:bg-hover hover:text-on-dark hover:enabled:underline"
											@click="selectRorOrganization(organization)"
										>
											{{ organization.displayName }} &nbsp;
											<Icon
												:icon="'ROR'"
												:class="'mr-2 h-6 w-6'"
												:inline="true"
											/>
										</a>
										<a
											:href="organization.ror"
											class="cursor-pointer border-transparent px-2 py-2 text-lg-normal text-primary hover:bg-hover hover:text-on-dark hover:enabled:underline"
											target="_blank"
										>
											<Icon :icon="'external-link'" :inline="true" />
										</a>
									</li>
								</ul>
							</div>
						</TableCell>
						<TableCell>
							<div v-if="showNewAffiliation">
								<div>
									<span class="inline-block py-2 text-lg-semibold">
										<MultilingualProgress
											v-bind="{
												count: translations(newAffiliation).count,
												total: translations(newAffiliation).total,
											}"
										/>
										&nbsp;
										{{ translations(newAffiliation).label }}
									</span>
									&nbsp;
									<a
										v-if="newAffiliation.ror"
										:href="newAffiliation.ror"
										class="inline-block py-2"
										target="_blank"
									>
										<Icon :icon="'ror'" :class="'mr-2'" :inline="true" />
									</a>
								</div>
								<div
									v-for="[newAffiliationNameLocale] in Object.entries(
										newAffiliation.name,
									)"
									:key="newAffiliationNameLocale"
								>
									<div>
										<span
											v-if="
												supportedFormLocaleKeys.includes(
													newAffiliationNameLocale,
												)
											"
											class="text-lg-normal"
										>
											{{
												newAffiliation.ror
													? t(
															'user.affiliations.typeTranslationNameInLanguageLabel',
															{
																language: getLocaleDisplayName(
																	newAffiliationNameLocale,
																),
															},
														)
													: getLocaleDisplayName(newAffiliationNameLocale)
											}}
										</span>
									</div>
									<div>
										<input
											v-if="
												supportedFormLocaleKeys.includes(
													newAffiliationNameLocale,
												)
											"
											:id="
												'contributors-affiliations-newAffiliation' +
												'-' +
												newAffiliationNameLocale
											"
											v-model="newAffiliation.name[newAffiliationNameLocale]"
											:readonly="!!newAffiliation.ror"
											class="pkpFormField__input pkpFormField--text__input"
											type="text"
											name="affiliationsNewAffiliationPendingInput"
											aria-invalid="false"
										/>
									</div>
								</div>
							</div>
						</TableCell>
						<TableCell>
							<div v-if="showNewAffiliation">
								<button
									class="pkpButton cursor-pointer border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
									:disabled="!validate(newAffiliation)"
									@click="addAffiliation"
								>
									{{ t('common.add', {}) }}
								</button>
								<br />
								<button
									class="pkpButton cursor-pointer border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
									@click="closeNewAffiliation"
								>
									{{ t('common.close', {}) }}
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
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import Icon from '@/components/Icon/Icon.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';

/** Define component props */
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

/** Emits component events */
const emit = defineEmits(['change', 'set-errors']);

/** Stores the ID of the author associated with this component */
const authorId = props.authorId;

/** Stores the primary locale of the form */
const primaryLocale = props.primaryLocale;

/** Stores the list of supported locales */
const locales = props.locales;

/** Current value of the field, with a setter to emit changes */
const currentValue = computed({
	get: () => props.value,
	set: (newVal) => emit('change', props.name, 'value', newVal),
});

/** Current search input for affiliations */
const searchPhrase = ref('');

/** Results from the search */
const searchResults = ref([]);

/** New affiliation being created */
const newAffiliation = ref({});

/** Keys of supported locales */
const supportedFormLocaleKeys = props.locales.map((language) => language.key);

/** Default locale for the application */
const defaultLocale = 'en';

/** Computed property to determine error messages for the field */
computed(() => {
	if (!Object.keys(props.allErrors).includes(props.name)) {
		return [];
	}
	let errors = props.allErrors[props.name];
	if (props.isMultilingual && Object.keys(errors).includes(props.localeKey)) {
		return errors[props.localeKey];
	} else if (!props.isMultilingual) {
		return errors;
	}
	return [];
});

/** Handles selecting a custom organization */
const selectCustomOrganization = function () {
	newAffiliation.value = getNewItemTemplate();
	newAffiliation.value.name[primaryLocale] = searchPhrase.value;
	searchResults.value = [];
};

/** Handles selecting an organization from the ROR API results */
const selectRorOrganization = function (item) {
	newAffiliation.value = getNewItemTemplate();
	newAffiliation.value.ror = item.ror;
	newAffiliation.value.name[primaryLocale] = item.displayName;
	supportedFormLocaleKeys.forEach((locale) => {
		if (typeof item.name[locale] !== 'undefined') {
			newAffiliation.value.name[locale] = item.name[locale];
		}
	});
	searchResults.value = [];
};

/** Adds a new affiliation to the current value */
const addAffiliation = function () {
	if (typeof newAffiliation.value.id !== 'undefined') {
		currentValue.value.push(JSON.parse(JSON.stringify(newAffiliation.value)));
		newAffiliation.value = {};
		searchPhrase.value = '';
		searchResults.value = [];
	}
};

/** Deletes an affiliation with a confirmation dialog */
const deleteAffiliation = function (index) {
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
};

/** Tracks the row being edited */
const indexEditMode = ref(-1);

/** Provides the arguments for row action buttons */
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
		displayAsEllipsis: true,
	};
};

/** Handles row action events */
const rowActionsHandler = function (param) {
	if (typeof param === 'object' && param.length === 2) {
		const name = param[0].trim();
		const index = param[1];

		switch (name) {
			case 'edit':
				toggleEditMode(index);
				break;
			case 'delete':
				deleteAffiliation(index);
				break;
			default:
				console.error(`No handler for action: ${name}`);
		}
	}
};

/** Determines whether to show the search results dropdown */
const showSearchResults = computed(() => {
	return (
		(searchPhrase.value.length > 0 && searchResults.value.length > 0) ||
		(searchPhrase.value.length > 0 && searchResults.value.length === 0) ||
		!(searchPhrase.value.length === 0)
	);
});

/** Toggles edit mode for a specific row */
const toggleEditMode = function (index) {
	if (indexEditMode.value === index) {
		indexEditMode.value = -1;
	} else {
		indexEditMode.value = index;
	}
};

/** Exits edit mode */
const closeEditMode = function () {
	indexEditMode.value = -1;
};

/** Determines whether to show the new affiliation form */
const showNewAffiliation = computed(() => {
	return typeof newAffiliation.value.id !== 'undefined';
});

/** Closes the new affiliation form */
const closeNewAffiliation = function () {
	newAffiliation.value = {};
};

/** Returns the translation status of an affiliation */
const translations = function (affiliation) {
	let result = {
		label: '',
		count: 0,
		total: supportedFormLocaleKeys.length,
	};
	let names = affiliation.name;
	Object.keys(names).forEach((key) => {
		if (supportedFormLocaleKeys.includes(key) && names[key].length > 0) {
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
};

/** Validates an affiliation */
const validate = function (affiliation) {
	return !!(affiliation.ror || affiliation.name[primaryLocale]);
};

/** Watch for changes in currentValue to ensure compatibility */
watch(
	currentValue,
	() => {
		makeCurrentValueCompatible();
	},
	{immediate: true},
);

/** On component mount, ensure currentValue is compatible */
onMounted(() => {
	makeCurrentValueCompatible();
});

/** Before unmounting, reset any errors for this field */
onBeforeUnmount(() => {
	emit('set-errors', props.name, []);
});

/** Updates search results based on the search phrase */
async function searchPhraseChanged() {
	newAffiliation.value = {};
	searchResults.value = [];
	if (searchPhrase.value.length >= 3) {
		const {apiUrl} = useApiUrl(`rors/?searchPhrase=${searchPhrase.value}`);
		const {data, isSuccess, fetch} = useFetch(apiUrl.value, {method: 'GET'});
		await fetch();
		if (isSuccess) {
			searchResults.value = [];
			if (data.value.items) {
				for (let i = 0; i < data.value.items.length; i++) {
					let row = data.value.items[i];
					row['displayName'] =
						data.value.items[i]['name'][row['displayLocale']];
					searchResults.value.push(row);
				}
			}
		}
	}
}

/** Ensures current value has a compatible structure with the expected locale keys */
function makeCurrentValueCompatible() {
	currentValue.value.forEach((value, index) => {
		supportedFormLocaleKeys.forEach((locale) => {
			if (!(locale in currentValue.value[index].name)) {
				currentValue.value[index].name[locale] = '';
			}
			currentValue.value[index].name = sortNamesPrimaryFirst(
				currentValue.value[index].name,
			);
		});
	});
}

/** Returns a template for creating a new affiliation */
function getNewItemTemplate() {
	let names = {};
	names[primaryLocale] = '';
	supportedFormLocaleKeys.forEach((locale) => {
		names[locale] = '';
	});
	names = sortNamesPrimaryFirst(names);
	return {
		id: null,
		authorId: authorId,
		ror: null,
		name: names,
	};
}

/** Returns the display name for a given locale */
function getLocaleDisplayName(locale) {
	let displayName = locale;
	locales.forEach((language) => {
		if (language.key === locale) {
			displayName = language.label;
		}
	});
	return displayName;
}

/** Ensures the primary locale name is listed first in the names object */
function sortNamesPrimaryFirst(names) {
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
	}

	table td:nth-child(3) {
		text-align: right;
	}
}

.pkpFormField--affiliations__control .searchPhraseResults {
	background-color: #fff;
	height: auto;
	max-height: 200px;
	overflow-y: scroll;
	position: absolute;
	z-index: 9999;
	border: 1px solid #ccc;
	min-width: 30%;

	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	ul li {
		border-bottom: 1px solid #ccc;
	}

	ul li:nth-child(1) a {
		width: 100%;
		display: block;
	}

	ul li:nth-child(1n + 2) a:nth-child(1) {
		width: calc(100% - 30px);
	}

	ul li:nth-child(1n + 2) a:nth-child(2) {
		float: right;
		width: 30px;
	}
}
</style>
