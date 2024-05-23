<template>
	<TableCell
		:id="'submission-title-' + item.id"
		class="max-w-[25em] truncate"
		:is-row-header="true"
	>
		<span class="text-lg-semibold">
			{{ item.publications[0].authorsStringShort }}
		</span>
		<template v-if="item.publications[0].authorsStringShort">—</template>
		<!-- FIXME replace with the localized value -->
		{{ item.publications[0].fullTitle.en }}
	</TableCell>
</template>

<script setup>
import {defineProps} from 'vue';

import TableCell from '@/components/TableNext/TableCell.vue';

defineProps({item: {type: Object, required: true}});
</script>
