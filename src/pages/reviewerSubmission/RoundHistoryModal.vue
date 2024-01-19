<template>
	<SideModalBody v-if="store.reviewRoundHistory">
		<template #title>
			<h1>{{ t('reviewer.submission.reviewRound.info.history') }}</h1>
		</template>
		<template v-if="store.reviewRoundHistory.publicationTitle" #description>
			<h2>
				{{ t(
					'reviewer.submission.reviewRound.info.modal.title',
					{reviewRoundNumber: store.reviewRoundNumber, submissionTitle: store.reviewRoundHistory.publicationTitle}
				) }}
			</h2>
		</template>
		<div class="p-4">
			<div class="bg-lightest p-5">
				<div v-if="store.reviewRoundHistory.reviewAssignment.declined">
					<Panel v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('reviewer.submission.reviewRound.reviewDeclineDate') }}</h2>
							</template>
							<p>{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateConfirmed) }}</p>
						</PanelSection>
					</Panel>

					<Panel v-if="store.reviewRoundHistory.declineEmail" v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('reviewer.submission.reviewRound.emailLog') }}</h2>
							</template>
							<p v-html="store.reviewRoundHistory.declineEmail.subject" class="mb-4 font-bold"></p>
							<hr class="opacity-50">
							<p v-html="store.reviewRoundHistory.declineEmail.body" class="mt-4"></p>
						</PanelSection>
					</Panel>
					<p v-else>{{ t('reviewer.submission.reviewRound.emailLog.defaultMessage') }}</p>
				</div>
				<div v-else>
					<Panel v-if="store.reviewRoundHistory.reviewAssignment.recommendation" v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('reviewer.article.recommendation') }}</h2>
							</template>
							<p>{{ store.reviewRoundHistory.reviewAssignment.recommendation }}</p>
						</PanelSection>
					</Panel>

					<Panel v-if="store.reviewRoundHistory.comments.length || store.reviewRoundHistory.privateComments.length" v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('reviewer.submission.reviewRound.comments.review') }}</h2>
							</template>
							<PanelSection v-if="store.reviewRoundHistory.comments.length">
								<template #header>
									<h3>{{ t('reviewer.submission.reviewRound.comments.authorAndEditor') }}</h3>
								</template>
								<p v-for="reviewComment in store.reviewRoundHistory.comments">
									{{ reviewComment }}
								</p>
							</PanelSection>
							<PanelSection v-if="store.reviewRoundHistory.privateComments.length">
								<template #header>
									<h3>{{ t('reviewer.submission.reviewRound.comments.editorOnly') }}</h3>
								</template>
								<p v-for="reviewComment in store.reviewRoundHistory.privateComments">
									{{ reviewComment }}
								</p>
							</PanelSection>
						</PanelSection>
					</Panel>

					<Panel v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('manager.setup.generalInformation') }}</h2>
							</template>
							<List>
								<ListItem>
									<p class="inline pr-2 font-bold">{{ t('reviewer.submission.reviewRequestDate') }}</p>{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateNotified) }}
								</ListItem>
								<ListItem>
									<p class="inline pr-2 font-bold">{{ t('reviewer.submission.responseDueDate') }}</p>{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateResponseDue) }}
								</ListItem>
								<ListItem>
									<p class="inline pr-2 font-bold">{{ t('reviewer.submission.reviewDueDate') }}</p>{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateDue) }}
								</ListItem>
								<ListItem>
									<p class="inline pr-2 font-bold">{{ t('common.dateCompleted') }}</p>{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateCompleted) }}
								</ListItem>
							</List>
						</PanelSection>
					</Panel>

					<div class="mb-4">
						<p>TODO: display attachments grid</p>
					</div>

					<div v-if="store.reviewRoundHistory.displayFiles" class="mb-4">
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

const panelOptions = { stack: true };

const props = defineProps({
	submissionId: {type: Number, required: true},
	reviewRoundId: {type: Number, required: true},
	reviewRoundNumber: {type: Number, required: true},
});

const {t, localize} = useTranslation();

const store = useRoundHistoryModalStore(props);
</script>
