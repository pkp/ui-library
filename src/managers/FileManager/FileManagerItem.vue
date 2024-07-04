<template>
	<div class="files-center flex">
		<div class="me-2 flex-grow truncate">
			<File
				:name="localize(file.name)"
				:document-type="file.documentType"
				:url="file.url"
			/>
		</div>
		<div class="flex-shrink-0">
			<Badge
				v-if="file.genreName"
				:is-primary="!file.genreIsDependent && !file.genreIsSupplementary"
			>
				{{ localize(file.genreName) }}
			</Badge>
		</div>
		<DropdownActions
			label="More Actions (t)"
			:display-as-ellipsis="true"
			:actions="actionsList"
			@action="handleFileAction"
		></DropdownActions>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import File from '@/components/File/File.vue';
import Badge from '@/components/Badge/Badge.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

import {useLocalize} from '@/composables/useLocalize';
import {useReviewerManagerActions} from './useFileManagerActions';
const {localize} = useLocalize();

const props = defineProps({
	submissionId: {type: String, required: true},
	submissionStageId: {type: String, required: true},
	file: {type: Object, required: true},
});

const {handleAction, getAvailableActions} = useReviewerManagerActions();

const actionsList = computed(() => {
	return getAvailableActions(props.file);
});

function handleFileAction(actionName) {
	handleAction(actionName, {
		file: props.file,
		submissionId: props.submissionId,
		submissionStageId: props.submissionStageId,
	});
}
</script>
