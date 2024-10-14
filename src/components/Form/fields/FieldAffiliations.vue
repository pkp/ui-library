<template>
	<div class="pkpFormField pkpFormAffiliations--html">
		<PkpTable aria-label="Affiliations">
			<TableHeader>
				<TableColumn id="">{{ t('user.affiliations.institution', {}) }}</TableColumn>
				<TableColumn id="">{{ t('user.affiliations.translation', {}) }}</TableColumn>
				<TableColumn id="">&nbsp;</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow v-for="([affiliationId, row], affiliationIndex) in Object.entries(value)" :key="affiliationId">
					<TableCell>
						{{ row._data.name[primaryLocale] }}
						<Icon
							v-if="row._data.ror"
							:class="'mr-2'"
							:icon="'ror'"
							:inline="true"
						/>
					</TableCell>
					<TableCell>
						<div v-if="valueHelper[id].editMode"
								 v-for="([locale1, val], index) in Object.entries(row._data.name)"
								 :key="index">
							<div v-if="locale1 !== currentLocale && supportedLocales.includes(locale1)">
								<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
									<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
										<div class="pkpFormField__heading">
											<label v-if="!valueHelper[id].editable" class="pkpFormFieldLabel">
												{{ getLocaleDisplayName(locale1) }}
											</label>
											<label v-if="valueHelper[id].editable">
												{{t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(locale1)})}}
											</label>
										</div>
										<div class="pkpFormField__control">
											<div class="pkpFormField__control_top">
												<input
													v-model="row._data.name[locale1]"
													:readonly="!valueHelper[id].editable"
													:id="'contributors-affiliations-' + id + '-' + locale1"
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
								<button @click="toggleEdit(id)">
									{{ translations(row) }}
								</button>
							</label>
						</div>
					</TableCell>
					<TableCell>
						<div v-if="!valueHelper[id].editMode">
							<DropdownActions v-bind="rowActionsArgs(id)" @action="rowActionsHandler"/>
						</div>
						<div v-if="valueHelper[id].editMode">
							<PkpButton @click="closeEdit(id)">Close</PkpButton>
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
									<a @click.prevent="selectCustomOrganization()">
										{{ searchPhrase }}
									</a>
								</li>
								<li v-for="(organization, orgIndex) in organizations">
									<a @click.prevent="selectRorOrganization(organization)">
										{{ organization.id }}: {{ organization.name[currentLocale] }}
										&nbsp;
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
								 v-for="([locale2, val], index) in Object.entries(newAffiliationPending._data.name)"
								 :key="index">
							<div v-if="locale2 !== currentLocale && supportedLocales.includes(locale2)">
								<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
									<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
										<div class="pkpFormField__heading">
											<label v-if="!newAffiliationPending._data.ror" class="pkpFormFieldLabel">
												{{ getLocaleDisplayName(locale2) }}
											</label>
											<label v-if="newAffiliationPending._data.ror">
												{{t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(locale2)})}}
											</label>
										</div>
										<div class="pkpFormField__control">
											<div class="pkpFormField__control_top">
												<input
													v-model="newAffiliationPending._data.name[locale2]"
													:readonly="newAffiliationPending._data.ror"
													:id="'contributors-affiliations-newAffiliation' + '-' + locale2"
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
						<PkpButton @click="addAffiliation()">Add</PkpButton>
					</TableCell>
				</TableRow>
			</TableBody>
		</PkpTable>
	</div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, watch} from 'vue';
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
	value: {
		type: Object,
		default() {
			return {};
		}
	},
});

//fixme: get these from parent
const apiUrl = pkp.context.apiBaseUrl + 'rors/?search=';
const currentLocale = $.pkp.app.primaryLocale;
const supportedLocales = ['en', 'de', 'fr_CA'];

const currentValue = props.value;
const organizations = ref([]);
const newAffiliationPending = ref({});
const searchPhrase = ref('');
const newItemPrefix = 'new';
let newItemCounter = 0;

// Search, select, add
const selectCustomOrganization = function () {
	newAffiliationPending.value = getNewItemTemplate();
	newAffiliationPending.value._data.name[currentLocale] = searchPhrase.value;
	showAddMode.value = true;
}
const selectRorOrganization = function (organization) {
	newAffiliationPending.value = getNewItemTemplate(organization);
	newAffiliationPending.value._data.ror = organization.ror;
	newAffiliationPending.value._data.name[currentLocale] = organization.name[currentLocale];
	searchPhrase.value = organization.name[currentLocale];
	showAddMode.value = true;
}
const addAffiliation = function () {
	newItemCounter++;
	let id = newItemPrefix + newItemCounter;
	currentValue[id] = JSON.parse(JSON.stringify(newAffiliationPending.value));
	valueHelper[id] = getValueHelperSchema()
	valueHelper[id].editable = !id;

	// cleanup
	searchPhrase.value = '';
	organizations.value = [];
	showAddMode.value = false;
}
const deleteAffiliation = function (id) {
	if (confirm(t('user.affiliations.deleteInstitutionConfirmation',
		{institution: currentValue[id]['_data']['name'][currentLocale]}))
	) {
		delete currentValue[id];
		// delete valueHelper[id];
	}
}

function searchPhraseChanged() {
	showAddMode.value = false;
	organizations.value = [];
	if (searchPhrase.value.length >= 3) {
		setTimeout(() => {
			apiLookup();
		}, 200);
	}
}

// Row actions
const rowActionsArgs = function (id) {
	let actions = [];

	if (valueHelper[id].editable) {
		actions.push(
			{
				"label": t('user.affiliations.translationEditActionLabel', {}),
				"name": "edit",
				"id": id
			}
		);
	}

	actions.push(
		{
			"label": t('user.affiliations.translationDeleteActionLabel', {}),
			"name": "delete",
			"id": id
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
		const id = param[1].trim();

		switch (name) {
			case 'edit':
				toggleEdit(id);
				break;
			case 'delete':
				deleteAffiliation(id);
				break;
			default:
				console.error(`No handler for action: ${name}`);
		}
	}
}

// GUI
const valueHelper = reactive(getValueHelper(currentValue));
const showAddMode = ref(false);
const showSearchResults = computed(() => {
	if (searchPhrase.value.length >= 3
		&& organizations.value.length > 0
		&& showAddMode.value === false) {
		return true;
	}
	return false;
});
const toggleEdit = function (id) {
	valueHelper[id].editMode = !valueHelper[id].editMode;
};
const closeEdit = function (id) {
	valueHelper[id].editMode = false;
	valueHelper[id].actions = false;
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
	Object.keys(currentValue).forEach(key => {
			if (!(key in valueHelper)) {
				valueHelper[key] = getValueHelperSchema();
			}
		},
		{immediate: true}
	);
})

onMounted(() => {
	makeValueConfirmAllowedLocales();
})

// Misc
function makeValueConfirmAllowedLocales() {
	Object.keys(currentValue).forEach(key => {
		supportedLocales.forEach((locale) => {
			if (!(locale in currentValue[key]._data.name)) {
				currentValue[key]._data.name[locale] = "";
			}
		});
	});
}

function getNewItemTemplate(organization) {
	let newItem = getAffiliationSchema();

	supportedLocales.forEach((locale) => {
		newItem._data.name[locale] = "";
	});

	return newItem;
}

function getAffiliationSchema() {
	// { "id": { }, ... }
	return {
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
		"_localesTable": {}
	};
}

function getValueHelperSchema() {
	return {
		actions: false,
		editMode: false,
		editable: false
	};
}

function getValueHelper(value) {
	let newValue = {};

	Object.keys(value).forEach(key => {
		newValue[key] = getValueHelperSchema();
		newValue[key].editable = !value[key]._data.ror;
	});

	return newValue;
}

function getLocaleDisplayName(locale) {
	const localeNames = new Intl.DisplayNames(
		[currentLocale],
		{type: 'language'}
	);

	return localeNames.of(locale.replace('_', '-'));
}

function apiLookup() {
	fetch(apiUrl + searchPhrase.value, {})
		.then(response => response.json())
		.then(data => {
			organizations.value = [];
			if (data.items) {
				for (let i = 0; i < data.items.length; i++) {
					organizations.value.push(data.items[i]);
				}
			}
		})
		.catch(error => {
			console.log(error);
		});
}
</script>

<style lang="less">
.debug {
	margin-top: 10px;
	padding: 5px;
	border: 1px solid #000;
	width: 100%;
}

.debug textarea {
	border-bottom: 1px solid #000;
	width: 100%;
	height: 200px;
}

.affiliations__sticky {
	background-color: #fff;
	border: 1px solid #ccc;
	position: absolute;
	width: 100%;
	max-width: 100%;
	min-width: 20rem;
	z-index: 9999;
}

.searchPhraseOrganizations {
	background-color: #fff;
	border: 1px solid #ccc;
	height: 140px;
	overflow-y: scroll;
	position: absolute;
	width: 100%;
	max-width: 100%;
	min-width: 20rem;
	z-index: 9999;
}

//.searchPhraseOrganizations ul {
//	list-style-type: none;
//	padding: 0;
//	margin: 0;
//}
//
//.searchPhraseOrganizations ul li {
//	padding: 0;
//}
//
//.searchPhraseOrganizations ul li a {
//	display: block;
//	cursor: pointer;
//	padding: 0.3rem;
//}
//
//.searchPhraseOrganizations ul li a:hover {
//	background-color: #f1f1f1;
//}

</style>
