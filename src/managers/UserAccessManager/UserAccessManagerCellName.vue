<template>
	<TableCell>
		<span class="text-base-normal">
			{{ user.fullName }}
		</span>

		<Icon v-if="user.orcid" icon="Orcid" class="h-4 w-4" :inline="true" />
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';

defineProps({
	user: {type: Object, required: true},
});
</script>
