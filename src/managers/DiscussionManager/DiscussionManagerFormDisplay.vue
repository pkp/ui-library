<template>
	<SideModalBody>
		<template #title>
			{{ localize(workItem.title) }}
		</template>
		<template #post-description>
			<Badge v-bind="badgeProps" class="mt-1">
				{{ badgeProps.slot }}
			</Badge>
		</template>
		<template v-if="allowEdit" #actions>
			<PkpButton @click="editForm">{{ t('common.edit') }}</PkpButton>
		</template>

		<SideModalLayoutBasic>
			<FormDisplay
				v-bind="form"
				field-heading-element="h2"
				:contains-form="true"
				@cancel="closeModal"
				@set="set"
			/>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {computed, inject} from 'vue';
import {t} from '@/utils/i18n';
import {useDiscussionManagerForm} from './useDiscussionManagerForm';
import {useDiscussionManagerStore} from './discussionManagerStore';
import {
	Actions as DiscussionManagerActions,
	useDiscussionManagerActions,
} from './useDiscussionManagerActions';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import Badge from '@/components/Badge/Badge.vue';
import FormDisplay from '@/components/FormDisplay/FormDisplay.vue';
import PkpButton from '@/components/Button/Button.vue';

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
	onCloseFn: {
		type: Function,
		default: () => () => {},
	},
	onSubmitFn: {
		type: Function,
		default: () => () => {},
	},
});

const closeModal = inject('closeModal');

const discussionManagerStore = useDiscussionManagerStore();
const discussionManagerActions = useDiscussionManagerActions();

const {form, set, badgeProps} = useDiscussionManagerForm(props, {
	inDisplayMode: true,
});

function editForm() {
	discussionManagerActions.discussionEdit({
		workItem: props.workItem,
		submission: props.submission,
		submissionStageId: props.submissionStageId,
	});
}

const permittedActions =
	discussionManagerStore.discussionConfig?.permittedActions;

const allowEdit = computed(() => {
	return permittedActions?.includes(
		DiscussionManagerActions.TASKS_AND_DISCUSSIONS_EDIT,
	);
});
</script>
