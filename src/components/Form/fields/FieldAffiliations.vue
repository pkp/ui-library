<template>
	<!--
	<PkpTable aria-label="Affiliations">
		<TableHeader>
			<TableColumn>Institution</TableColumn>
			<TableColumn>Translation</TableColumn>
			<TableColumn> &nbsp;</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="row in rows" :key="row.id">
				<TableCell>
					{{ row.name[primaryLocale] }}
					<Icon
						v-if="row.ror"
						:class="'mr-2'"
						:icon="'ror'"
						:inline="true"
					/>
				</TableCell>
				<TableCell>
					<div v-for="([key, value], index) in Object.entries(row.name)" :key="index">
						<input
							v-if="key !== primaryLocale"
							v-model="row.name[key]"
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
							<label for="-searchPhraseInput-control" class="pkpFormFieldLabel">
								Type the institute name
							</label>
							<div class="pkpFormField__control">
								<div class="pkpFormField__control_top">
									<input
										v-model="searchPhrase"
										@keyup="lookupSearchPhrase"
										id="-searchPhraseInput-control"
										class="pkpFormField__input pkpFormField--text__input"
										type="text"
										name="searchPhraseInput" aria-invalid="0"
									>
								</div>
							</div>
						</div>
					</div>
				</TableCell>
				<TableCell> &nbsp;</TableCell>
				<TableCell>
					<PkpButton @click="dummyAction('add')"> Add</PkpButton>
				</TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>
	-->
	<div>
		<div>searchPhrase: {{ searchPhrase }}</div>
<!--		<div>currentValue: {{ currentValue }}</div>-->
		<div>value: {{ value }}</div>
		<textarea style="border: 1px solid #000;width:100%;height:250px;">{{ value }}</textarea>
		<textarea style="border: 1px solid #000;width:100%;height:250px;">{{ rows }}</textarea>
	</div>
</template>

<script setup>
import {computed, ref} from "vue";

import FieldBase from './FieldBase.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import FieldText from "@/components/Form/fields/FieldText.vue";

import FieldAffiliationsMock from '@/components/Form/mocks/field-affiliations';

const name = 'FieldAffiliations';

const components = {
	PkpTable,
	TableHeader,
	TableBody,
	TableRow,
	TableColumn,
	TableCell,
	PkpButton,
	Icon,
	// FieldText,
};

// extends FieldText;

const args = {...FieldAffiliationsMock};

const props = defineProps({
	value: {Array},
	// currentValue: String,
});

/* parent */
// todo: access locale from upstream
const primaryLocale = $.pkp.app.primaryLocale;
console.log(primaryLocale);

/* current component */
const searchPhrase = ref('initial value');
const rows = ref(args.rows);

const dummyAction = function (message) {
	alert('"' + message + '"' + ' clicked');
}

const translations = function (item) {
	let total = Object.keys(item.name).length;
	let translated = 0;

	for (let key in item.name) {
		if (item.name[key].length > 0) {
			translated++;
		}
	}

	if (total === translated) {
		return 'All Translations Available';
	} else {
		return translated + ' Of ' + total + ' Languages Completed';
	}
}

const lookupSearchPhrase = function () {
	console.log('searchPhrase: ' + searchPhrase.value);
}

const currentValue = computed({
	get() {
		console.log('currentValue: ' + this.value);
		return this.isMultilingual ? this.value[this.localeKey] : this.value;
	},
	set: function (newVal) {
		console.log('newValue: ' + newVal);
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

// const fieldText = {
// 	name: 'affiliations',
// 	component: 'field-text',
// 	inputType: 'text',
// 	label: 'Affiliations',
// 	groupId: 'identity',
// 	isMultilingual: false,
// 	value: '',
// };

</script>
