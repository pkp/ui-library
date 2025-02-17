<template>
	<div>
		<PkpTable>
			<template #label>
				<h3 class="">
					{{ fileManagerStore.managerConfig.title }}
				</h3>
			</template>
			<template #description>
				<p>
					{{ fileManagerStore.managerConfig.description }}
				</p>
			</template>
			<template #top-controls>
				<div class="flex gap-x-2">
					<component
						:is="Components[action.component] || action.component"
						v-bind="action.props || {}"
						v-for="(action, i) in fileManagerStore.topItems"
						:key="i"
					></component>
				</div>
			</template>
			<TableHeader>
				<TableColumn v-for="(column, i) in fileManagerStore.columns" :key="i">
					<span :class="column.headerSrOnly ? 'sr-only' : ''">
						{{ column.header }}
					</span>
				</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow v-for="file in fileManagerStore.files" :key="file.id">
					<component
						:is="Components[column.component] || column.component"
						v-for="(column, i) in fileManagerStore.columns"
						:key="i"
						:file="file"
						v-bind="column.props"
					></component>
				</TableRow>
			</TableBody>
			<template v-if="fileManagerStore.bottomItems.length" #bottom-controls>
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in fileManagerStore.bottomItems"
					:key="i"
				></component>
			</template>
		</PkpTable>
	</div>
</template>
<script setup>
import {useFileManagerStore} from './fileManagerStore.js';
import {FileManagerConfigurations} from './useFileManagerConfig.js';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableRow from '@/components/Table/TableRow.vue';

import FileManagerCellNumero from './FileManagerCellNumero.vue';
import FileManagerCellFileName from './FileManagerCellFileName.vue';
import FileManagerCellDateUploaded from './FileManagerCellDateUploaded.vue';
import FileManagerCellType from './FileManagerCellType.vue';
import FileManagerCellMoreActions from './FileManagerCellMoreActions.vue';
import FileManagerActionButton from './FileManagerActionButton.vue';

const Components = {
	FileManagerCellNumero,
	FileManagerCellFileName,
	FileManagerCellDateUploaded,
	FileManagerCellType,
	FileManagerCellMoreActions,
	FileManagerActionButton,
};

const props = defineProps({
	namespace: {
		type: String,
		required: true,
		validator: (value) => {
			return Object.keys(FileManagerConfigurations).includes(value);
		},
	},
	submission: {type: Object, required: true},
	submissionStageId: {type: String, required: true},
	reviewRoundId: {type: String, required: true},
});

const fileManagerStore = useFileManagerStore(props, props.namespace);
</script>
