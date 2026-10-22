<template>
	<div>
		<FormGroupHeader
			:group-id="headerId"
			:label="authorResponse.submittedByUser.fullName"
		/>
		<p class="text-lg-normal text-secondary">{{ description }}</p>
		<Notification v-if="authorResponse.createdAt" class="mt-6">
			<div class="flex flex-wrap items-baseline gap-x-1 text-lg-normal">
				<h2 class="text-lg-bold">
					{{
						t('semicolon', {
							label: t('submission.reviewRound.authorResponse.submittedOn'),
						})
					}}
				</h2>
				<span>{{ formatShortDateTime(authorResponse.createdAt) }}</span>
			</div>
		</Notification>
	</div>
</template>

<script setup>
import {useId} from 'vue';
import {t} from '@/utils/i18n';
import {useDate} from '@/composables/useDate';

import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';
import Notification from '@/components/Notification/Notification.vue';

const props = defineProps({
	authorResponse: {type: Object, required: true},
	inDisplayMode: {type: Boolean, default: false},
});

const {formatShortDateTime} = useDate();

const headerId = useId();

const description = props.inDisplayMode
	? t('submission.reviewRound.authorResponse.readConfirmation')
	: t('submission.reviewRound.authorResponse.modify.description');
</script>
