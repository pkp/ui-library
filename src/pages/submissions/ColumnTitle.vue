<template>
	<TableCell
		:id="'submission-title-' + submission.id"
		class="max-w-[25em] truncate"
		:is-row-header="true"
	>
		<span class="text-lg-semibold">
			{{ submission.publications[0].authorsStringShort }}
		</span>
		<template v-if="submission.publications[0].authorsStringShort">—</template>
		<!-- FIXME replace with the localized value -->
		{{ submission.publications[0].fullTitle.en }}
	</TableCell>
</template>

<script setup>
import {defineProps} from 'vue';

import TableCell from '@/components/TableNext/TableCell.vue';

defineProps({submission: {type: Object, required: true}});
</script>
