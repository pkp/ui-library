<template>
	<div class="pkpFormField pkpFormAffiliations--html">
		<PkpTable aria-label="Affiliations">
			<TableHeader>
				<TableColumn id="">{{ t('user.affiliations.institution', {}) }}</TableColumn>
				<TableColumn id="">{{ t('user.affiliations.translation', {}) }}</TableColumn>
				<TableColumn id="">&nbsp;</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow v-for="(row, indexRow) in currentValue" :key="indexRow">
					<TableCell>
						<div v-if="row._helper.editMode"
								 class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
							<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
								<div class="pkpFormField__heading">
									<label class="pkpFormFieldLabel">
										<span v-if="!row._helper.editable">
											{{ getLocaleDisplayName(currentLocale) }}
										</span>
										<span v-if="row._helper.editable">
											{{ t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(currentLocale)}) }}
										</span>
									</label>
								</div>
								<div class="pkpFormField__control">
									<div class="pkpFormField__control_top">
										<input
											v-model="row._data.name[currentLocale]"
											:readonly="!row._helper.editable"
											:id="'contributors-affiliations-' + indexRow + '-' + currentLocale"
											class="pkpFormField__input pkpFormField--text__input"
											type="text"
											name="searchPhraseInput"
											aria-invalid="0">
									</div>
								</div>
							</div>
						</div>
						<div v-if="!row._helper.editMode" class="pkpFormField__heading">
							<label class="pkpFormFieldLabel">{{ row._data.name[currentLocale] }}</label> &nbsp;
							<a :href="row._data.ror" target="_blank">
								<Icon v-if="!row._helper.editable" :icon="'ror'" :class="'mr-2'" :inline="true"/>
							</a>
						</div>
					</TableCell>
					<TableCell>
						<div v-if="row._helper.editMode"
								 v-for="([localeName, valueName], indexName) in Object.entries(row._data.name)"
								 :key="indexName">
							<div v-if="localeName !== currentLocale && supportedLocales.includes(localeName)">
								<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
									<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
										<div class="pkpFormField__heading">
											<label v-if="!row._helper.editable" class="pkpFormFieldLabel">
												{{ getLocaleDisplayName(localeName) }}
											</label>
											<label v-if="row._helper.editable">
												{{ t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(localeName)}) }}
											</label>
										</div>
										<div class="pkpFormField__control">
											<div class="pkpFormField__control_top">
												<input
													v-model="row._data.name[localeName]"
													:readonly="!row._helper.editable"
													:id="'contributors-affiliations-' + indexRow + '-' + localeName"
													class="pkpFormField__input pkpFormField--text__input"
													type="text"
													name="searchPhraseInput"
													aria-invalid="0">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="pkpFormField__heading">
							<label class="pkpFormFieldLabel">
								<button @click="toggleEditMode(indexRow)">
									{{ translations(row) }}
								</button>
							</label>
						</div>
					</TableCell>
					<TableCell>
						<div v-if="!row._helper.editMode">
							<DropdownActions v-bind="rowActionsArgs(indexRow)" @action="rowActionsHandler"/>
						</div>
						<div v-if="row._helper.editMode">
							<PkpButton @click="closeEditMode(indexRow)">Close</PkpButton>
						</div>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>
						<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
							<div class="pkpFormField__heading">
								<label
									for="contributors-affiliationsSearchPhraseInput-control"
									class="pkpFormFieldLabel">
									{{ t('user.affiliations.searchPhraseLabel', {language: getLocaleDisplayName('en')}) }}
								</label>
							</div>
							<div class="pkpFormField__control">
								<div class="pkpFormField__control_top">
									<input
										v-model="searchPhrase"
										@keyup="searchPhraseChanged"
										id="contributors-affiliationsSearchPhraseInput-control"
										class="pkpFormField__input pkpFormField--text__input  pkpFormField--sizelarge"
										type="text"
										name="affiliationsSearchPhraseInput"
										aria-invalid="0"
									/>
								</div>
							</div>
						</div>
						<div v-if="showSearchResults" class="shadow text-primary searchPhraseOrganizations">
							<ul>
								<li>
									<a @click.prevent="selectCustomOrganization">
										{{ searchPhrase }}
									</a>
								</li>
								<li v-for="(organization, orgIndex) in apiResponse">
									<a @click.prevent="selectRorOrganization(organization)">
										{{ organization.name[currentLocale] }} &nbsp;
										<Icon :icon="'ror'" :class="'mr-2'" :inline="true"/>
									</a>
									<a :href="organization.ror" target="_blank">
										<Icon :icon="'arrow-up-right-from-square'" :inline="true"/>
									</a>
								</li>
							</ul>
						</div>
					</TableCell>
					<TableCell>
						<div v-if="showAddMode"
								 v-for="([localeAddMode, valueAddMode], indexNameAddMode) in Object.entries(newAffiliationPending._data.name)"
								 :key="indexNameAddMode">
							<div v-if="localeAddMode !== currentLocale && supportedLocales.includes(localeAddMode)">
								<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
									<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
										<div class="pkpFormField__heading">
											<label v-if="!newAffiliationPending._data.ror" class="pkpFormFieldLabel">
												{{ getLocaleDisplayName(localeAddMode) }}
											</label>
											<label v-if="newAffiliationPending._data.ror">
												{{ t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(localeAddMode)}) }}
											</label>
										</div>
										<div class="pkpFormField__control">
											<div class="pkpFormField__control_top">
												<input
													v-model="newAffiliationPending._data.name[localeAddMode]"
													:readonly="newAffiliationPending._data.ror"
													:id="'contributors-affiliations-newAffiliation' + '-' + localeAddMode"
													class="pkpFormField__input pkpFormField--text__input"
													type="text"
													name="searchPhraseInput"
													aria-invalid="0">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</TableCell>
					<TableCell>
						<PkpButton @click="addAffiliation">Add</PkpButton>
					</TableCell>
				</TableRow>
			</TableBody>
		</PkpTable>
	</div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import {t} from "@/utils/i18n";
import DropdownActions from "@/components/DropdownActions/DropdownActions.vue";
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';

const name = 'FieldAffiliations';

const props = defineProps({
	currentLocale: {type: String},
	supportedLocales: {type: Object},
	value: {type: Array},
});

const currentLocale = props.currentLocale;
const supportedLocales = props.supportedLocales;
const currentValue = props.value;
const apiResponse = ref([]);
const newAffiliationPending = ref({});
const searchPhrase = ref('');

// Row actions
const selectCustomOrganization = function () {
	newAffiliationPending.value = getNewItemTemplate();
	newAffiliationPending.value._data.name[currentLocale] = searchPhrase.value;
}
const selectRorOrganization = function (item) {
	newAffiliationPending.value = getNewItemTemplate();
	newAffiliationPending.value._data.ror = item.ror;
	newAffiliationPending.value._data.name[currentLocale] = item.name[currentLocale];
	searchPhrase.value = item.name[currentLocale];
}
const addAffiliation = function () {
	currentValue.push(JSON.parse(JSON.stringify(newAffiliationPending.value)));
	newAffiliationPending.value = {};
	searchPhrase.value = '';
	apiResponse.value = [];
}
const deleteAffiliation = function (index) {
	if (confirm(t('user.affiliations.deleteInstitutionConfirmation',
		{institution: currentValue[index]['_data']['name'][currentLocale]}))
	) {
		currentValue.splice(index, 1);
	}
}
const rowActionsArgs = function (index) {
	let actions = [];

	if (currentValue[index]._helper.editable) {
		actions.push(
			{
				"label": t('user.affiliations.translationEditActionLabel', {}),
				"name": "edit",
				"id": index
			}
		);
	}

	actions.push(
		{
			"label": t('user.affiliations.translationDeleteActionLabel', {}),
			"name": "delete",
			"id": index
		}
	);

	return {
		actions: actions,
		label: '...',
		ariaLabel: t('user.affiliations.translationActionsAriaLabel', {}),
		direction: 'left',
	};
};
const rowActionsHandler = function (param) {
	if (typeof (param) === 'object' && param.length === 2) {
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
}

// GUI
const showAddMode = computed(() => {
	return typeof newAffiliationPending.value._data !== 'undefined';
});
const showSearchResults = computed(() => {
	return searchPhrase.value.length >= 3
		&& apiResponse.value.length > 0
		&& showAddMode.value === false;
});
const toggleEditMode = function (index) {
	currentValue[index]._helper.editMode = !currentValue[index]._helper.editMode;
};
const closeEditMode = function (index) {
	currentValue[index]._helper.editMode = false;
	currentValue[index]._helper.actions = false;
};
const translations = function (row) {
	let names = row._data.name;
	let total = supportedLocales.length;
	let translated = 0;

	for (let key in names) {
		if (supportedLocales.includes(key)
			&& names[key].length > 0) {
			translated++;
		}
	}

	if (total === translated) {
		return t('user.affiliations.translationsAllAvailable', {});
	} else {
		return t('user.affiliations.translationsSomeAvailable',
			{translated: translated, total: total});
	}
};

// Hooks
watch(currentValue, () => {
		makeCurrentValueCompatible();
	},
	{immediate: true}
);

onMounted(() => {
	makeCurrentValueCompatible();
})

// Misc
function searchPhraseChanged() {
	newAffiliationPending.value = {};

	apiResponse.value = [];
	if (searchPhrase.value.length >= 3) {
		setTimeout(() => {
			apiLookup();
		}, 200);
	}
}

function makeCurrentValueCompatible() {
	Object.keys(currentValue).forEach(index => {
		supportedLocales.forEach((locale) => {
			if (!(locale in currentValue[index]._data.name)) {
				currentValue[index]._data.name[locale] = "";
			}
		});

		if (!currentValue[index]['_helper']) {
			currentValue[index]['_helper'] = getHelperSchema();
		}
		currentValue[index]['_helper'].editable = !currentValue[index]._data.ror;
	});
}

function getNewItemTemplate() {
	let newItem = {
		"_data": {
			"id": null,
			"authorId": null,
			"ror": null,
			"name": {}
		},
		"_hasLoadableAdapters": false,
		"_metadataExtractionAdapters": [],
		"_extractionAdaptersLoaded": false,
		"_metadataInjectionAdapters": [],
		"_injectionAdaptersLoaded": false,
		"_localesTable": {},
		"_helper": getHelperSchema()
	};

	supportedLocales.forEach((locale) => {
		newItem._data.name[locale] = "";
	});

	return newItem;
}

function getHelperSchema() {
	return {
		editMode: false,
		editable: false
	};
}

function getLocaleDisplayName(locale) {
	if(typeof Intl === 'undefined') {
		return locale;
	}

	const localeNames = new Intl.DisplayNames(
		[currentLocale],
		{type: 'language'}
	);

	return localeNames.of(locale.replace('_', '-'));
}

function apiLookup() {
	fetch(pkp.context.apiBaseUrl + 'rors/?search=' + searchPhrase.value, {})
		.then(response => response.json())
		.then(data => {
			apiResponse.value = [];
			if (data.items) {
				for (let i = 0; i < data.items.length; i++) {
					apiResponse.value.push(data.items[i]);
				}
			}
		})
		.catch(error => {
			console.log(error);
		});
}
</script>

<style lang="less">
@import '../../../styles/_import';

.searchPhraseOrganizations {
	background-color: #fff;
	height: 140px;
	overflow-y: scroll;
	position: absolute;
	z-index: 9999;
	border: 1px solid #ccc;
}

.searchPhraseOrganizations ul {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

.searchPhraseOrganizations ul li {
	border-bottom: 1px solid #ccc;
	height: 43px;
}

.searchPhraseOrganizations ul li a {
	cursor: pointer;
	padding: 5px;
	display: inline-flex;
}

.searchPhraseOrganizations ul li a:nth-child(1) {
	width: calc(100% - 34px);
}

.searchPhraseOrganizations ul li a:nth-child(2) {
	float: right;
	width: 34px;
	height: inherit;
}

.searchPhraseOrganizations ul li a:hover {
	background-color: #f1f1f1;
}
</style>
