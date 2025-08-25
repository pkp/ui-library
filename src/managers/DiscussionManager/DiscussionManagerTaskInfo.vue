<template>
	<div ref="taskInfoSectionRef">
		<FormGroupHeader
			:group-id="groupId"
			:label="t('discussion.form.taskInformation')"
			:description="taskInfoDescription"
		/>
		<div v-if="showStatusUpdateCheckbox" class="relative mt-6">
			<label class="flex-start flex cursor-pointer gap-2 text-lg-normal">
				<input
					v-model="statusUpdateValue"
					type="checkbox"
					name="statusUpdateValue"
				/>
				{{ statusUpdateLabel }}
			</label>
		</div>
		<div v-if="showTaskStartedInfo" class="mt-6 flex flex-col gap-y-4">
			<FormDisplayItemBasic
				heading-element="h2"
				:heading="t('task.startedBy')"
				:value="workItem?.startedBy"
			/>
			<FormDisplayItemBasic
				heading-element="h2"
				:heading="t('common.startDate')"
				:value="workItem?.startDate"
			/>
		</div>
	</div>
</template>

<script setup>
import {ref, watch, computed, onMounted, nextTick} from 'vue';
import {t} from '@/utils/i18n';
import FormDisplayItemBasic from '@/components/FormDisplay/FormDisplayItemBasic.vue';
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
	autoAddTaskDetails: {
		type: Boolean,
		default: () => false,
	},
});

const emit = defineEmits(['updateStatusCheckbox']);
const statusUpdateValue = ref(false);
const taskInfoSectionRef = ref(null);

const statusUpdateLabel = computed(() => {
	switch (props.workItem?.status) {
		case 'Pending':
			return t('task.startThisTask');
		case 'In Progress':
			return t('task.completeThisTask');
		default:
			return '';
	}
});

const showStatusUpdateCheckbox = computed(() => {
	return (
		props.inDisplayMode &&
		props.workItem?.type === 'Task' &&
		['Pending', 'In Progress'].includes(props.workItem?.status)
	);
});

const showTaskStartedInfo = computed(() => {
	return (
		props.workItem?.type === 'Task' &&
		['In Progress', 'Closed'].includes(props.workItem?.status)
	);
});

const taskInfoDescription = computed(() => {
	if (props.workItem?.type === 'Discussion' && props.inDisplayMode) {
		return `${t('discussion.form.taskInfoDescription')}<br />${t('discussion.form.taskInfoConvertToTask')}`;
	}

	return t('discussion.form.taskInfoDescription');
});

// emit the event to update the value of the checkbox
watch(statusUpdateValue, (val) => {
	emit('updateStatusCheckbox', val);
});

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
