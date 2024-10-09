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
			const value = reactive(args.items);

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
				if(searchPhrase.value.length >= 3) {
					console.log('searchPhrase: ' + searchPhrase.value);
				}
			};

			const isReadOnly = function (row) {
				return !!row._data.ror;
			};

			const dummyAction = function (message) {
				alert('"' + message + '"' + ' clicked');
			};

			return {
				value,
				searchPhrase,
				primaryLocale,
				dummyAction,
				translations,
				lookupSearchPhrase,
				isReadOnly,
			};
		},
		template: `
			<PkpTable aria-label="Affiliations">
				<TableHeader>
					<TableColumn id="">{{ t('user.affiliations.institution') }}</TableColumn>
					<TableColumn id="">{{ t('user.affiliations.translation') }}</TableColumn>
					<TableColumn id=""> &nbsp;</TableColumn>
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
									:readonly="isReadOnly(row)"
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
					<TableRow style="background-color: #eaedee;">
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
						<TableCell> &nbsp;</TableCell>
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
		`,
	}),
};

export const Base = {
	args: {...FieldAffiliationsMock},
};
