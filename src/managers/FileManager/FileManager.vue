<template>
	<div>
		<div class="flex items-center border border-light p-4">
			<div class="flex-grow">
				<h3 class="text-lg-bold text-heading">
					{{ fileManagerStore.managerConfig.title }}
				</h3>
				<p class="pt-2 text-sm-normal">
					{{ fileManagerStore.managerConfig.description }}
				</p>
			</div>
			<div class="ms-2 flex flex-none space-x-2">
				<PkpButton
					v-for="action in fileManagerStore.topActions"
					:key="action.name"
					@click="fileManagerStore.handleAction(action.name)"
				>
					{{ action.label }}
				</PkpButton>
			</div>
		</div>
		<PkpTable aria-label="Example for basic table">
			<TableHeader>
				<TableColumn>No</TableColumn>
				<TableColumn>File name</TableColumn>
				<TableColumn>Date Uploaded</TableColumn>
				<TableColumn>Type</TableColumn>
				<TableColumn v-if="fileManagerStore.itemActions.length">
					<span class="sr-only">Actions (t)</span>
				</TableColumn>
			</TableHeader>
			<TableBody>
				<FileManagerTableRow
					v-for="file in fileManagerStore.files"
					:key="file.id"
					:action-items="fileManagerStore.itemActions"
					:file="file"
					@action="fileManagerStore.handleItemAction"
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
				@click="fileManagerStore.handleAction(action.name)"
			>
				{{ action.label }}
			</PkpButton>
		</div>
	</div>
</template>
<script setup>
import {inject} from 'vue';
import {useFileManagerStore} from './fileManagerStore.js';
import {FileManagerConfigurations} from './useFileManagerConfig.js';
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import FileManagerTableRow from './FileManagerTableRow.vue';

const props = defineProps({
	configName: {
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

const fileManagerStore = useFileManagerStore(props, props.configName);

const registerDataChangeCallback = inject('registerDataChangeCallback');
registerDataChangeCallback(() => fileManagerStore.fetchFiles());
</script>
