<template>
	<SideModalBody>
		<template #title>
			{{ t('manager.userComment.viewReportDetailsBy') }}
		</template>

		<template #description>
			{{ report.userName }}
		</template>

		<div class="min-w-fit p-4">
			<div class="w-full bg-secondary">
				<div class="border-y border-e border-s border-light">
					<div class="flex h-full">
						<div class="flex-grow border-e border-light p-5">
							<Panel>
								<PanelSection>
									<template #header>
										<span class="font-bold text-heading">
											{{ t('manager.userComment.reportPreview') }}
										</span>
									</template>
								</PanelSection>

								<PanelSection>
									<div>
										<span class="text-sm-light text-secondary">
											{{ formatShortDateTime(report.createdAt) }}
										</span>

										<div
											v-strip-unsafe-html="report.note"
											class="mt-3 text-lg-normal"
										></div>
										<div class="mt-4">
											<div class="text-base-normal font-bold leading-5">
												{{ report.userName }}
											</div>
											<div
												v-if="report.userOrcidDisplayValue"
												class="mb-1 flex items-center"
											>
												<Icon
													:icon="
														report.isUserOrcidAuthenticated
															? 'Orcid'
															: 'OrcidUnauthenticated'
													"
												/>
												<a
													class="text-sm-light text-secondary"
													target="_blank"
													:href="report.userOrcidDisplayValue"
												>
													{{ report.userOrcidDisplayValue }}
												</a>
											</div>

											<div
												v-if="report.userAffiliation"
												class="text-base-normal"
											>
												{{ report.userAffiliation }}
											</div>
										</div>
									</div>
								</PanelSection>
							</Panel>
						</div>
						<div class="w-96 border-s border-light">
							<div class="flex flex-col items-start space-y-4 p-4">
								<PkpButton
									:is-warnable="true"
									@click="userCommentStore.reportDelete(report)"
								>
									{{ t('manager.userComment.deleteReport') }}
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
import {useDate} from '@/composables/useDate';
import PanelSection from '@/components/Panel/PanelSection.vue';
import Icon from '@/components/Icon/Icon.vue';
import Panel from '@/components/Panel/Panel.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';

const {formatShortDateTime} = useDate();

defineProps({
	/** The report to display information about */
	report: {
		type: Object,
		required: true,
	},
});

const userCommentStore = useUserCommentStore();
</script>
