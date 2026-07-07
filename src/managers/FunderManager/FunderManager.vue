<template>
	<PkpTable :aria-label="t('submission.funders')">
		<template #label>
			<h3>
				{{ t('submission.funders') }}
			</h3>
		</template>
		<template #description>
			<p>
				{{ t('submission.funders.description') }}
			</p>
		</template>
		<template #top-controls>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-for="(action, i) in funderManagerStore.topItems"
					v-bind="action.props || {}"
					:key="i"
					:is-disabled="!funderManagerStore.canEditPublication"
				></component>
			</div>
		</template>
		<TableHeader>
			<TableColumn v-for="(column, i) in funderManagerStore.columns" :key="i">
				<span :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody :empty-text="t('submission.funders.emptyFunders')">
			<TableRow v-for="funder in funderManagerStore.funders" :key="funder.id">
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, index) in funderManagerStore.columns"
					:key="index"
					:funder="funder"
				/>
			</TableRow>
		</TableBody>
	</PkpTable>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useFunderManagerStore} from './funderManagerStore.js';

import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';

import FunderManagerCellFunder from '@/managers/FunderManager/FunderManagerCellFunder.vue';
import FunderManagerCellActions from '@/managers/FunderManager/FunderManagerCellActions.vue';
import FunderManagerActionButton from '@/managers/FunderManager/FunderManagerActionButton.vue';
import FunderManagerSortButton from '@/managers/FunderManager/FunderManagerSortButton.vue';

const Components = {
	FunderManagerCellFunder,
	FunderManagerCellActions,
	FunderManagerActionButton,
	FunderManagerSortButton,
};

const props = defineProps({
	publication: {type: Object, required: true},
	submission: {type: Object, required: true},
	canEdit: {type: Boolean, default: true},
	funderEditForm: {type: Object, required: true},
});

const {t} = useLocalize();
const funderManagerStore = useFunderManagerStore(props);
</script>
