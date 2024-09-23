<template>
	<TableCell>
		<div class="flex flex-col">
			<component
				:is="Components[item.component] || item.component"
				v-for="(item, index) in cellStatusItems"
				:key="index"
				v-bind="item?.props || {}"
			></component>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {useReviewerManagerStore} from './reviewerManagerStore';
import ReviewerManagerCellStatusInfo from './ReviewerManagerCellStatusInfo.vue';
import {computed} from 'vue';

const Components = {ReviewerManagerCellStatusInfo};

const props = defineProps({
	reviewAssignment: {type: Object, required: true},
	submission: {type: Object, required: true},
	redactedForAuthors: {type: Boolean, required: true},
});

const cellStatusItems = computed(() => {
	return reviewerManagerStore.getCellStatusItems({
		reviewAssignment: props.reviewAssignment,
	});
});

const reviewerManagerStore = useReviewerManagerStore();
</script>
