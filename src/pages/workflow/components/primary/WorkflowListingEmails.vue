<template>
	<div v-if="emails?.length" class="border border-light p-4">
		<ul>
			<li v-for="email in emails" :key="email.id">
				<span>
					<PkpButton is-link @click="openEmail(email.id)">
						{{ email.subject }}
					</PkpButton>
				</span>
				<span>{{ formatShortDate(email.dateSent) }}</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
import {computed, watch} from 'vue';
import PkpButton from '@/components/Button/Button.vue';

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
const {formatShortDate} = useDate();
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
