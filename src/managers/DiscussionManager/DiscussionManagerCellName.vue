<template>
	<TableCell :fit-content="true">
		<div class="flex flex-col items-start py-2 text-start">
			<span class="flex gap-x-2 text-base-normal">
				<Icon :icon="workItemType.icon" class="h-4 w-4"></Icon>
				{{ workItemType.type }}
			</span>
			<div class="-ms-3">
				<PkpButton :is-link="true">
					{{ workItem.title.en }}
				</PkpButton>
			</div>
			<span>{{ workItemType.owner }}: {{ workItem.owner }}</span>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';
import PkpButton from '@/components/Button/Button.vue';

const props = defineProps({
	workItem: {type: Object, required: true},
});

const workItemType =
	props.workItem.mode === 'task'
		? {type: 'Task', icon: 'FileText', owner: 'Task Owner'}
		: {type: 'Discussion', icon: 'Comment', owner: 'Created by'};
</script>
