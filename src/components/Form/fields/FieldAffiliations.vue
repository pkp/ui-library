<template>
	<div class="pkpFormField pkpFormField--affiliations">
		<div class="pkpFormField__heading">
			<label for="contributors-affiliations-searchPhrase-control" class="pkpFormFieldLabel">
				{{ t('user.affiliations', {}) }}
			</label>
		</div>
		<div id="contributors-affiliations-searchPhrase-control" class="pkpFormField__description">
			{{ t('user.affiliations.description', {}) }}
		</div>
		<div class="pkpFormField__control pkpFormField--affiliations__control">
			<PkpTable aria-label="Affiliations">
				<TableHeader>
					<TableColumn id="">{{ t('user.affiliations.institution', {}) }}</TableColumn>
					<TableColumn id="">{{ t('user.affiliations.translation', {}) }}</TableColumn>
					<TableColumn id="">&nbsp;</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow v-for="(row, indexRow) in currentValue" :key="indexRow">
						<TableCell>
							<label class="pkpFormFieldLabel">
								{{ row.name[currentLocale] }}
							</label>
							<a v-if="row.ror" :href="row.ror" target="_blank">
								&nbsp;<Icon :icon="'ror'" :class="'mr-2'" :inline="true"/>
							</a>
						</TableCell>
						<TableCell>
							<div>
								<label class="pkpFormFieldLabel">
									<a @click.prevent="toggleEditMode(indexRow)">
										{{ translations(row) }}
									</a>
								</label>
							</div>
							<div v-if="(indexRow === indexEditMode)"
									 v-for="([localeName, valueName], indexName) in Object.entries(row.name)"
									 :key="indexName">
								<div v-if="supportedLocales.includes(localeName)">
									<div class="pkpFormField pkpFormField--text">
										<div class="pkpFormField__heading">
											<label>
												{{
													(row.ror)
														? getLocaleDisplayName(localeName)
														: t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(localeName)})
												}}
											</label>
										</div>
										<div class="pkpFormField__control">
											<div class="pkpFormField__control_top">
												<input
													v-model="row.name[localeName]"
													:readonly="!!(row.ror)"
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
						</TableCell>
						<TableCell>
							<Icon
								class="h-5 w-5 text-primary"
								icon="Dropdown"
								aria-hidden="true"
							/>
							<DropdownActions
								v-if="!(indexRow === indexEditMode)"
								v-bind="rowActionsArgs(indexRow)"
								@action="rowActionsHandler"/>
							<PkpButton
								v-if="(indexRow === indexEditMode)"
								@click="closeEditMode()">Close
							</PkpButton>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<div class="pkpFormField__heading">
								<label
									for="contributors-affiliations-searchPhrase-control"
									class="pkpFormFieldLabel">
									{{ t('user.affiliations.searchPhraseLabel', {language: getLocaleDisplayName('en')}) }}
								</label>
							</div>
							<div class="pkpFormField__control">
								<div class="pkpFormField__control_top">
									<input
										v-model="searchPhrase"
										@keyup="searchPhraseChanged"
										id="contributors-affiliations-searchPhrase-control"
										class="pkpFormField__input pkpFormField--text__input"
										type="text"
										name="affiliationsSearchPhraseInput"
										aria-invalid="0"
									/> &nbsp;
									<a v-if="showAddMode && newAffiliationPending.ror"
										 :href="newAffiliationPending.ror" target="_blank">
										<Icon :icon="'ror'" :class="'mr-2'" :inline="true"/>
									</a>
								</div>
							</div>
							<div v-if="showSearchResults" class="shadow text-primary searchPhraseResults">
								<ul>
									<li>
										<a @click.prevent="selectCustomOrganization">
											{{ searchPhrase }}
										</a>
									</li>
									<li v-for="(organization, orgIndex) in apiResponse">
										<a @click.prevent="selectRorOrganization(organization)">
											{{
												(organization.name[currentLocale])
													? organization.name[currentLocale]
													: organization.name[organization.displayLocale] + ' [' + getLocaleDisplayName(organization.displayLocale) + ']'
											}} &nbsp;
											<Icon :icon="'ror'" :class="'mr-2'" :inline="true"/>
										</a>
										<a :href="organization.ror" target="_blank">
											<Icon :icon="'external-link'" :inline="true"/>
										</a>
									</li>
								</ul>
							</div>
						</TableCell>
						<TableCell>
							<div v-if="showAddMode">
								<label class="pkpFormFieldLabel">
									{{ translations(newAffiliationPending) }}
								</label>
							</div>
							<div v-if="showAddMode"
									 v-for="([localeAddMode, valueAddMode], indexNameAddMode) in Object.entries(newAffiliationPending.name)"
									 :key="indexNameAddMode">
								<div v-if="supportedLocales.includes(localeAddMode)">
									<div class="pkpFormField pkpFormField--text">
										<div class="pkpFormField__heading">
											<label>
												{{
													(newAffiliationPending.ror)
														? t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(localeAddMode)})
														: getLocaleDisplayName(localeAddMode)
												}}
											</label>
										</div>
										<div class="pkpFormField__control">
											<div class="pkpFormField__control_top">
												<input
													v-model="newAffiliationPending.name[localeAddMode]"
													:readonly="!!(newAffiliationPending.ror)"
													:id="'contributors-affiliations-newAffiliation' + '-' + localeAddMode"
													class="pkpFormField__input pkpFormField--text__input"
													type="text"
													name="affiliationsNewAffiliationPendingInput"
													aria-invalid="0">
											</div>
										</div>
									</div>
								</div>
							</div>
						</TableCell>
						<TableCell>
							<PkpButton v-if="showAddMode" @click="addAffiliation">Add</PkpButton>
							<br/><br/>
							<PkpButton v-if="showAddMode" @click="closeAddMode">Close</PkpButton>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
		</div>
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
import {useApiUrl} from "@/composables/useApiUrl";
import {useFetch} from "@/composables/useFetch";
import {useModal} from "@/composables/useModal";

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

const selectCustomOrganization = function () {
	newAffiliationPending.value = getNewItemTemplate();
	newAffiliationPending.value.name[currentLocale] = searchPhrase.value;
	apiResponse.value = [];
}
const selectRorOrganization = function (item) {
	newAffiliationPending.value = getNewItemTemplate();
	newAffiliationPending.value.ror = item.ror;
	supportedLocales.forEach((locale) => {
		if (typeof item.name[locale] !== 'undefined') {
			newAffiliationPending.value.name[locale] = item.name[locale];
		}
	});
	apiResponse.value = [];
}
const addAffiliation = function () {
	if (typeof newAffiliationPending.value.id !== 'undefined') {
		currentValue.push(JSON.parse(JSON.stringify(newAffiliationPending.value)));
		newAffiliationPending.value = {};
		searchPhrase.value = '';
		apiResponse.value = [];
	}
}
const deleteAffiliation = function (index) {
	const {openDialog} = useModal();
	openDialog({
		name: 'sendAuthorEmail',
		title: t('user.affiliations.deleteModal.title', {}),
		message: t('user.affiliations.deleteModal.message',
			{institution: currentValue[index]['name'][currentLocale]}),
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
		close: () => {
		},
	});
}
const rowActionsArgs = function (index) {
	let actions = [];

	if (!currentValue[index].ror) {
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
			"isWarnable": true,
			"id": index
		}
	);

	return {
		"actions": actions,
		"label": t('user.affiliations.translationActionsAriaLabel', {}),
		"ariaLabel": t('user.affiliations.translationActionsAriaLabel', {}),
		"direction": 'left',
		"displayAsEllipsis": true,
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
const indexEditMode = ref(-1);
const showAddMode = computed(() => {
	return typeof newAffiliationPending.value.id !== 'undefined';
});
const closeAddMode = function () {
	newAffiliationPending.value = {};
}
const showSearchResults = computed(() => {
	return searchPhrase.value.length > 0
		&& apiResponse.value.length > 0;
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

watch(currentValue, () => {
	makeCurrentValueCompatible();
}, {immediate: true});

onMounted(() => {
	makeCurrentValueCompatible();
})

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
	Object
		.keys(currentValue)
		.forEach(index => {
				supportedLocales
					.forEach((locale) => {
							if (!(locale in currentValue[index].name)) {
								currentValue[index].name[locale] = "";
							}
						}
					);
			}
		);
}

function getNewItemTemplate() {
	let newItem = {
		"id": null,
		"authorId": null,
		"ror": null,
		"name": {}
	};

	supportedLocales.forEach((locale) => {
		newItem.name[locale] = "";
	});

	return newItem;
}

function getLocaleDisplayName(locale) {
	if (typeof Intl === 'undefined') {
		return locale;
	}

	const localeNames = new Intl.DisplayNames(
		[currentLocale],
		{type: 'language'}
	);

	return localeNames.of(locale.replace('_', '-'));
}

async function apiLookup() {
	const {apiUrl} = useApiUrl(`rors/?searchPhrase=${searchPhrase.value}`);
	const {data, isSuccess, validationError, isLoading, fetch} = useFetch(apiUrl, {method: 'GET'});

	await fetch();

	if (isSuccess) {
		apiResponse.value = [];
		if (data.value.items) {
			for (let i = 0; i < data.value.items.length; i++) {
				apiResponse.value.push(data.value.items[i]);
			}
		}
	}
}

</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--affiliations {
	position: relative;
}

.pkpFormField--affiliations__control {
	position: relative;
}

.pkpFormField--affiliations__control a {
	cursor: pointer;
}

.pkpFormField--affiliations__control input[type=text] {
	width: 90%;
}

.pkpFormField--affiliations__control table th:nth-child(1) {
	width: 45%;
}

.pkpFormField--affiliations__control table th:nth-child(3) {
	width: 100px;
}

.pkpFormField--affiliations__control table td:nth-child(3) {
	text-align: right;
}

.pkpFormField--affiliations__control .searchPhraseResults {
	background-color: #fff;
	height: 140px;
	overflow-y: scroll;
	position: absolute;
	z-index: 9999;
	border: 1px solid #ccc;
	min-width: 30%;
}

.pkpFormField--affiliations__control .searchPhraseResults ul {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

.pkpFormField--affiliations__control .searchPhraseResults ul li {
	border-bottom: 1px solid #ccc;
}

.pkpFormField--affiliations__control .searchPhraseResults ul li a {
	padding: 5px;
	display: inline-flex;
}

.pkpFormField--affiliations__control .searchPhraseResults ul li a:nth-child(1) {
	width: calc(100% - 30px);
}

.pkpFormField--affiliations__control .searchPhraseResults ul li a:nth-child(2) {
	float: right;
	width: 30px;
	display: block;
}

.pkpFormField--affiliations__control .searchPhraseResults ul li a:hover {
	background-color: #f1f1f1;
}
</style>
