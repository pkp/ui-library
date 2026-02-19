<template>
	<SideModalBody>
		<template #title>
			{{ displayTitle }}
		</template>
		<template #post-description>
			<div>
				<Badge v-bind="badgeProps" class="mt-1">
					{{ badgeProps.slot }}
				</Badge>
			</div>

			<Spinner v-if="isLoadingWorkItem"></Spinner>
		</template>
		<template
			v-if="discussionManagerStore.userHasWriteAccess({workItem})"
			#actions
		>
			<PkpButton
				:disabled="isWorkItemClosed || isLoadingWorkItem"
				@click="editForm"
			>
				{{ t('common.edit') }}
			</PkpButton>
		</template>

		<SideModalLayoutBasic>
			<PkpForm
				v-bind="form"
				field-heading-element="h2"
				:display-only="true"
				@cancel="closeModal"
				@set="set"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {computed, inject, watch} from 'vue';
import {t} from '@/utils/i18n';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useDiscussionManagerForm} from './useDiscussionManagerForm';
import {useDiscussionManagerStore} from './discussionManagerStore';
import {useDiscussionManagerActions} from './useDiscussionManagerActions';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

const props = defineProps({
	status: {
		type: String,
		default: () => 'New',
	},
	submission: {
		type: Object,
		required: true,
	},
	submissionStageId: {
		type: Number,
		required: true,
	},
	workItem: {
		type: Object,
		default: () => null,
	},
});

const closeModal = inject('closeModal');

const discussionManagerStore = useDiscussionManagerStore();
const discussionManagerActions = useDiscussionManagerActions();

const {apiUrl: taskApiUrl} = useUrl(
	`submissions/${encodeURIComponent(props.submission.id)}/tasks/${props.workItem.id}`,
);

const {
	data: workItemData,
	fetch: fetchTaskData,
	isLoading: isLoadingWorkItem,
} = useFetch(taskApiUrl);

fetchTaskData();

function finishedCallback() {
	fetchTaskData();
}

const {form, set, badgeProps, refreshFormData} = useDiscussionManagerForm(
	props,
	{
		inDisplayMode: true,
		refetchData: finishedCallback,
	},
);

function editForm() {
	discussionManagerActions.discussionEdit(
		{
			workItem: workItemData.value,
			submission: props.submission,
			submissionStageId: props.submissionStageId,
		},
		finishedCallback,
	);
}

const displayTitle = computed(() => {
	return workItemData.value?.title ?? props.workItem?.title ?? '';
});

const isWorkItemClosed = computed(() => {
	return !!workItemData.value?.dateClosed ?? !!props.workItem?.dateClosed;
});

watch(workItemData, (newVal, oldVal) => {
	if (newVal && newVal !== oldVal) {
		refreshFormData(newVal);
	}
});
</script>
