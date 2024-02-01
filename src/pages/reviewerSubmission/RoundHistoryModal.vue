<template>
	<SideModalBody v-if="store.reviewRoundHistory">
		<template v-if="store.reviewRoundHistory.reviewAssignment" #pre-title>
			{{ store.reviewRoundHistory.reviewAssignment.submissionId }}
		</template>
		<template #title>
			<h1 class="underline">
				{{ t('reviewer.submission.reviewRound.info.modal.title', {round: store.reviewRoundNumber}) }}
			</h1>
		</template>
		<template v-if="store.reviewRoundHistory.publicationTitle" #description>
			{{ store.reviewRoundHistory.publicationTitle }}
		</template>
		<SideModalLayout2Columns>
			<template #left>
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
					<Panel v-if="store.reviewRoundHistory.recommendation" v-bind="panelOptions" class="mb-4">
						<PanelSection>
							<template #header>
								<h2>{{ t('reviewer.article.recommendation') }}</h2>
							</template>
							<p>{{ store.reviewRoundHistory.recommendation }}</p>
						</PanelSection>
					</Panel>

					<div v-if="store.reviewRoundHistory.comments.length || store.reviewRoundHistory.privateComments.length" class="border border-light mb-4">
						<div class="border-b border-light p-4">
							<h2 class="text-2xl-bold">{{ t('reviewer.submission.reviewRound.comments') }}</h2>
						</div>
						<div v-if="store.reviewRoundHistory.comments.length" class="border-b border-light p-4">
							<h2 class="text-xl-bold text-light mb-4">{{ t('reviewer.submission.reviewRound.comments.authorAndEditor') }}</h2>
							<p v-for="(reviewComment, index) in store.reviewRoundHistory.comments">
								<span class="text-xl-bold">{{ t('reviewer.submission.reviewRound.comments.prefix', {index: index + 1}) }}</span>
								<span v-html="reviewComment"></span>
							</p>
						</div>
						<div v-if="store.reviewRoundHistory.privateComments.length" class="p-4">
							<h2 class="text-xl-bold text-light mb-4">{{ t('reviewer.submission.reviewRound.comments.editorOnly') }}</h2>
							<p v-for="(reviewComment, index) in store.reviewRoundHistory.privateComments">
								<span class="text-xl-bold">{{ t('reviewer.submission.reviewRound.comments.prefix', {index: index + 1}) }}</span>
								<span v-html="reviewComment"></span>
							</p>
						</div>
					</div>

					<ListingFilesListPanel
						v-if="store.reviewRoundHistory.attachments.length"
						class="mb-4"
						:title="t('reviewer.submission.reviewRound.attachments')"
						:description="t('reviewer.submission.reviewRound.attachments.description')"
						:files="store.reviewRoundHistory.attachments"
					></ListingFilesListPanel>

					<ListingFilesListPanel
						v-if="store.reviewRoundHistory.files.length"
						:title="t('reviewer.submission.reviewRound.files')"
						:description="t('reviewer.submission.reviewRound.files.description')"
						:files="store.reviewRoundHistory.files"
					></ListingFilesListPanel>
				</div>
			</template>
			<template #right1>
				<div class="text-xl-bold">{{ t('reviewer.submission.reviewRound.metadata') }}</div>
				<div v-if="store.reviewRoundHistory.publicationType" class="mt-4">
					<div class="text-lg-bold">{{ t('reviewer.submission.reviewRound.metadata.type') }}:</div>
					<div class="text-base-normal mt-1">{{ store.reviewRoundHistory.publicationType }}</div>
				</div>
				<div v-if="store.reviewRoundHistory.publicationAbstract" class="mt-4">
					<div class="text-lg-bold">{{ t('reviewer.submission.reviewRound.metadata.abstract') }}:</div>
					<div v-html="store.reviewRoundHistory.publicationAbstract" class="text-base-normal mt-1"></div>
				</div>
				<div v-if="store.reviewRoundHistory.publicationKeywords" class="mt-4">
					<div class="text-lg-bold">{{ t('reviewer.submission.reviewRound.metadata.keywords') }}:</div>
					<div class="text-base-normal mt-1">{{ store.reviewRoundHistory.publicationKeywords }}</div>
				</div>
			</template>
			<template v-if="store.reviewRoundHistory.reviewAssignment" #right2>
				<div class="text-xl-bold">
					{{ t('reviewer.submission.reviewRound.general') }}
				</div>
				<div v-if="store.reviewRoundHistory.reviewAssignment.dateNotified" class="mt-4">
					<div class="text-lg-bold">{{ t('reviewer.submission.reviewRequestDate') }}:</div>
					<div class="text-base-normal mt-1">{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateNotified) }}</div>
				</div>
				<div v-if="store.reviewRoundHistory.reviewAssignment.dateResponseDue" class="mt-4">
					<div class="text-lg-bold">{{ t('reviewer.submission.responseDueDate') }}:</div>
					<div class="text-base-normal mt-1">{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateResponseDue) }}</div>
				</div>
				<div v-if="store.reviewRoundHistory.reviewAssignment.dateConfirmed" class="mt-4">
					<div class="text-lg-bold">{{ t('reviewer.submission.acceptedOn') }}:</div>
					<div class="text-base-normal mt-1">{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateConfirmed) }}</div>
				</div>
				<div v-if="store.reviewRoundHistory.reviewAssignment.dateDue" class="mt-4">
					<div class="text-lg-bold">{{ t('reviewer.submission.reviewDueDate') }}:</div>
					<div class="text-base-normal mt-1">{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateDue) }}</div>
				</div>
				<div v-if="store.reviewRoundHistory.reviewAssignment.dateCompleted" class="mt-4">
					<div class="text-lg-bold">{{ t('reviewer.submission.submittedOn') }}:</div>
					<div class="text-base-normal mt-1">{{ formatShortDate(store.reviewRoundHistory.reviewAssignment.dateCompleted) }}</div>
				</div>
			</template>
		</SideModalLayout2Columns>
	</SideModalBody>
</template>

<script setup>
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayout2Columns from "@/components/Modal/SideModalLayout2Columns.vue";
import ListingFilesListPanel from "@/components/ListPanel/listingFiles/ListingFilesListPanel.vue";
import {useTranslation} from '@/composables/useTranslation';
import {useRoundHistoryModalStore} from './roundHistoryModalStore';
import moment from 'moment';

function formatShortDate(dateString) {
	return moment(dateString).format('DD-MM-YYYY');
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
