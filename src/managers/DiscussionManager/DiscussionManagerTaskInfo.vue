<template>
	<div ref="taskInfoSectionRef">
		<FormGroupHeader
			:group-id="groupId"
			:label="t('discussion.form.taskInformation')"
			:description="taskInfoDescription"
		/>
		<div v-if="showStatusUpdateCheckbox" class="relative mt-6">
			<label
				class="flex-start flex cursor-pointer gap-2 text-lg-normal"
				:class="isStatusClosed && 'text-disabled'"
			>
				<input
					v-model="statusUpdateValue"
					type="checkbox"
					name="statusUpdateValue"
					:disabled="isStatusClosed"
				/>
				{{ statusUpdateLabel }}
			</label>
		</div>
		<div v-if="showTaskStartedInfo" class="mt-6 flex flex-col gap-y-4">
			<FormDisplayItemBasic
				heading-element="h2"
				:heading="t('task.startedBy')"
				:value="workItem?.startedByName"
			/>
			<FormDisplayItemBasic
				heading-element="h2"
				:heading="t('common.startDate')"
				:value="workItem?.dateStarted"
			/>
		</div>
	</div>
</template>

<script setup>
import {ref, watch, computed, onMounted, nextTick} from 'vue';
import {t} from '@/utils/i18n';
import FormDisplayItemBasic from '@/components/Form/display/FormDisplayItemBasic.vue';
import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';

const props = defineProps({
	/** The groupId to use from FormGroup component */
	groupId: {
		type: String,
		required: true,
	},
	workItem: {
		type: Object,
		required: true,
	},
	inDisplayMode: {
		type: Boolean,
		required: true,
	},
	statusValue: {
		type: Boolean,
		default: () => false,
	},
	autoAddTaskDetails: {
		type: Boolean,
		default: () => false,
	},
});

const emit = defineEmits(['updateStatusCheckbox']);
const statusUpdateValue = ref(props.statusValue);
const taskInfoSectionRef = ref(null);
const isTask = computed(
	() => props.workItem?.type === pkp.const.EDITORIAL_TASK_TYPE_TASK,
);

const isStatusClosed = computed(() => {
	return props.workItem?.status === pkp.const.EDITORIAL_TASK_STATUS_CLOSED;
});

const showStatusUpdateCheckbox = computed(() => {
	return props.inDisplayMode && isTask.value;
});

const statusUpdateLabel = computed(() => {
	return props.workItem?.status === pkp.const.EDITORIAL_TASK_STATUS_PENDING
		? t('task.startThisTask')
		: t('task.completeThisTask');
});

const showTaskStartedInfo = computed(() => {
	return (
		props.inDisplayMode &&
		isTask.value &&
		[
			pkp.const.EDITORIAL_TASK_STATUS_IN_PROGRESS,
			pkp.const.EDITORIAL_TASK_STATUS_CLOSED,
		].includes(props.workItem?.status)
	);
});

const taskInfoDescription = computed(() => {
	if (!isTask.value && props.inDisplayMode) {
		if (props.workItem?.status === pkp.const.EDITORIAL_TASK_STATUS_CLOSED) {
			return `${t('discussion.form.taskInfoDescription')}<br />${t('discussion.form.taskInfoReopenAndConvertToTask')}`;
		}

		return `${t('discussion.form.taskInfoDescription')}<br />${t('discussion.form.taskInfoConvertToTask')}`;
	}

	return t('discussion.form.taskInfoDescription');
});

// emit the event to update the value of the checkbox
watch(statusUpdateValue, (val) => {
	emit('updateStatusCheckbox', val);
});

// update the checkbox state if statusValue from props changes
watch(
	() => props.statusValue,
	(val) => {
		statusUpdateValue.value = val;
	},
);

// When "Add Task Details" is clicked on the listing, focus of the form should be put to the Task Information section
onMounted(async () => {
	if (props.autoAddTaskDetails) {
		await nextTick();
		taskInfoSectionRef.value?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}
});
</script>
