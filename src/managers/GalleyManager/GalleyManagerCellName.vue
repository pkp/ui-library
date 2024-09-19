<template>
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
</template>

<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({galley: {type: Object, required: true}});

const fileIcon = computed(() =>
	!!pkp.documentTypeIcons &&
	!!pkp.documentTypeIcons[props.galley?.file?.documentType]
		? pkp.documentTypeIcons[props.galley?.file?.documentType]
		: 'DocumentDefault',
);
</script>
