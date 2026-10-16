<template>
	<TableCell>
		<div class="flex flex-wrap items-center gap-y-2">
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
			<Badge
				v-if="galley.generatedFromLabel"
				class="galley-metadata-badge ms-2"
				size-variant="compact"
			>
				{{ galley.generatedFromLabel }}
			</Badge>
			<Badge
				v-if="galley.revisionLabel"
				class="galley-metadata-badge ms-2"
				size-variant="compact"
			>
				{{ galley.revisionLabel }}
			</Badge>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import FileTypeIcon from '@/components/FileTypeIcon/FileTypeIcon.vue';
import Badge from '@/components/Badge/Badge.vue';

defineProps({galley: {type: Object, required: true}});
</script>

<style scoped>
.galley-metadata-badge {
	color: #555;
	border-color: #777;
	background-color: #fff;
}
</style>
