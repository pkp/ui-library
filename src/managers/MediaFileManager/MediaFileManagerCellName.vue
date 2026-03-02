<template>
	<TableCell is-row-header>
		<div class="flex items-center">
			<span class="truncate text-lg-normal text-primary">
				<a
					v-if="mediaFile.url"
					class="hover:underline"
					:href="mediaFile.url"
					target="_blank"
				>
					{{ localize(mediaFile.name) }}
				</a>
				<template v-else>
					{{ localize(mediaFile.name) }}
				</template>
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
