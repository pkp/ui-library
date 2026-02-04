<template>
	<TableCell>
		<div class="flex items-center">
			<Badge v-if="mediaFile.genreName">
				{{ localize(mediaFile.genreName) }}
			</Badge>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Badge from '@/components/Badge/Badge.vue';
import {useLocalize} from '@/composables/useLocalize';

const {localize} = useLocalize();

defineProps({mediaFile: {type: Object, required: true}});
</script>
