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
			:actions="actionItems"
			@action="(actionName) => emit('action', actionName, {file: file})"
		></DropdownActions>
	</div>
</template>

<script setup>
import File from '@/components/File/File.vue';
import Badge from '@/components/Badge/Badge.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

import {useLocalize} from '@/composables/useLocalize';
const {localize} = useLocalize();

defineProps({
	file: {type: Object, required: true},
	actionItems: {type: Array, required: true},
});

const emit = defineEmits(['action']);
</script>
