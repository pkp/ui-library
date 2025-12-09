<template>
	<PkpTable :aria-label="t('submission.dataCitations')">
		<template #label>
			<h3 class="text-4 font-semibold">
				{{ t('submission.dataCitations') }}
			</h3>
			<span class="text-lg-normal">
				{{ t('submission.dataCitations.description') }}
			</span>
		</template>
		<template #top-controls>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in dataCitationManagerStore.topItems"
					:key="i"
				></component>
			</div>
		</template>
		<TableHeader>
			<TableColumn
				v-for="(column, i) in dataCitationManagerStore.columns"
				:key="i"
				:class="i > 0 ? '!w-16 !text-center' : ''"
			>
				<span v-if="column.isHeaderComponent">
					<component :is="Components[column.header] || column.header" />
				</span>
				<span v-else :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody
			:empty-text="t('submission.dataCitations.emptyCitations')"
		>
			<TableRow
			v-for="dataCitation in dataCitationManagerStore.dataCitations"
			:key="dataCitation.id"
			>
			<component
				:is="Components[column.component] || column.component"
				v-for="(column, index) in dataCitationManagerStore.columns"
				:key="index"
				v-bind="dataCitation"
				:dataCitation="dataCitation"
			/>
			</TableRow>
		</TableBody>
	</PkpTable>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useDataCitationManagerStore} from './dataCitationManagerStore.js';

import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';

import DataCitationManagerCellCitation from '@/managers/DataCitationManager/DataCitationManagerCellCitation.vue';
import DataCitationManagerCellActions from '@/managers/DataCitationManager/DataCitationManagerCellActions.vue';
import DataCitationManagerActionButton from '@/managers/DataCitationManager/DataCitationManagerActionButton.vue'

const Components = {
	DataCitationManagerCellCitation,
	DataCitationManagerCellActions,
	DataCitationManagerActionButton,
};

const props = defineProps({
	publication: {type: Object, required: true},
	submission: {type: Object, required: true},
	dataCitationEditForm: {type: Object, required: true},
});

const {t} = useLocalize();
const dataCitationManagerStore = useDataCitationManagerStore(props);

</script>
