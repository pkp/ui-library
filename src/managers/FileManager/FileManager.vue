<template>
	<ListPanel
		:title="title"
		:description="fileManagerStore.managerConfiguration.description"
		:items="fileManagerStore.files"
	>
		<template #header>
			<h2 class="text-lg-bold text-heading">
				<span>{{ fileManagerStore.managerConfiguration.title }}</span>
			</h2>
			<div
				v-if="fileManagerStore.managerConfiguration.description"
				class="text-base-normal"
			>
				{{ fileManagerStore.managerConfiguration.description }}
			</div>
			<div>
				<PkpButton
					v-for="action in fileManagerStore.topActions"
					:key="action.name"
					@click="fileManagerStore.handleAction(action.name)"
				>
					{{ action.label }}
				</PkpButton>
			</div>
		</template>
		<template #item="{item}">
			<FileManagerItem
				:file="item"
				:action-items="fileManagerStore.itemActions"
				@action="fileManagerStore.handleItemAction"
			></FileManagerItem>
		</template>
	</ListPanel>
	<div>
		<PkpButton
			v-for="action in fileManagerStore.bottomActions"
			:key="action.name"
			@click="fileManagerStore.handleAction(action.name)"
		>
			{{ action.label }}
		</PkpButton>
	</div>
</template>
<script setup>
import {inject} from 'vue';
import {
	FileManagerConfigurations,
	useFileManagerStore,
} from './fileManagerStore.js';
import PkpButton from '@/components/Button/Button.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import FileManagerItem from './FileManagerItem.vue';

const props = defineProps({
	configName: {
		type: String,
		required: true,
		validator: (value) => {
			return Object.keys(FileManagerConfigurations).includes(value);
		},
	},
	submissionId: {type: String, required: true},
	submissionStageId: {type: String, required: true},
	reviewRoundId: {type: String, required: true},
});

const fileManagerStore = useFileManagerStore(props, props.configName);

const registerDataChangeCallback = inject('registerDataChangeCallback');
registerDataChangeCallback(() => fileManagerStore.fetchFiles());
</script>
