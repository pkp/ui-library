<template>
	<div class="pkpFormField pkpFormAffiliations--html">
		<PkpTable aria-label="Affiliations">
			<TableHeader>
				<TableColumn id="">{{ t('user.affiliations.institution') }}</TableColumn>
				<TableColumn id="">{{ t('user.affiliations.translation') }}</TableColumn>
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
						<div v-for="([key, value], index) in Object.entries(row._data.name)" :key="index">
							<input
								v-if="key !== primaryLocale"
								v-model="row._data.name[key]"
								class="pkpFormField__input pkpFormField--text__input"
							/>
						</div>
						<button @click="dummyAction(translations(row))">
							{{ translations(row) }}
						</button>
					</TableCell>
					<TableCell>
						<button @click="dummyAction('...')"> ...</button>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>
						<div class="pkpFormField pkpFormField--text pkpFormField--sizenormal">
							<div class="pkpFormField__heading">
								<label class="pkpFormFieldLabel"
											 for="contributor-affiliations-searchPhrase-control">
									{{ t('user.affiliations.searchPhraseLabel', {}) }}
								</label>
								<div class="pkpFormField__control">
									<div class="pkpFormField__control_top">
										<input
											v-model="searchPhrase"
											@keyup="lookupSearchPhrase"
											id="contributor-affiliations-searchPhrase-control"
											class="pkpFormField__input pkpFormField--text__input"
											type="text"
											name="searchPhraseInput"
											aria-invalid="0"
										>
									</div>
								</div>
							</div>
						</div>
					</TableCell>
					<TableCell>&nbsp;</TableCell>
					<TableCell>
						<PkpButton @click="dummyAction('add')"> Add</PkpButton>
					</TableCell>
				</TableRow>
			</TableBody>
		</PkpTable>

		<hr/>
		<div class="debug">
			<!-- <textarea>{{ value }}</textarea> -->
			<!-- <textarea>{{ currentValue }}</textarea> -->
			<!-- <div>locale: {{ primaryLocale }}</div> -->
			<div>searchPhrase: {{ searchPhrase }}</div>
			<!-- <div>currentValue: {{ currentValue }}</div> -->
			<!-- <div>value: {{ value }}</div> -->
		</div>
	</div>
</template>

<script setup>
import {computed, ref} from "vue";
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import {t} from '@/utils/i18n.js';

const name = 'FieldAffiliations';

const props = defineProps({
	value: {
		type: Array,
		default() {
			return [];
		}
	}
});

const primaryLocale = $.pkp.app.primaryLocale;

const searchPhrase = ref('');

const translations = function (row) {
	let names = row._data.name;
	let total = Object.keys(names).length;
	let translated = 0;

	for (let key in names) {
		if (names[key].length > 0) {
			translated++;
		}
	}

	if (total === translated) {
		return t('user.affiliations.translationAll', {});
	} else {
		return t('user.affiliations.translationSome',
			{translated: translated, total: total});
	}
};

const toggleTranslations = function () {

};

const lookupSearchPhrase = function () {
	if (searchPhrase.value.length >= 3) {
		console.log('searchPhrase: ' + searchPhrase.value);
	}
};

const isReadOnly = function (row) {
	if (row._data.ror) {
		return true;
	} else {
		return false;
	}
};

const newItem = () => {
	return {
		"newItem": {
			"_data": {
				"id": null,
				"authorId": null,
				"ror": "",
				"name": {
					// "en": "Simon Fraser University",
				}
			},
			"_hasLoadableAdapters": false,
			"_metadataExtractionAdapters": [],
			"_extractionAdaptersLoaded": false,
			"_metadataInjectionAdapters": [],
			"_injectionAdaptersLoaded": false,
			"_localesTable": {}
		},
	};
};

const dummyAction = function (message) {
	alert('"' + message + '"' + ' clicked');
};

/*

const emits = defineEmits([
	'change',
]);

const currentValue = computed({
	get() {
		return props.isMultilingual ? props.value[props.localeKey] : props.value;
	},
	set: function (newVal) {
		this.$emit('change', name, 'value', newVal);
	},
});

const change = function (name, prop, newValue, localeKey) {
	if (localeKey) {
		props[prop][localeKey] = newValue;
	} else {
		props[prop] = newValue;
	}
};

Current value computed property
const value = computed({
	get() {
		return props.value; // Access prop directly
	},
	set(newVal) {
		emitChange('update:value', newVal); // Emit update event
	},
});

const currentValue = computed({
	get() {
		return this.isMultilingual ? this.value[this.localeKey] : this.value;
	},
	set: function (newVal) {
		this.$emit('change', this.name, 'value', newVal, this.localeKey);
	},
});

const change = function (name, prop, newValue, localeKey) {
	if (localeKey) {
		args[prop][localeKey] = newValue;
	} else {
		args[prop] = newValue;
	}
};

const fieldText = {
	name: 'affiliations',
	component: 'field-text',
	inputType: 'text',
	label: 'Affiliations',
	groupId: 'identity',
	isMultilingual: false,
	value: '',
};

*/

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
