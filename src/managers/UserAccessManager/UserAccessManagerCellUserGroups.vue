<template>
	<TableCell>
		<template v-for="(userGroups, i) in user.groups" :key="i">
			<div class="flex flex-col">
				{{ !userGroups.dateEnd ? userGroups.name : '' }}
			</div>
		</template>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

defineProps({
	user: {type: Object, required: true},
});
</script>
