<template>
	<TableCell>
		<DropdownActions
			v-if="itemActions.length"
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			@action="(actionName) => discussionManagerStore[actionName]({workItem})"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {computed} from 'vue';
import {useDiscussionManagerStore} from './discussionManagerStore';

const props = defineProps({
	workItem: {type: Object, required: true},
});

import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const discussionManagerStore = useDiscussionManagerStore();

const itemActions = computed(() =>
	discussionManagerStore.getItemActions({workItem: props.workItem}),
);
</script>
