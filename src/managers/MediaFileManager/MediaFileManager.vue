<template>
	<div>
		<PkpTable>
			<template #label>
				<h3 class="text-xl-bold">
					{{ t('publication.mediaFiles') }}
					<Spinner
						v-if="mediaFileManagerStore.isLoadingMediaFiles"
						class="ms-2"
					/>
				</h3>
			</template>
			<template #description>
				<p class="text-lg-normal">
					{{ t('publication.mediaFiles.description') }}
				</p>
			</template>
			<template #top-controls>
				<div class="flex gap-x-2">
					<component
						:is="Components[action.component] || action.component"
						v-bind="action.props || {}"
						v-for="(action, i) in mediaFileManagerStore.topItems"
						:key="i"
					></component>
				</div>
			</template>
			<TableHeader>
				<TableColumn
					v-for="(column, i) in mediaFileManagerStore.columns"
					:key="i"
					:no-text-wrap="false"
				>
					<span :class="column.headerSrOnly ? 'sr-only' : ''">
						{{ column.header }}
					</span>
				</TableColumn>
			</TableHeader>
			<TableBodyGroup
				v-for="group in mediaFileManagerStore.mediaFilesGrouped"
				:key="group.groupId"
				:group-id="group.groupId"
				:group-size="group.files.length"
			>
				<TableRow
					v-for="mediaFile in group.files"
					:key="mediaFile.id"
					:striped="false"
				>
					<component
						:is="Components[column.component] || column.component"
						v-for="(column, i) in mediaFileManagerStore.columns"
						:key="i"
						:index="i"
						:media-file="mediaFile"
					></component>
				</TableRow>
			</TableBodyGroup>
		</PkpTable>
	</div>
</template>
<script setup>
import {useMediaFileManagerStore} from './mediaFileManagerStore';

import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBodyGroup from '@/components/Table/TableBodyGroup.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableRow from '@/components/Table/TableRow.vue';
import MediaFileManagerActionButton from './MediaFileManagerActionButton.vue';
import MediaFileManagerCellGroupId from './MediaFileManagerCellGroupId.vue';
import MediaFileManagerCellName from './MediaFileManagerCellName.vue';
import MediaFileManagerCellType from './MediaFileManagerCellType.vue';
import MediaFileManagerCellSize from './MediaFileManagerCellSize.vue';
import MediaFileManagerCellDateUploaded from './MediaFileManagerCellDateUploaded.vue';
import MediaFileManagerCellActions from './MediaFileManagerCellActions.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const props = defineProps({
	publication: {type: Object, required: true},
	submission: {type: Object, required: true},
});

const Components = {
	MediaFileManagerActionButton,
	MediaFileManagerCellGroupId,
	MediaFileManagerCellName,
	MediaFileManagerCellType,
	MediaFileManagerCellSize,
	MediaFileManagerCellDateUploaded,
	MediaFileManagerCellActions,
};
const mediaFileManagerStore = useMediaFileManagerStore(props);
</script>
