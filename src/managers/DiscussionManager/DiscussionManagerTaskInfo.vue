<template>
	<div class="relative mb-4 mt-1">
		<label class="flex-start flex cursor-pointer gap-2 text-lg-normal">
			<input v-model="selectedValue" type="checkbox" name="taskInfoAdd" />
			{{ t('discussion.form.taskInfoLabel') }}
		</label>
	</div>

	<FormGroupHeader
		v-if="selectedValue"
		:label="t('discussion.form.taskInformation')"
		:description="t('discussion.form.taskInfoDescription')"
	/>
</template>

<script setup>
import {ref, watch} from 'vue';
import {t} from '@/utils/i18n';
import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';

const emit = defineEmits(['addTaskInfo']);
const props = defineProps({
	/** If the task information is checked */
	isChecked: {
		type: Boolean,
		default: false,
	},
});
const selectedValue = ref(props.isChecked);

// emit the event to update the value of the checkbox
watch(selectedValue, (val) => {
	emit('addTaskInfo', val);
});

// update the selected value when the prop changes
watch(
	() => props.isChecked,
	(val) => {
		selectedValue.value = val;
	},
);
</script>
