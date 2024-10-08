import {computed, reactive, ref} from 'vue';

import FieldAffiliations from './FieldAffiliations.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import FieldAffiliationsMock from '@/components/Form/mocks/field-affiliations';
import {t} from "@/utils/i18n";

export default {
	title: 'Forms/FieldAffiliations',
	component: FieldAffiliations,
	args: {},
	render: (args) => ({
		components: {
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableColumn,
			TableCell,
			PkpButton,
			Icon,
			t
		},
		setup() {
			const value = reactive(args.rows);

			const primaryLocale = $.pkp.app.primaryLocale;

			// const props = defineProps({
			// 	value: {
			// 		type: Array,
			// 		default() {
			// 			return [];
			// 		},
			// 	},
			// 	localeKey: {type: String},
			// 	primaryLocale: {type: String},
			// 	primaryLocaleKey: {type: String},
			// 	isMultilingual: {
			// 		type: Boolean,
			// 		default() {
			// 			return false;
			// 		}
			// 	},
			// });
			//
			// const emits = defineEmits([
			// 	'change',
			// ]);

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
					return 'All translations available';
					// return t('user.affiliations.translationAll', {});
				} else {
					return translated + ' of ' + total + ' languages completed';
					// return t('user.affiliations.translationSome', {translated: translated, total: total});
				}
			}

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

			const dummyAction = function (message) {
				alert('"' + message + '"' + ' clicked');
			}

			const lookupSearchPhrase = function () {
				console.log('searchPhrase: ' + searchPhrase.value);
			}

			return {
				value,
				searchPhrase,
				primaryLocale,
				currentValue,
				change,
				dummyAction,
				translations,
				lookupSearchPhrase,
			};
		},
		template: `
			<PkpTable aria-label="Affiliations">
				<TableHeader>
					<TableColumn>institution</TableColumn>
					<TableColumn>translation</TableColumn>
					<TableColumn> &nbsp;</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow v-for="([affiliationId, row], affiliationIndex) in Object.entries(value)"
							  :key="affiliationId">
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
									<label for="-searchPhraseInput-control" class="pkpFormFieldLabel">
										Type the institute name
									</label>
									<div class="pkpFormField__control">
										<div class="pkpFormField__control_top">
											<input
												v-model="searchPhrase"
												@keyup="lookupSearchPhrase"
												id="searchPhraseInput-control"
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
						<TableCell> &nbsp;</TableCell>
						<TableCell>
							<PkpButton @click="dummyAction('add')"> Add</PkpButton>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>

			<div>
				<hr/>
			</div>
			<div class="debug">
				<!-- <textarea>{{ value }}</textarea> -->
				<!-- <textarea>{{ currentValue }}</textarea> -->
				<!-- <div>locale: {{ primaryLocale }}</div> -->
				<!-- <div>searchPhrase: {{ searchPhrase }}</div> -->
				<!-- <div>currentValue: {{ currentValue }}</div> -->
				<!-- <div>value: {{ value }}</div> -->
			</div>
		`,
	}),
};

export const Base = {
	args: {...FieldAffiliationsMock},
};
