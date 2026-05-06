<template>
	<TableCell>
		<div class="flex items-center">
			<FileTypeIcon
				:document-type="galley?.file?.documentType"
				class="h-6 w-6 flex-none text-heading"
			/>

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
import TableCell from '@/components/Table/TableCell.vue';
import FileTypeIcon from '@/components/FileTypeIcon/FileTypeIcon.vue';

defineProps({galley: {type: Object, required: true}});
</script>
