<template>
	<TableCell no-wrap>
		<Badge
			v-if="file.genreName"
			:is-primary="!file.genreIsDependent && !file.genreIsSupplementary"
		>
			{{ localize(file.genreName) }}
		</Badge>
	</TableCell>
</template>
<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Badge from '@/components/Badge/Badge.vue';

import {useLocalize} from '@/composables/useLocalize';

const {localize} = useLocalize();

defineProps({
	file: {type: Object, required: true},
});
</script>
