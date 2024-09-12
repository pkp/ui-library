<template>
	<div>
		<div class="flex items-center border-x border-t border-light p-4">
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
					<span class="sr-only">{{ t('common.moreActions') }}</span>
				</TableColumn>
			</TableHeader>
			<TableBody>
				<FileManagerTableRow
					v-for="file in fileManagerStore.files"
					:key="file.id"
					:action-items="fileManagerStore.itemActions"
					:file="file"
					@action="fileManagerStore.handleAction"
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
import {useFileManagerStore} from './fileManagerStore.js';
import {FileManagerConfigurations} from './useFileManagerConfig.js';
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/TableNext/Table.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import FileManagerTableRow from './FileManagerTableRow.vue';
import {t} from '@/utils/i18n.js';

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
</script>
