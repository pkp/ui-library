<template>
	<SideModalBody>
		<template #title>
			{{ t('discussion.title') }}
		</template>
		<template #description>
			<span class="text-lg-medium">
				{{ t('discussion.form.description') }}
			</span>
		</template>
		<template #post-description>
			<Badge v-bind="badgeProps" class="mt-1">
				{{ badgeProps.slot }}
			</Badge>
		</template>

		<SideModalLayoutBasic>
			<PkpForm v-bind="form" @cancel="onCloseFn" @set="set">
				<template #group-layout="{groupData}">
					<template v-if="groupData.id === 'details'">
						<DiscussionManagerTemplates
							:templates="templates"
							@on-event="detailsForm.selectTemplate"
						/>
					</template>
					<template v-if="groupData.id === 'taskInformation'">
						<DiscussionManagerTaskInfo
							:is-checked="taskForm.isTask"
							@add-task-info="taskForm.onAddTaskInfo"
						/>
					</template>
				</template>
			</PkpForm>
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import DiscussionManagerTemplates from './DiscussionManagerTemplates.vue';
import DiscussionManagerTaskInfo from './DiscussionManagerTaskInfo.vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useDiscussionManagerForm} from './useDiscussionManagerForm';

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
	onCloseFn: {
		type: Function,
		default: () => () => {},
	},
	onSubmitFn: {
		type: Function,
		default: () => () => {},
	},
});

const {form, set, badgeProps, templates, detailsForm, taskForm} =
	useDiscussionManagerForm(props);
</script>
