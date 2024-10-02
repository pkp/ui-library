import FieldAffiliations from './FieldAffiliations.vue';
import PkpTable from "@/components/Table/Table.vue";
import TableHeader from "@/components/Table/TableHeader.vue";
import TableBody from "@/components/Table/TableBody.vue";
import TableRow from "@/components/Table/TableRow.vue";
import TableColumn from "@/components/Table/TableColumn.vue";
import TableCell from "@/components/Table/TableCell.vue";
import PkpButton from "@/components/Button/Button.vue";
import FieldText from "@/components/Form/fields/FieldText.vue";

import FieldAffiliationsMock from '@/components/Form/mocks/field-affiliations';
import FieldBaseMock from "@/components/Form/mocks/field-base";
import FieldTextGivenNameMock from "@/components/Form/mocks/field-text-given-name";

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
			FieldText,
		},
		setup() {
			const rorLogo = 'https://ror.org/assets/ror-logo.svg';

			const argsLookup = {
				...FieldBaseMock,
				...FieldTextGivenNameMock,
				label: 'Type the institute name',
				isRequired: false,
				isMultilingual: false,
			};

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

			function lookupValue(value){
				console.log('affiliationLookup: ' + value);
			}

			return {args, dummyAction, translations, lookupValue };
		},
		template: `
			<PkpTable aria-label="Affiliations">
				<TableHeader>
					<TableColumn>Institution</TableColumn>
					<TableColumn>Translation</TableColumn>
					<TableColumn> &nbsp; </TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow v-for="row in args.rows" :key="row.id">
						<TableCell>
							{{ row.name.en }}
							<img v-if="row.ror" :src="args.logo"
								 style="height: 1rem; display: inline-flex;" alt=""/>
						</TableCell>
						<TableCell>
							<button @click="dummyAction(translations(row))">{{ translations(row) }}</button>
						</TableCell>
						<TableCell>
							<button @click="dummyAction('...')"> ... </button>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>
							<FieldText v-bind="args.lookup" @change="lookupValue" />
						</TableCell>
						<TableCell> &nbsp; </TableCell>
						<TableCell>
							<PkpButton @click="dummyAction('add')"> Add </PkpButton>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
		`,
	}),
};

export const Base = {
	args: { ...FieldAffiliationsMock },
};
