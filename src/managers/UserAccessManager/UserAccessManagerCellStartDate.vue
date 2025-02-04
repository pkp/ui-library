<template>
	<TableCell>
		<template v-for="(userGroups, i) in user.groups" :key="i">
			<div class="flex flex-col">
				{{ formatShortDate(userGroups?.startDate) }}
			</div>
		</template>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useDate} from '@/composables/useDate';

defineProps({
	user: {type: Object, required: true},
});
const {formatShortDate} = useDate();
</script>
