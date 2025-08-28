<template>
	<FormGroupHeader
		:group-id="groupId"
		:label="t('submission.discussion')"
		:description="t('discussion.form.discussionDescription')"
	/>
	<div v-if="showCloseDiscussion" class="relative mt-6">
		<label class="flex-start flex cursor-pointer gap-2 text-lg-normal">
			<input
				v-model="statusUpdateValue"
				type="checkbox"
				name="statusUpdateValue"
			/>
			{{ t('discussion.closeThisDiscussion') }}
		</label>
	</div>
</template>

<script setup>
import {ref, watch, computed} from 'vue';
import {t} from '@/utils/i18n';
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
});

const emit = defineEmits(['updateStatusCheckbox']);
const statusUpdateValue = ref(props.workItem?.status === 'Closed');

const showCloseDiscussion = computed(() => {
	return props.inDisplayMode && props.workItem?.type === 'Discussion';
});

// emit the event to update the value of the checkbox
watch(statusUpdateValue, (val) => {
	emit('updateStatusCheckbox', val);
});
</script>
