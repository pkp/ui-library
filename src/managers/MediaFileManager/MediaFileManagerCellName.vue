<template>
	<TableCell is-row-header>
		<div class="flex items-center">
			<span class="text-base-normal">
				{{ localize(mediaFile.name) }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useLocalize} from '@/composables/useLocalize';

const {localize} = useLocalize();

defineProps({mediaFile: {type: Object, required: true}});
</script>
