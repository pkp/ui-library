<template>
	<SideModalBody>
		<template #title>
			{{ t('tasks.discussions.form.title') }}
		</template>
		<template #description>
			<span class="text-lg-medium">
				{{ t('tasks.discussions.form.description') }}
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
import {useDiscussionManagerForm} from './useDiscussionManagerForm';

const props = defineProps({
	status: {
		type: String,
		default: () => 'New',
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

const {form, set, badgeProps} = useDiscussionManagerForm(
	props.status,
	props.onCloseFn,
	props.onSubmitFn,
);
</script>
