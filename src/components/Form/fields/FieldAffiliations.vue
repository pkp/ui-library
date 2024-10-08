<template>
	<PkpTable aria-label="Affiliations">
		<TableHeader>
			<TableColumn>Institution</TableColumn>
			<TableColumn>Translation</TableColumn>
			<TableColumn> &nbsp;</TableColumn>
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
						<!--						[{{ key }}][{{ value }}][{{ index }}]-->
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

	<div><p> &nbsp; </p></div>

	<div class="debug">
		<textarea>{{ value }}</textarea>
		<!-- <textarea>{{ currentValue }}</textarea> -->
		<div>locale: {{ primaryLocale }}</div>
		<div>searchPhrase: {{ searchPhrase }}</div>
		<!-- <div>currentValue: {{ currentValue }}</div> -->
		<!-- <div>value: {{ value }}</div> -->
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

// Define props
const props = defineProps({
	value: {type: Array},
	primaryLocale: {type: String},
	primaryLocaleKey: {type: String},
});

const primaryLocale = $.pkp.app.primaryLocale;

// Reactive state
const searchPhrase = ref('');

// Method to emit changes
const emitChange = defineEmits();

const translations = function (row) {
	let total = Object.keys(row._data.name).length;
	let translated = 0;

	for (let key in row._data.name) {
		if (row._data.name[key].length > 0) {
			translated++;
		}
	}

	if (total === translated) {
		return 'All Translations Available';
	} else {
		return translated + ' Of ' + total + ' Languages Completed';
	}
}

const dummyAction = function (message) {
	alert('"' + message + '"' + ' clicked');
}

const lookupSearchPhrase = function () {
	console.log('searchPhrase: ' + searchPhrase.value);
}

// Current value computed property
// const value = computed({
// 	get() {
// 		return props.value; // Access prop directly
// 	},
// 	set(newVal) {
// 		emitChange('update:value', newVal); // Emit update event
// 	},
// });
//
// const currentValue = computed({
// 	get() {
// 		return this.isMultilingual ? this.value[this.localeKey] : this.value;
// 	},
// 	set: function (newVal) {
// 		this.$emit('change', this.name, 'value', newVal, this.localeKey);
// 	},
// });
//
// const change = function (name, prop, newValue, localeKey) {
// 	if (localeKey) {
// 		args[prop][localeKey] = newValue;
// 	} else {
// 		args[prop] = newValue;
// 	}
// };
//
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

<style lang="less">
.debug {
	font-family: Courier, monospace;
	font-size: 12px;
	line-height: 16px;
	border: 1px solid #000;
	width: 100%;
}

.debug textarea {
	border-bottom: 1px solid #000;
	width: 100%;
	height: 200px;
}
</style>
