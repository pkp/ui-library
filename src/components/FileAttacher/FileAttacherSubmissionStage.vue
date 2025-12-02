<template>
	<div class="flex flex-col gap-y-4">
		<FieldSelect
			:options="options"
			:label="t('editor.selectSubmissionFilesStage')"
			size="large"
			@change="onStageChange"
		></FieldSelect>

		<template v-if="selectedStage && fileManagers[selectedStage]">
			<FileManager
				v-for="fileManager in fileManagers[selectedStage]"
				:key="fileManager"
				:submission="submission"
				:submission-stage-id="selectedStage"
				:namespace="fileManager"
			></FileManager>
		</template>
		<ButtonRow class="fileAttacher__footer">
			<template #end>
				<PkpButton :is-link="true" @click="emit('cancel')">
					<Icon icon="ArrowLeft" class="h-4 w-4" :inline="true" />
					{{ backLabel }}
				</PkpButton>
			</template>
			<PkpButton
				:is-disabled="!selectedFiles?.length"
				@click="emit('selected:files', selectedFiles)"
			>
				{{ attachSelectedLabel }}
			</PkpButton>
		</ButtonRow>
	</div>
</template>
<script setup>
import {t} from '@/utils/i18n';
import {useFileAttacherSubmissionStage} from './useFileAttacherSubmissionStage.js';

import ButtonRow from '../ButtonRow/ButtonRow.vue';
import Icon from '../Icon/Icon.vue';
import PkpButton from '../Button/Button.vue';
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';
import FileManager from '@/managers/FileManager/FileManager.vue';

const emit = defineEmits(['cancel', 'selected:files']);

const props = defineProps({
	submission: {
		type: Object,
		required: true,
	},
	attachSelectedLabel: {
		type: String,
		required: true,
	},
	backLabel: {
		type: String,
		required: true,
	},
});

const {selectedStage, selectedFiles, fileManagers, options, onStageChange} =
	useFileAttacherSubmissionStage(props);
</script>
