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
			<transition>
				<div v-if="isLoadingTemplate" class="app__loading">
					<div class="app__loading__content">
						<Spinner></Spinner>
						{{ t('common.loading') }}
					</div>
				</div>
			</transition>
			<PkpForm v-bind="form" novalidate @cancel="closeModal" @set="set" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {inject} from 'vue';
import {t} from '@/utils/i18n';
import {useDiscussionManagerForm} from './useDiscussionManagerForm';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import Badge from '@/components/Badge/Badge.vue';
import PkpForm from '@/components/Form/Form.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

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
});

const {form, set, badgeProps, isLoadingTemplate} =
	useDiscussionManagerForm(props);
</script>
