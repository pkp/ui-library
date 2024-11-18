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
					<TableRow v-for="(row, indexRow) in currentValue" :key="indexRow">
						<TableCell>
							<span v-if="row.name[primaryLocale]" class="text-lg-semibold">
								{{ row.name[primaryLocale] }}
							</span>
							<Icon
								v-if="!row.name[primaryLocale]"
								v-bind="{icon: 'exclamation-triangle'}"
							/>
							<span
								v-if="!row.name[primaryLocale]"
								class="text-lg-semibold text-negative"
							>
								{{
									t('user.affiliations.primaryLocaleRequired', {
										primaryLocale: getLocaleDisplayName(primaryLocale),
									})
								}}
							</span>
							<a v-if="row.ror" :href="row.ror" target="_blank">
								&nbsp;
								<Icon :icon="'ror'" :class="'mr-2'" :inline="true" />
							</a>
						</TableCell>
						<TableCell>
							<div>
								<a
									class="pkpButton cursor-pointer border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
									@click="toggleEditMode(indexRow)"
								>
									{{ translations(row) }}
								</a>
							</div>
							<div v-if="indexRow === indexEditMode">
								<div
									v-for="([localeName], indexName) in Object.entries(row.name)"
									:key="indexName"
								>
									<div>
										<label
											v-if="supportedFormLocaleKeys.includes(localeName)"
											:for="
												'contributors-affiliations-' +
												indexRow +
												'-' +
												localeName
											"
											class="text-lg-semibold"
										>
											{{
												row.ror
													? getLocaleDisplayName(localeName)
													: t(
															'user.affiliations.typeTranslationNameInLanguageLabel',
															{language: getLocaleDisplayName(localeName)},
														)
											}}
										</label>
									</div>
									<div>
										<input
											v-if="supportedFormLocaleKeys.includes(localeName)"
											:id="
												'contributors-affiliations-' +
												indexRow +
												'-' +
												localeName
											"
											v-model="row.name[localeName]"
											:readonly="!!row.ror"
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
								v-if="!(indexRow === indexEditMode)"
								v-bind="rowActionsArgs(indexRow)"
								:class="'dropDownActions border-transparent'"
								@action="rowActionsHandler"
							/>
							<button
								v-if="indexRow === indexEditMode"
								class="pkpButton border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
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
										v-for="(organization, orgIndex) in apiResponse"
										:key="orgIndex"
									>
										<a
											class="cursor-pointer border-transparent px-2 py-2 text-lg-normal text-primary hover:bg-hover hover:text-on-dark hover:enabled:underline"
											@click="selectRorOrganization(organization)"
										>
											{{ organization.displayName }} &nbsp;
											<Icon :icon="'ror'" :class="'mr-2'" :inline="true" />
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
							<div v-if="showAddMode">
								<div>
									<span class="inline-block py-2 text-lg-semibold">
										{{ translations(newAffiliationPending) }}
									</span>
									&nbsp;
									<a
										v-if="newAffiliationPending.ror"
										:href="newAffiliationPending.ror"
										class="inline-block py-2"
										target="_blank"
									>
										<Icon :icon="'ror'" :class="'mr-2'" :inline="true" />
									</a>
								</div>
								<div
									v-for="([localeAddMode], indexNameAddMode) in Object.entries(
										newAffiliationPending.name,
									)"
									:key="indexNameAddMode"
								>
									<div>
										<span
											v-if="supportedFormLocaleKeys.includes(localeAddMode)"
											class="text-lg-normal"
										>
											{{
												newAffiliationPending.ror
													? t(
															'user.affiliations.typeTranslationNameInLanguageLabel',
															{language: getLocaleDisplayName(localeAddMode)},
														)
													: getLocaleDisplayName(localeAddMode)
											}}
										</span>
									</div>
									<div>
										<input
											v-if="supportedFormLocaleKeys.includes(localeAddMode)"
											:id="
												'contributors-affiliations-newAffiliation' +
												'-' +
												localeAddMode
											"
											v-model="newAffiliationPending.name[localeAddMode]"
											:readonly="!!newAffiliationPending.ror"
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
							<div v-if="showAddMode">
								<button
									class="pkpButton border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
									:disabled="!validate(newAffiliationPending)"
									@click="addAffiliation"
								>
									{{ t('common.insert', {}) }}
								</button>
								<br />
								<button
									class="pkpButton border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
									@click="closeAddMode"
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
import {ref, computed, onMounted, watch} from 'vue';
import {t} from '@/utils/i18n';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import {useApiUrl} from '@/composables/useApiUrl';
import {useFetch} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';

const props = defineProps({
	authorId: {
		type: Number,
		default: null,
	},
	primaryLocale: {
		type: String,
		default: 'en',
	},
	supportedFormLocales: {
		type: Array,
		default: () => [],
	},
	value: {
		type: Array,
		default: () => [],
	},
});

const authorId = props.authorId;
const primaryLocale = props.primaryLocale;
const supportedFormLocales = props.supportedFormLocales;
const currentValue = props.value;
const apiResponse = ref([]);
const newAffiliationPending = ref({});
const searchPhrase = ref('');
const supportedFormLocaleKeys = supportedFormLocales.map(function (language) {
	return language.key;
});
const defaultLocale = 'en';

const selectCustomOrganization = function () {
	newAffiliationPending.value = getNewItemTemplate();
	newAffiliationPending.value.name[primaryLocale] = searchPhrase.value;

	apiResponse.value = [];
};
const selectRorOrganization = function (item) {
	newAffiliationPending.value = getNewItemTemplate();
	newAffiliationPending.value.ror = item.ror;
	newAffiliationPending.value.name[primaryLocale] = item.displayName;

	supportedFormLocaleKeys.forEach((locale) => {
		if (typeof item.name[locale] !== 'undefined') {
			newAffiliationPending.value.name[locale] = item.name[locale];
		}
	});

	apiResponse.value = [];
};
const addAffiliation = function () {
	if (typeof newAffiliationPending.value.id !== 'undefined') {
		currentValue.push(JSON.parse(JSON.stringify(newAffiliationPending.value)));
		newAffiliationPending.value = {};
		searchPhrase.value = '';
		apiResponse.value = [];
	}
};
const deleteAffiliation = function (index) {
	const {openDialog} = useModal();
	openDialog({
		name: 'sendAuthorEmail',
		title: t('user.affiliations.deleteModal.title', {}),
		message: t('user.affiliations.deleteModal.message', {
			institution: currentValue[index]['name'][primaryLocale],
		}),
		actions: [
			{
				label: t('common.yes', {}),
				isWarnable: true,
				callback: async (close) => {
					currentValue.splice(index, 1);
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
const rowActionsArgs = function (index) {
	let actions = [];

	if (!currentValue[index].ror) {
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
const indexEditMode = ref(-1);
const showAddMode = computed(() => {
	return typeof newAffiliationPending.value.id !== 'undefined';
});
const closeAddMode = function () {
	newAffiliationPending.value = {};
};
const showSearchResults = computed(() => {
	return (
		(searchPhrase.value.length > 0 && apiResponse.value.length > 0) ||
		(searchPhrase.value.length > 0 && apiResponse.value.length === 0) ||
		!(searchPhrase.value.length === 0)
	);
});
const toggleEditMode = function (index) {
	if (indexEditMode.value === index) {
		indexEditMode.value = -1;
	} else {
		indexEditMode.value = index;
	}
};
const closeEditMode = function () {
	indexEditMode.value = -1;
};
const translations = function (row) {
	let names = row.name;
	let total = supportedFormLocaleKeys.length;
	let translated = 0;

	Object.keys(names).forEach((key) => {
		if (supportedFormLocaleKeys.includes(key) && names[key].length > 0) {
			translated++;
		}
	});

	if (total === translated) {
		return t('user.affiliations.translationsAllAvailable', {});
	} else {
		return t('user.affiliations.translationsSomeAvailable', {
			translated: translated,
			total: total,
		});
	}
};
const validate = function (item) {
	return !!(item.ror || item.name[primaryLocale]);
};

watch(
	currentValue,
	() => {
		makeCurrentValueCompatible();
	},
	{immediate: true},
);

onMounted(() => {
	makeCurrentValueCompatible();
});

async function searchPhraseChanged() {
	newAffiliationPending.value = {};
	apiResponse.value = [];

	if (searchPhrase.value.length >= 3) {
		const {apiUrl} = useApiUrl(`rors/?searchPhrase=${searchPhrase.value}`);
		const {data, isSuccess, fetch} = useFetch(apiUrl.value, {method: 'GET'});

		await fetch();

		if (isSuccess) {
			apiResponse.value = [];
			if (data.value.items) {
				for (let i = 0; i < data.value.items.length; i++) {
					let row = data.value.items[i];
					row['displayName'] =
						data.value.items[i]['name'][row['displayLocale']];
					apiResponse.value.push(row);
				}
			}
		}
	}
}

function makeCurrentValueCompatible() {
	currentValue.forEach((value, index) => {
		supportedFormLocaleKeys.forEach((locale) => {
			if (!(locale in currentValue[index].name)) {
				currentValue[index].name[locale] = '';
			}

			currentValue[index].name = sortNamesPrimaryFirst(
				currentValue[index].name,
			);
		});
	});
}

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

function getLocaleDisplayName(locale) {
	let displayName = locale;
	supportedFormLocales.forEach((language) => {
		if (language.key === locale) {
			displayName = language.label;
		}
	});

	return displayName;
}

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

	.dropDownActions svg {
		width: 1.5em;
	}
}

.pkpFormField--affiliations__control .searchPhraseResults {
	background-color: #fff;
	height: 140px;
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
