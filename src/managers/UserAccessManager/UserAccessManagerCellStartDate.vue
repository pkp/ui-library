<template>
	<TableCell>
		<template v-for="(userGroups, i) in user.groups" :key="i">
			<div class="flex flex-col">
				{{
					!userGroups.dateEnd
						? userGroups?.dateStart && formatShortDate(userGroups?.dateStart)
						: ''
				}}
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
