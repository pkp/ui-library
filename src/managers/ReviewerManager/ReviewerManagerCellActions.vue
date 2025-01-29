<template>
	<TableCell>
		<DropdownActions
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			@action="handleAction"
		/>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useReviewerManagerStore} from './reviewerManagerStore';
import {computed} from 'vue';
const props = defineProps({
	reviewAssignment: {type: Object, required: true},
	submission: {type: Object, required: true},
	redactedForAuthors: {type: Boolean, required: true},
});

const reviewerManagerStore = useReviewerManagerStore();

const itemActions = computed(() =>
	reviewerManagerStore.getItemActions({
		reviewAssignment: props.reviewAssignment,
		redactedForAuthors: props.redactedForAuthors,
	}),
);

function handleAction(actionName) {
	reviewerManagerStore[actionName]({reviewAssignment: props.reviewAssignment});
}
</script>
