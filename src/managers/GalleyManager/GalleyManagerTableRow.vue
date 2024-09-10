<template>
	<TableRow>
		<TableCell>
			<div class="flex items-center">
				<Icon :icon="fileIcon" class="h-6 w-6 flex-none text-heading" />

				<span class="ms-2 text-base-normal">
					<a
						v-if="galley?.file?.url"
						class="hover:underline"
						target="_blank"
						:href="galley.file.url"
					>
						{{ galley.label }}
					</a>
					<template v-else>{{ galley.label }}</template>
				</span>
			</div>
		</TableCell>
		<TableCell>
			<span class="text-base-normal">
				{{ language }}
			</span>
		</TableCell>
		<TableCell>
			<DropdownActions
				:label="t('common.moreActions')"
				:display-as-ellipsis="true"
				:actions="itemActions"
				@action="(actionName) => emit('action', actionName, {galley})"
			></DropdownActions>
		</TableCell>
	</TableRow>
</template>
<script setup>
import {computed} from 'vue';

import Icon from '@/components/Icon/Icon.vue';
import TableRow from '@/components/TableNext/TableRow.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const props = defineProps({
	galley: {type: Object, required: true},
	metadataLocales: {type: Object, required: true},
	itemActions: {type: Array, required: true},
});
const emit = defineEmits(['action']);

const language = computed(() => {
	return props.metadataLocales[props.galley.locale];
});

const fileIcon = computed(() =>
	!!pkp.documentTypeIcons &&
	!!pkp.documentTypeIcons[props.galley?.file?.documentType]
		? pkp.documentTypeIcons[props.galley?.file?.documentType]
		: 'DocumentDefault',
);
</script>
