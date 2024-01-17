<template>
	<SideModalBody>
		<template #title>
			<h1>{{ t('reviewer.submission.reviewRound.info.history') }}</h1>
		</template>
		<template v-if="store.submission" #description>
			<h2>
				{{ t(
					'reviewer.submission.reviewRound.info.modal.title',
					{reviewRoundNumber: store.reviewRoundNumber, submissionTitle: localize(store.submission.publications[0].title)}
				) }}
			</h2>
		</template>
		<div class="p-4">
			<div class="bg-lightest p-5">
				<div v-if="isReviewAssignmentDeclined">
					<Panel v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('reviewer.submission.reviewDeclineDate') }}</h2>
							</template>
							<p>{{ formatShortDate(dateConfirmed) }}</p>
						</PanelSection>
					</Panel>

					<Panel v-if="declinedEmail" v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('reviewer.submission.emailLog') }}</h2>
							</template>
							<p>{{ declinedEmail.subject }}<br />{{ declinedEmail.body }}</p>
						</PanelSection>
					</Panel>
					<p v-else>{{ t('reviewer.submission.emailLog.defaultMessage') }}</p>
				</div>
				<div v-else>
					<Panel v-if="recommendation" v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('reviewer.article.recommendation') }}</h2>
							</template>
							<p>{{ recommendation }}</p>
						</PanelSection>
					</Panel>

					<Panel v-if="reviewComments.length" v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('reviewer.submission.comments.review') }}</h2>
							</template>
							<p v-for="reviewComment in reviewComments">
								<b v-if="reviewComment.isViewable">{{ t('reviewer.submission.comments.authorAndEditor') }}</b>
								<b v-else>{{ t('reviewer.submission.comments.editorOnly') }}</b>
								{{ reviewComment.content }}
							</p>
						</PanelSection>
					</Panel>

					<Panel v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('manager.setup.generalInformation') }}</h2>
							</template>
							<List>
								<ListItem>
									<b>{{ t('reviewer.submission.reviewRequestDate') }}:</b> {{ formatShortDate(dateNotified) }}
								</ListItem>
								<ListItem>
									<b>{{ t('reviewer.submission.responseDueDate') }}:</b> {{ formatShortDate(dateResponseDue) }}
								</ListItem>
								<ListItem>
									<b>{{ t('reviewer.submission.reviewDueDate') }}:</b> {{ formatShortDate(dateDue) }}
								</ListItem>
								<ListItem>
									<b>{{ t('common.dateCompleted') }}:</b> {{ formatShortDate(dateCompleted) }}
								</ListItem>
							</List>
						</PanelSection>
					</Panel>

					<div v-if="hasAttachments" class="mb-4">
						<p>TODO: display attachments grid</p>
					</div>

					<div v-if="hasFiles" class="mb-4">
						<p>TODO: display files grid</p>
					</div>
				</div>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import {useTranslation} from '@/composables/useTranslation';
import {useRoundHistoryModalStore} from './roundHistoryModalStore';
import moment from 'moment';
import List from "@/components/List/List.vue";
import ListItem from "@/components/List/ListItem.vue";

function formatShortDate(dateString) {
	return moment(dateString).format('YYYY-MM-DD');
}

const isReviewAssignmentDeclined = false;
const reviewComments = [
	{'isViewable': true, 'content': 'Comment #1'},
	{'isViewable': false, 'content': 'Comment #2'},
	{'isViewable': true, 'content': 'Comment #3'},
];
const dateConfirmed = '2024-12-25 12:00:00';
const dateNotified = '2024-01-17 12:00:00';
const dateResponseDue = '2023-06-24 12:00:00';
const dateDue = '2025-12-31 12:00:00';
const dateCompleted = '2025-02-14 12:00:00';
const hasAttachments = true;
const hasFiles = true;
const declinedEmail = {'subject': 'Email Subject', 'body': 'Email Body'};
const recommendation = "This is the recommendation";

const panelOptions = { stack: true };

const props = defineProps({
	submissionId: {type: Number, required: true},
	reviewRoundId: {type: Number, required: true},
	reviewRoundNumber: {type: Number, required: true},
});

const {t, localize} = useTranslation();

const store = useRoundHistoryModalStore(props);
</script>
