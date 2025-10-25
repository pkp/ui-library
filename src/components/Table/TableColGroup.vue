<template>
	<th
		:colspan="tableContext.columnsCount.value"
		scope="rowgroup"
		class="whitespace-nowrap border-b border-light bg-tertiary p-2 text-start text-lg-medium text-secondary first:border-s first:ps-3 last:border-e last:pe-3"
	>
		<div class="flex w-full items-center gap-2">
			<slot />

			<div v-if="$slots.action" class="ms-auto">
				<slot name="action" :group-id="groupId" />
			</div>
		</div>
	</th>
</template>

<script setup>
import {inject} from 'vue';
const tableContext = inject('tableContext');
</script>
