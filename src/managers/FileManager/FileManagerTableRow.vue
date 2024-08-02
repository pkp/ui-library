<template>
	<TableRow>
		<TableCell class="">
			<div class="flex items-center">
				<Icon :icon="fileIcon" class="h-6 w-6 flex-none text-heading" />
				<span class="text-base-normal text-default">{{ file.id }}</span>
			</div>
		</TableCell>
		<TableCell :is-row-header="true" full-width-truncated>
			<span class="ms-2 truncate text-base-normal text-default">
				<a
					v-if="file.url"
					class="hover:underline"
					:href="file.url"
					target="_blank"
				>
					{{ localize(file.name) }}
				</a>
				<template v-else>
					{{ localize(file.name) }}
				</template>
			</span>
		</TableCell>
		<TableCell no-wrap>
			<span class="text-base-normal text-default">
				{{ formatShortDate(file.createdAt) }}
			</span>
		</TableCell>
		<TableCell no-wrap>
			<Badge
				v-if="file.genreName"
				:is-primary="!file.genreIsDependent && !file.genreIsSupplementary"
			>
				{{ localize(file.genreName) }}
			</Badge>
		</TableCell>

		<TableCell v-if="actionItems.length" no-wrap>
			<DropdownActions
				label="More Actions (t)"
				:display-as-ellipsis="true"
				:actions="actionItems"
				@action="(actionName) => emit('action', actionName, {file: file})"
			></DropdownActions>
		</TableCell>
	</TableRow>
</template>
<script setup>
import {computed} from 'vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import TableRow from '@/components/TableNext/TableRow.vue';
import Icon from '@/components/Icon/Icon.vue';
import Badge from '@/components/Badge/Badge.vue';

import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';

const props = defineProps({
	file: {type: Object, required: true},
	actionItems: {type: Array, required: true},
});
const emit = defineEmits(['action']);

const {localize} = useLocalize();
const {formatShortDate} = useDate();

const fileIcon = computed(() =>
	!!pkp.documentTypeIcons && !!pkp.documentTypeIcons[props.file?.documentType]
		? pkp.documentTypeIcons[props.file?.documentType]
		: 'DocumentDefault',
);
</script>
