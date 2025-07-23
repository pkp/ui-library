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
			<PkpForm v-bind="form" @cancel="onCloseFn" @set="set" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpForm from '@/components/Form/Form.vue';

import {t} from '@/utils/i18n';
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

const {form, set, badgeProps} = useDiscussionManagerForm(props);
</script>
