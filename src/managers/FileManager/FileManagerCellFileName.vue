<template>
	<TableCell :is-row-header="true" full-width-truncated>
		<span class="ms-2 truncate text-lg-normal text-default">
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
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

import {useLocalize} from '@/composables/useLocalize';

const {localize} = useLocalize();

defineProps({
	file: {type: Object, required: true},
});
</script>
