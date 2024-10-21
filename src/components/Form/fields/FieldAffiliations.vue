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
								<button @click="toggleEditMode(indexRow)">
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
												{{t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(locale2)})}}
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
	value: {type: Object},
	currentLocale: {type: String},
	supportedLocales: {type: Object},
});

const currentLocale = props.currentLocale;
const supportedLocales = props.supportedLocales;
const currentValue = props.value;
const organizations = ref([]);
const newAffiliationPending = ref({});
const searchPhrase = ref('');

// Row actions
const selectCustomOrganization = function () {
	newAffiliationPending.value = getNewItemTemplate();
	newAffiliationPending.value._data.name[currentLocale] = searchPhrase.value;
}
const selectRorOrganization = function (organization) {
	newAffiliationPending.value = getNewItemTemplate();
	newAffiliationPending.value._data.ror = organization.ror;
	newAffiliationPending.value._data.name[currentLocale] = organization.name[currentLocale];
	searchPhrase.value = organization.name[currentLocale];
}
const addAffiliation = function () {
	// newItemCounter++;
	currentValue.push(JSON.parse(JSON.stringify(newAffiliationPending.value)));

	// cleanup
	cleanupAfterAdding();
}
const deleteAffiliation = function (id) {
	if (confirm(t('user.affiliations.deleteInstitutionConfirmation',
		{institution: currentValue[id]['_data']['name'][currentLocale]}))
	) {
		delete currentValue[id];
	}
}
const rowActionsArgs = function (id) {
	let actions = [];

	if (currentValue[id]._helper.editable) {
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
		const id = param[1];

		switch (name) {
			case 'edit':
				toggleEditMode(id);
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
const showAddMode = computed(() => {
	return typeof newAffiliationPending.value._data !== 'undefined';
});
const showSearchResults = computed(() => {
	return searchPhrase.value.length >= 3
		&& organizations.value.length > 0
		&& showAddMode.value === false;
});
const toggleEditMode = function (id) {
	currentValue[id]._helper.editMode = !currentValue[id]._helper.editMode;
};
const closeEditMode = function (id) {
	currentValue[id]._helper.editMode = false;
	currentValue[id]._helper.actions = false;
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
	if (typeof isStoryBook === 'undefined') {
		organizations.value = [];
		if (searchPhrase.value.length >= 3) {
			setTimeout(() => {
				apiLookup();
			}, 200);
		}
	}
}

function makeCurrentValueCompatible() {
	Object.keys(currentValue).forEach(key => {
		supportedLocales.forEach((locale) => {
			if (!(locale in currentValue[key]._data.name)) {
				currentValue[key]._data.name[locale] = "";
			}
		});

		if (!currentValue[key]['_helper']) {
			currentValue[key]['_helper'] = getHelperSchema();
			currentValue[key]['_helper'].editable = !currentValue[key]._data.ror;
		}
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
		actions: false,
		editMode: false,
		editable: false
	};
}

function getLocaleDisplayName(locale) {
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

function cleanupAfterAdding() {
	newAffiliationPending.value = {};
	searchPhrase.value = '';
	if (typeof isStoryBook === 'undefined') {
		organizations.value = [];
	}
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
