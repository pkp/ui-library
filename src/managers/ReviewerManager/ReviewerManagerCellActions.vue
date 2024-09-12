<template>
	<TableCell>
		<DropdownActions
			:label="t('common.moreActions')"
			:display-as-ellipsis="true"
			:actions="itemActions"
			@action="handleAction"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/TableNext/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useReviewerManagerStore} from './reviewerManagerStore';
import {computed} from 'vue';
const props = defineProps({
	reviewAssignment: {type: Object, required: true},
	submission: {type: Object, required: true},
});

const reviewerManagerStore = useReviewerManagerStore();

const itemActions = computed(() =>
	reviewerManagerStore.getItemActions({
		reviewAssignment: props.reviewAssignment,
	}),
);

function handleAction(actionName) {
	reviewerManagerStore.handleAction(actionName, {
		reviewAssignment: props.reviewAssignment,
	});
}
</script>
