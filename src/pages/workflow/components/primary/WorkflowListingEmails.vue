<template>
	<div v-if="emails?.length" class="border border-light">
		<h3 class="lg-bold m-3 text-heading">
			{{ t('notification.notifications') }}
		</h3>
		<ul>
			<li
				v-for="email in emails"
				:key="email.id"
				class="flex items-center border-t border-light px-3 py-1"
			>
				<span class="flex-1 truncate">
					<a
						class="text cursor-pointer text-base-normal hover:underline"
						@click.prevent="openEmail(email.id)"
					>
						{{ email.subject }}
					</a>
				</span>
				<span class="ms-4 shrink-0 text-base-normal text-secondary">
					{{ formatShortDateTime(email.dateSent) }}
				</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
import {computed, watch} from 'vue';

import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {useDate} from '@/composables/useDate';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';

const props = defineProps({
	submission: {type: Object, required: true},
	selectedStageId: {type: Number, required: true},
});

const {t} = useLocalize();
const {formatShortDateTime} = useDate();
const {apiUrl} = useUrl('emails/authorEmails');

const requestQuery = computed(() => {
	if (props.selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
		return {
			submissionId: props.submission.id,
			eventType: pkp.const.EMAIL_LOG_EVENT_TYPE_EDITOR_NOTIFY_AUTHOR,
		};
	}
	return null;
});

const {data: emails, fetch: fetchEmails} = useFetch(apiUrl, {
	// currently only used in review stage, this can be extended if used across multiple stages
	query: {
		submissionId: props.submission.id,
		eventType: pkp.const.EMAIL_LOG_EVENT_TYPE_EDITOR_NOTIFY_AUTHOR,
	},
});

watch(
	requestQuery,
	(newRequestQuery) => {
		if (newRequestQuery) {
			fetchEmails();
		}
	},
	{immediate: true},
);

function openEmail(emailId) {
	const {openSideModal} = useModal();

	//en/authorDashboard/readSubmissionEmail?submissionId=19&stageId=3&reviewRoundId=13&submissionEmailId=158
	//en/authorDashboard/readSubmissionEmail?submissionId19&submissionEmailId=158
	const {pageUrl} = useUrl(
		`authorDashboard/readSubmissionEmail?submissionId=${props.submission.id}&submissionEmailId=${emailId}`,
	);

	openSideModal('LegacyAjax', {
		legacyOptions: {
			title: t('notification.notifications'),
			url: pageUrl,
		},
	});
}
</script>
