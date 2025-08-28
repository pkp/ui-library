<template>
	<SideModalBody>
		<template #title>
			{{ hasContent ? localize(workItem.title) : t('discussion.title') }}
		</template>
		<template v-if="!hasContent" #description>
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
			<PkpForm v-bind="form" @cancel="closeModal" @set="set" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {computed, inject} from 'vue';
import {t} from '@/utils/i18n';
import {useDiscussionManagerForm} from './useDiscussionManagerForm';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpForm from '@/components/Form/Form.vue';

const closeModal = inject('closeModal');

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
	autoAddTaskDetails: {
		type: Boolean,
		default: () => false,
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

const hasContent = computed(() => !!props.workItem?.id);

const {form, set, badgeProps} = useDiscussionManagerForm(props);
</script>
