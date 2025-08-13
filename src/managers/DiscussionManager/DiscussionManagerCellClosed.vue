<template>
	<TableCell>
		<div class="flex items-center text-primary">
			<button
				type="button"
				class="m-0 border-0 bg-transparent p-0 outline-none focus:outline-none"
				:aria-pressed="props.workItem?.closed"
				@click="discussionManagerStore.discussionSetClosed({workItem})"
			>
				<Icon :icon="icon" class="h-5 w-5"></Icon>
			</button>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';

import {useDiscussionManagerStore} from './discussionManagerStore';

const discussionManagerStore = useDiscussionManagerStore();

const props = defineProps({workItem: {type: Object, required: true}});
const icon = props.workItem?.closed ? 'CheckboxTicked' : 'Checkbox';
</script>
