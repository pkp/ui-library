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
				<div class="flex space-x-2">
					<PkpButton
						v-for="action in fileManagerStore.topActions"
						:key="action.name"
						@click="fileManagerStore[action.name]"
					>
						{{ action.label }}
					</PkpButton>
				</div>
			</template>
			<TableHeader>
				<TableColumn>{{ t('common.id') }}</TableColumn>
				<TableColumn>{{ t('common.fileName') }}</TableColumn>
				<TableColumn>{{ t('common.dateUploaded') }}</TableColumn>
				<TableColumn>{{ t('common.type') }}</TableColumn>
				<TableColumn v-if="fileManagerStore.itemActions.length">
					<span class="sr-only">{{ t('common.moreActions') }}</span>
				</TableColumn>
			</TableHeader>
			<TableBody>
				<FileManagerTableRow
					v-for="file in fileManagerStore.files"
					:key="file.id"
					:action-items="fileManagerStore.itemActions"
					:file="file"
				></FileManagerTableRow>
			</TableBody>
		</PkpTable>
		<div
			v-if="fileManagerStore.bottomActions.length"
			class="flex space-x-2 border-x border-b border-light p-2"
		>
			<PkpButton
				v-for="action in fileManagerStore.bottomActions"
				:key="action.name"
				is-link
				@click="fileManagerStore[action.name]"
			>
				{{ action.label }}
			</PkpButton>
		</div>
	</div>
</template>
<script setup>
import {useFileManagerStore} from './fileManagerStore.js';
import {FileManagerConfigurations} from './useFileManagerConfig.js';
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import FileManagerTableRow from './FileManagerTableRow.vue';
import {t} from '@/utils/i18n.js';

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
