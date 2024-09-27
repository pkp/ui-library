import {ref, computed} from 'vue';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {defineComponentStore} from '@/utils/defineComponentStore';

import FieldAuthorAffiliation from './FieldAuthorAffiliation.vue';
import FieldAuthorAffiliationMock from '../mocks/field-author-affiliations';
import PkpTable from "@/components/Table/Table.vue";
import TableHeader from "@/components/Table/TableHeader.vue";
import TableBody from "@/components/Table/TableBody.vue";
import TableRow from "@/components/Table/TableRow.vue";
import TableColumn from "@/components/Table/TableColumn.vue";
import TableCell from "@/components/Table/TableCell.vue";
import PkpButton from "@/components/Button/Button.vue";
import articleStats from "@/components/Table/mocks/articleStats";

export default {
	title: 'Forms/FieldAuthorAffiliation',
	component: FieldAuthorAffiliation,
};

export const useFieldAuthorAffiliationStore = defineComponentStore(
	'FieldAuthorAffiliation',
	(pageInitConfig) => {
		/** Institutions */
		const {
			items: institutions,
			fetch: fetchInstitutions,
			isLoading,
		} = useFetchPaginated(pageInitConfig.institutionsApiUrl, {
			page: 1,
			pageSize: 20,
		});

		fetchInstitutions();

		/** Counter */
		const counter = ref(0);
		const isCounterEven = computed(() => {
			return counter.value % 2 === 0;
		});

		function increaseCounter() {
			counter.value += 1;
		}

		return {
			/** Institutions */
			institutions,
			fetchInstitutions,
			isLoading,

			/** Counter */
			counter,
			isCounterEven,
			increaseCounter,
		};
	},
);

export const Default = {
	render: (args) => ({
		components: {
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableColumn,
			TableCell,
			PkpButton,
		},
		setup() {
			const rows = articleStats.slice(0, 10);

			return {args, rows};
		},
		template: `
			<PkpTable aria-label="Example for basic table">
				<TableHeader>
					<TableColumn>ID</TableColumn>
					<TableColumn>Title</TableColumn>
					<TableColumn>Views</TableColumn>
					<TableColumn>Downloads</TableColumn>
					<TableColumn>Total</TableColumn>
					<TableColumn>Action</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow v-for="row in rows" :key="row.object.id">
						<TableCell>{{ row.object.id }}</TableCell>
						<TableCell :is-row-header="true">
							{{ row.object.fullTitle.en }}
						</TableCell>
						<TableCell>{{ row.views }}</TableCell>
						<TableCell>{{ row.downloads }}</TableCell>
						<TableCell>
							<button @click="open(row)">{{ row.total }}</button>
						</TableCell>
						<TableCell>
							<PkpButton size-variant="compact" >View</PkpButton>
						</TableCell>

					</TableRow>
				</TableBody>
			</PkpTable>
		`,
	}),

	args: {
		...FieldAuthorAffiliationMock,
	},
};
