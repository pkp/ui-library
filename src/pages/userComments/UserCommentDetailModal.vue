<template>
	<SideModalBody>
		<template #pre-title>
			<span>{{ comment.publication.submissionId }}.</span>
			<span>{{ comment.publication.authorsStringShort }}</span>
			<span>{{ t('common.semicolonListSeparator') }}</span>
			<span>{{ comment.publication.fullTitle }}</span>
		</template>
		<template #title>
			{{ t('manager.userComment.viewDetailsCommentBy') }}
		</template>

		<template #description>
			{{ comment.userName }}
		</template>

		<div class="min-w-fit p-4">
			<div class="w-full bg-secondary">
				<div class="border-y border-e border-s border-light">
					<div class="flex h-full">
						<div class="flex-grow border-e border-light p-5">
							<div class="border border-light">
								<div class="border-b border-light px-6 py-4">
									<span class="font-bold text-heading">
										{{ t('manager.userComment.commentPreview') }}
									</span>
								</div>
								<div class="mb-4 space-y-4 px-6 py-4">
									<div class="text-sm-light text-secondary">
										<span>
											{{ formatShortDateTime(comment.createdAt) }}
										</span>
									</div>

									<div
										v-strip-unsafe-html="comment.commentText"
										class="text-lg-normal"
									></div>
									<div class="pt-2">
										<div class="text-base-normal font-bold">
											{{ comment.userName }}
										</div>
										<div
											v-if="comment.userOrcidDisplayValue"
											class="mb-1 flex items-center"
										>
											<Icon
												:icon="
													comment.isUserOrcidAuthenticated
														? 'Orcid'
														: 'OrcidUnauthenticated'
												"
											/>
											<a
												class="text-sm-light text-secondary"
												target="_blank"
												:href="comment.userOrcidDisplayValue"
											>
												{{ comment.userOrcidDisplayValue }}
											</a>
										</div>

										<div
											v-if="comment.userAffiliation"
											class="text-base-normal"
										>
											{{ comment.userAffiliation }}
										</div>
									</div>
								</div>
							</div>

							<div class="mt-6">
								<UserCommentReportsTable
									:items="userCommentStore.currentCommentReports"
								/>
							</div>
						</div>
						<div class="w-96 border-s border-light">
							<div class="border-b border-light p-4">
								<div class="text-lg-normal">
									<span v-if="comment.isApproved">
										{{
											t('manager.userComment.approved.note', {
												approvedBy: comment.approvedByUserName,
												approvedAt: formatShortDate(comment.approvedAt),
											})
										}}
									</span>
									<span v-else>
										{{ t('manager.userComment.approval.warning') }}
									</span>
								</div>
							</div>
							<div class="flex flex-col items-start space-y-4 p-4">
								<PkpButton
									:is-primary="!comment.isApproved"
									:is-disabled="comment.isApproved"
									@click="userCommentStore.commentToggleApproval(true)"
								>
									{{ t('manager.userComment.approveComment') }}
								</PkpButton>
								<PkpButton
									:is-warnable="true"
									@click="userCommentStore.commentDelete(comment)"
								>
									{{ t('manager.userComment.deleteComment') }}
								</PkpButton>

								<PkpButton
									:is-disabled="!comment.isApproved"
									@click="userCommentStore.commentToggleApproval(false)"
								>
									{{ t('manager.userComment.hideComment') }}
								</PkpButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';
import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';
import UserCommentReportsTable from '@/pages/userComments/UserCommentReportsTable.vue';

const {formatShortDate, formatShortDateTime} = useDate();
const {t} = useLocalize();

const userCommentStore = useUserCommentStore();
const comment = userCommentStore.currentComment;
</script>
