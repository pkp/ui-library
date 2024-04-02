<template>
	<ListPanel :title="title" :description="description" :items="files">
		<template #header>
			<h2 class="text-lg-bold text-heading">
				<span>{{ title }}</span>
			</h2>
			<div v-if="description" class="text-base-normal">{{ description }}</div>
		</template>
		<template #item="{item}">
			<div class="flex items-center">
				<div class="me-2 flex-grow truncate">
					<File
						:name="localize(item.name)"
						:document-type="item.documentType"
						:url="item.url"
					/>
				</div>
				<div class="flex-shrink-0">
					<Badge
						v-if="item.genreName"
						:is-primary="!item.genreIsDependent && !item.genreIsSupplementary"
					>
						{{ localize(item.genreName) }}
					</Badge>
				</div>
			</div>
		</template>
	</ListPanel>
</template>

<script setup>
import {defineProps} from 'vue';

defineProps({
	/** The title to display for this `ListPanel`. */
	title: {
		type: String,
		default() {
			return '';
		},
	},
	description: {
		type: String,
		default() {
			return '';
		},
	},
	files: {type: Array, required: false, default: () => []},
});

import ListPanel from '@/components/ListPanel/ListPanel.vue';
import File from '@/components/File/File.vue';
import Badge from '@/components/Badge/Badge.vue';
</script>
