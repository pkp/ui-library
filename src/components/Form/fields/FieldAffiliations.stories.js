import {ref} from "vue";

import FieldAffiliations from './FieldAffiliations.vue';
import PkpTable from "@/components/Table/Table.vue";
import TableHeader from "@/components/Table/TableHeader.vue";
import TableBody from "@/components/Table/TableBody.vue";
import TableRow from "@/components/Table/TableRow.vue";
import TableColumn from "@/components/Table/TableColumn.vue";
import TableCell from "@/components/Table/TableCell.vue";
import PkpButton from "@/components/Button/Button.vue";
import Icon from "@/components/Icon/Icon.vue";

import FieldAffiliationsMock from '@/components/Form/mocks/field-affiliations';

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
		},
		setup() {
			const searchPhrase = ref('');

			const rows = args.rows;

			function dummyAction(message){
				alert('"' + message + '"' + ' clicked');
			}

			function translations(item) {
				let total = Object.keys(item.name).length;
				let translated = 0;

				for(let key in item.name) {
					if(item.name[key].length > 0){
						translated++;
					}
				}

				if(total === translated){
					return 'All Translations Available';
				}
				else{
					return translated + ' Of ' + total + ' Languages Completed';
				}
			}

			function lookupSearchPhrase() {
				console.log('searchPhrase: ' + searchPhrase.value);
			}

			return {args, searchPhrase, rows, dummyAction, translations, lookupSearchPhrase};
		},
		template: `
			<PkpTable aria-label="Affiliations">
				<TableHeader>
					<TableColumn>Institution</TableColumn>
					<TableColumn>Translation</TableColumn>
					<TableColumn> &nbsp;</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow v-for="row in rows" :key="row.id">
						<TableCell>
							{{ row.name.en }}
							<Icon
								v-if="row.ror"
								:class="'mr-2'"
								:icon="'ror'"
								:inline="true"
							/>
						</TableCell>
						<TableCell>
							<button @click="dummyAction(translations(row))">{{ translations(row) }}</button>
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
						<TableCell> &nbsp; </TableCell>
						<TableCell>
							<PkpButton @click="dummyAction('add')"> Add</PkpButton>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
			<div>
				<div>searchPhrase: {{ searchPhrase }}</div>
				<div>Icon: <Icon :class="'mr-2'" :icon="'ror'" :inline="true"/></div>
			</div>
		`,
	}),
};

export const Base = {
	args: { ...FieldAffiliationsMock },
};
