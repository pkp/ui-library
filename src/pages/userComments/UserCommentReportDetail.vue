<template>
	<div>
		<SideModalBody>
			<template #title>{{ t('manager.userComment.reportDetails') }}</template>
			<SideModalLayoutBasic>
				<div class="p-6 shadow">
					<div class="mb-4 flex items-center">
						<InitialsAvatar :initials="report.userInitials" />
						<div class="ml-2">
							<p class="font-semibold">{{ report.userName }}</p>
							<p>
								{{ formatShortDate(report.createdAt) }}
							</p>
						</div>
					</div>
					<p
						v-strip-unsafe-html="report.note"
						class="font-bold text-negative"
					></p>
				</div>

				<p class="mt-4">{{ t('manager.userComment.reportedComment') }}</p>
				<div class="mt-2 border-t pt-4 text-base-normal">
					<div class="mb-3 flex">
						<InitialsAvatar :initials="comment.userInitials" :shrink="true" />
						<div class="ml-2">
							<p>
								{{ comment.userName }}
							</p>
							<p>
								{{ formatShortDate(comment.createdAt) }}
							</p>
						</div>
					</div>
					<p v-strip-unsafe-html="comment.commentText"></p>
				</div>
			</SideModalLayoutBasic>
		</SideModalBody>
	</div>
</template>

<script setup>
defineProps({
	comment: {
		type: Object,
		required: true,
	},
	report: {
		type: Object,
		required: true,
	},
});

import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import InitialsAvatar from '@/components/InitialsAvatar/InitialsAvatar.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import {useDate} from '@/composables/useDate';

const {formatShortDate} = useDate();
</script>
