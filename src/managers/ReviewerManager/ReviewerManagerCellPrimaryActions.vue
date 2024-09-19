<template>
	<TableCell>
		<div class="-ms-3 flex flex-col">
			<PkpButton
				v-for="item in itemPrimaryActions"
				:key="item.name"
				is-link
				@click="handleAction(item.name)"
			>
				{{ item.label }}
			</PkpButton>
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useReviewerManagerStore} from './reviewerManagerStore';
import {computed} from 'vue';
const props = defineProps({
	reviewAssignment: {type: Object, required: true},
	submission: {type: Object, required: true},
	redactedForAuthors: {type: Boolean, required: true},
});

const reviewerManagerStore = useReviewerManagerStore();

const itemPrimaryActions = computed(() =>
	reviewerManagerStore.getItemPrimaryActions({
		reviewAssignment: props.reviewAssignment,
		redactedForAuthors: props.redactedForAuthors,
	}),
);

function handleAction(actionName) {
	reviewerManagerStore[actionName]({
		reviewAssignment: props.reviewAssignment,
	});
}
</script>
