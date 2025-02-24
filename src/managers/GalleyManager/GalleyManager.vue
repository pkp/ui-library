<template>
	<PkpTable data-cy="galley-manager">
		<template #label>{{ t('submission.layout.galleys') }}</template>
		<template #top-controls>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in galleyManagerStore.topItems"
					:key="i"
				></component>
			</div>
		</template>
		<TableHeader>
			<TableColumn v-for="(column, i) in galleyManagerStore.columns" :key="i">
				<span :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="galley in galleyManagerStore.galleys" :key="galley.id">
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, i) in galleyManagerStore.columns"
					:key="i"
					:galley="galley"
				></component>
			</TableRow>
		</TableBody>
		<template v-if="galleyManagerStore.bottomItems.length" #bottom-controls>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in galleyManagerStore.bottomItems"
					:key="i"
				></component>
			</div>
		</template>
	</PkpTable>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useGalleyManagerStore} from './galleyManagerStore';
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';

import GalleyManagerActionButton from './GalleyManagerActionButton.vue';
import GalleyManagerCellName from './GalleyManagerCellName.vue';
import GalleyManagerCellLanguage from './GalleyManagerCellLanguage.vue';
import GalleyManagerCellActions from './GalleyManagerCellActions.vue';
import GalleyManagerSortButton from './GalleyManagerSortButton.vue';

const Components = {
	GalleyManagerCellName,
	GalleyManagerCellLanguage,
	GalleyManagerCellActions,
	GalleyManagerSortButton,
	GalleyManagerActionButton,
};

const props = defineProps({
	publication: {type: Object, required: true},
	submission: {type: Object, required: true},
	canEdit: {type: Boolean, required: true},
});

const {t} = useLocalize();

const galleyManagerStore = useGalleyManagerStore(props);
</script>
