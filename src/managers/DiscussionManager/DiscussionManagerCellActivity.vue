<template>
	<TableCell>
		<div class="flex flex-col items-start">
			<ol
				v-if="recentNotePostedActivity && groupedActivities.length > 1"
				class="list-outside list-decimal pl-5"
			>
				<li
					v-for="activity in groupedActivities"
					:key="activity"
					class="my-1 text-wrap text-base-normal"
				>
					{{ activity }}
				</li>
			</ol>
			<span v-else class="my-1 text-wrap text-base-normal">
				{{ workItem.latestActivities?.[0]?.message }}
			</span>
		</div>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import {useDate} from '@/composables/useDate';
import TableCell from '@/components/Table/TableCell.vue';

const props = defineProps({workItem: {type: Object, required: true}});
const {isWithinDays} = useDate();

const recentNotePostedActivity = computed(() => {
	return props.workItem?.latestActivities?.find(
		(activity) =>
			activity.type === pkp.const.SUBMISSION_LOG_TASK_NOTE_POSTED &&
			isWithinDays(activity.date, 7),
	);
});

const groupedActivities = computed(() => {
	return [
		recentNotePostedActivity.value?.message,
		props.workItem.latestActivities?.find(
			(activity) => activity.type !== pkp.const.SUBMISSION_LOG_TASK_NOTE_POSTED,
		)?.message,
	].filter(Boolean);
});
</script>
