<template>
	<SideModalBody v-if="store.reviewRoundHistory" class="text-base-normal">
		<template v-if="store.reviewRoundHistory.reviewAssignment" #pre-title>
			{{ store.reviewRoundHistory.reviewAssignment.submissionId }}
		</template>
		<template #title>
			<h1 class="text-dark-accent underline">
				{{
					t('reviewer.submission.reviewRound.info.modal.title', {
						round: store.reviewRoundNumber,
					})
				}}
			</h1>
		</template>
		<template v-if="store.reviewRoundHistory.publicationTitle" #description>
			{{ localize(store.reviewRoundHistory.publicationTitle) }}
		</template>
		<SideModalLayout2Columns>
			<template #left>
				<div v-if="store.isDeclined">
					<div class="mb-5 border border-light p-4">
						<h2 class="mb-4 text-lg-bold text-heading">
							{{ t('reviewer.submission.reviewRound.reviewDeclineDate') }}
						</h2>
						<p>
							{{
								formatShortDate(
									store.reviewRoundHistory.reviewAssignment.dateConfirmed,
								)
							}}
						</p>
					</div>

					<div class="border border-light">
						<div class="border-b border-light p-4">
							<h2 class="text-lg-bold text-heading">
								{{ t('reviewer.submission.reviewRound.emailLog') }}
							</h2>
						</div>
						<div class="p-4">
							<div v-if="store.reviewRoundHistory.declineEmail">
								<p
									v-strip-unsafe-html="
										store.reviewRoundHistory.declineEmail.subject
									"
									class="mb-4 text-lg-normal text-secondary"
								></p>
								<p
									v-strip-unsafe-html="
										store.reviewRoundHistory.declineEmail.body
									"
									class="mt-4"
								></p>
							</div>
							<p v-else>
								{{
									t('reviewer.submission.reviewRound.emailLog.defaultMessage')
								}}
							</p>
						</div>
					</div>
				</div>
				<div v-else-if="store.isIncomplete">
					<h2 class="text-lg-bold text-heading">
						{{ t('reviewer.submission.reviewRound.reviewNotCompleted') }}
					</h2>
				</div>
				<div v-else>
					<div
						v-if="store.reviewRoundHistory.recommendation"
						class="mb-5 border border-light p-4"
					>
						<h2 class="mb-2 text-lg-bold text-heading">
							{{ t('reviewer.article.recommendation') }}
						</h2>
						<p>{{ store.reviewRoundHistory.recommendation }}</p>
					</div>

					<div
						v-if="
							store.reviewRoundHistory.comments.length ||
							store.reviewRoundHistory.privateComments.length
						"
						class="mb-5 border border-light"
					>
						<div class="border-b border-light p-4">
							<h2 class="text-lg-bold text-heading">
								{{ t('reviewer.submission.reviewRound.comments') }}
							</h2>
						</div>
						<div
							v-if="store.reviewRoundHistory.comments.length"
							class="border-b border-light p-4"
						>
							<h3 class="text-lg-normal text-secondary">
								{{
									t('reviewer.submission.reviewRound.comments.authorAndEditor')
								}}
							</h3>
							<dl>
								<template
									v-for="(reviewComment, index) in store.reviewRoundHistory
										.comments"
									:key="index"
								>
									<dt class="mt-3 text-base-bold">
										{{
											t('reviewer.submission.reviewRound.comments.prefix', {
												index: index + 1,
											})
										}}
									</dt>
									<dd v-strip-unsafe-html="reviewComment"></dd>
								</template>
							</dl>
						</div>
						<div
							v-if="store.reviewRoundHistory.privateComments.length"
							class="p-4"
						>
							<h3 class="text-lg-normal text-secondary">
								{{ t('reviewer.submission.reviewRound.comments.editorOnly') }}
							</h3>
							<dl>
								<template
									v-for="(reviewComment, index) in store.reviewRoundHistory
										.privateComments"
									:key="index"
								>
									<dt class="mt-3 text-base-bold">
										{{
											t('reviewer.submission.reviewRound.comments.prefix', {
												index: index + 1,
											})
										}}
									</dt>
									<dd v-strip-unsafe-html="reviewComment"></dd>
								</template>
							</dl>
						</div>
					</div>

					<ListingFilesListPanel
						v-if="store.reviewRoundHistory.attachments.length"
						class="mb-5"
						:title="t('reviewer.submission.reviewRound.attachments')"
						:description="
							t('reviewer.submission.reviewRound.attachments.description')
						"
						:files="store.reviewRoundHistory.attachments"
					></ListingFilesListPanel>

					<ListingFilesListPanel
						v-if="store.reviewRoundHistory.files.length"
						:title="t('reviewer.submission.reviewRound.files')"
						:description="
							t('reviewer.submission.reviewRound.files.description')
						"
						:files="store.reviewRoundHistory.files"
					></ListingFilesListPanel>
				</div>
			</template>
			<template #right1>
				<h2 class="text-xl-bold text-heading">
					{{ t('reviewer.submission.reviewRound.metadata') }}
				</h2>

				<div
					v-for="metadata in store.articleMetadata"
					:key="metadata.heading"
					class="mt-4"
				>
					<h3 class="text-lg-bold text-heading">{{ metadata.heading }}:</h3>
					<p v-if="metadata.body">{{ metadata.body }}</p>
					<div
						v-if="metadata.bodyHtml"
						v-strip-unsafe-html="metadata.bodyHtml"
					></div>
				</div>
			</template>
			<template v-if="store.reviewRoundHistory.reviewAssignment" #right2>
				<h2 class="text-xl-bold text-heading">
					{{ t('reviewer.submission.reviewRound.general') }}
				</h2>
				<div
					v-for="information in store.generalInformation"
					:key="information.heading"
					class="mt-4"
				>
					<h3 class="text-lg-bold text-heading">{{ information.heading }}:</h3>
					<p>{{ information.body }}</p>
				</div>
			</template>
		</SideModalLayout2Columns>
	</SideModalBody>
</template>

<script setup>
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayout2Columns from '@/components/Modal/SideModalLayout2Columns.vue';
import ListingFilesListPanel from '@/components/ListPanel/listingFiles/ListingFilesListPanel.vue';
import {useTranslation} from '@/composables/useTranslation';
import {useRoundHistoryModalStore} from './roundHistoryModalStore';
import moment from 'moment';

function formatShortDate(dateString) {
	return moment(dateString).format('DD-MM-YYYY');
}

const props = defineProps({
	submissionId: {type: Number, required: true},
	reviewRoundId: {type: Number, required: true},
	reviewRoundNumber: {type: Number, required: true},
});

const {t, localize} = useTranslation();

const store = useRoundHistoryModalStore(props);
</script>
