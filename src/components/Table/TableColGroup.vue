<template>
	<th
		:id="groupId"
		:colspan="tableContext.columnsCount.value"
		scope="colgroup"
		class="whitespace-nowrap border-b border-light bg-tertiary px-2 py-4 text-start text-lg-medium text-secondary first:border-s first:ps-3 last:border-e last:pe-3"
	>
		<slot />
	</th>
</template>

<script setup>
import {inject} from 'vue';
const tableContext = inject('tableContext');
const groupId = inject('groupId', null);
</script>
