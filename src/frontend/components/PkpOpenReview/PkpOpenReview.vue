<template>
	<div :class="cn('root')">
		<PkpTabRoot default-value="byRecord">
			<div :class="cn('tabsHeader')">
				<span :id="sortLabelId" :class="cn('tabsLabel')">
					{{ t('openReview.sortBy') }}
				</span>
				<PkpTabList :aria-labelledby="sortLabelId" :class="cn('tabsList')">
					<PkpTabTrigger value="byRecord">
						{{ t('publication.versionStage.versionOfRecord') }}
					</PkpTabTrigger>
					<PkpTabTrigger value="byReviewer">
						{{ t('openReview.sortByReviewerName') }}
					</PkpTabTrigger>
				</PkpTabList>
			</div>

			<!-- By Record View -->
			<PkpTabContent value="byRecord">
				<PkpAccordionRoot v-model="store.expandedRoundIds" type="multiple">
					<PkpAccordionItem
						v-for="round in store.reviewRounds"
						:key="round.roundId"
						:value="round.roundId"
						:class="cn('accordionItem')"
					>
						<PkpAccordionHeader>
							<slot
								name="roundHeader"
								:round="round"
								:summary="store.getRoundSummary(round)"
								:review-count="round.reviews?.length || 0"
							>
								<div :class="cn('roundHeader')">
									<!-- Title -->
									<span :class="cn('roundTitle')">
										{{ round.displayText }}
									</span>

									<!-- Decision summary - wraps to row 2 on medium, hidden on small -->
									<div :class="cn('roundSummary')">
										<span
											v-for="item in store.getRoundSummary(round)"
											:key="item.typeKey"
											:class="cn('roundSummaryItem')"
											:data-recommendation="item.typeKey"
										>
											<PkpIcon
												:icon="item.typeIcon"
												:class="cn('roundSummaryIcon')"
												aria-hidden="true"
											/>
											<span :class="cn('roundSummaryLabel')">
												{{ item.label }}
											</span>
											-
											<span :class="cn('roundSummaryCount')">
												{{ item.count }}
											</span>
										</span>
									</div>

									<!-- Right side: Date + author response icon (always visible) -->
									<div :class="cn('roundMeta')">
										<span v-if="round.date" :class="cn('roundDate')">
											{{ formatShortDate(round.date) }}
										</span>
										<PkpIcon
											v-if="round.authorResponse"
											icon="ReviewAuthorResponse"
											:class="cn('roundResponseIndicator')"
											:aria-label="t('submission.reviewRound.authorResponse')"
										/>
									</div>
								</div>
							</slot>
						</PkpAccordionHeader>
						<PkpAccordionContent :class="cn('accordionContent')">
							<!-- Author Response - appears BEFORE reviews -->
							<div
								v-if="round.authorResponse"
								:class="cn('authorResponseWrapper')"
							>
								<PkpAccordionRoot
									v-model="store.expandedAuthorResponseIds"
									type="multiple"
								>
									<PkpAccordionItem
										:value="`response-${round.roundId}`"
										:class="cn('authorResponseItem')"
									>
										<PkpAccordionHeader
											:class="cn('authorResponseHeaderWrapper')"
										>
											<div :class="cn('authorResponseHeader')">
												<span :class="cn('authorResponseLabel')">
													{{ t('submission.reviewRound.authorResponse') }}
												</span>
											</div>
											<template #indicator>
												<span :class="cn('readResponseButton')">
													{{ t('openReview.readResponse') }}
												</span>
											</template>
										</PkpAccordionHeader>
										<PkpAccordionContent>
											<div :class="cn('reviewContent')">
												<p
													v-strip-unsafe-html="round.authorResponse.response"
												></p>
											</div>
										</PkpAccordionContent>
									</PkpAccordionItem>
								</PkpAccordionRoot>
							</div>

							<!-- Nested review accordion -->
							<PkpAccordionRoot
								v-model="store.expandedReviewIds"
								type="multiple"
								:class="cn('reviewsAccordion')"
							>
								<PkpAccordionItem
									v-for="review in round.reviews"
									:key="review.id"
									:value="review.id"
									:data-review-id="review.id"
									:class="cn('reviewItem')"
								>
									<PkpAccordionHeader :class="cn('reviewHeaderWrapper')">
										<slot name="reviewItem" :review="review" :round="round">
											<div :class="cn('reviewHeader')">
												<span
													:class="cn('status')"
													:data-recommendation="
														review.reviewerRecommendationTypeKey
													"
												>
													<PkpIcon
														:icon="review.reviewerRecommendationTypeIcon"
														aria-hidden="true"
													/>
													{{ review.reviewerRecommendationDisplayText }}
												</span>
												<span :class="cn('reviewer')">
													{{ review.reviewerFullName }}
												</span>
												<span :class="cn('affiliation')">
													— {{ review.reviewerAffiliation }}
												</span>
											</div>
										</slot>
									</PkpAccordionHeader>
									<PkpAccordionContent :class="cn('reviewContentWrapper')">
										<div :class="cn('reviewLabel')">
											{{ t('submission.review') }}
										</div>
										<div :class="cn('reviewContent')">
											<!-- Review comments (plain text reviews) -->
											<template v-if="review.reviewerComments?.length">
												<p
													v-for="(comment, i) in review.reviewerComments"
													:key="i"
													v-strip-unsafe-html="comment"
													:class="cn('comment')"
												></p>
											</template>

											<!-- Review form responses -->
											<template v-else-if="review.reviewForm">
												<div
													v-for="(question, i) in review.reviewForm.questions"
													:key="i"
													:class="cn('formQuestion')"
												>
													<strong
														v-strip-unsafe-html="question.question"
													></strong>
													<p
														v-for="(response, j) in question.responses"
														:key="j"
														v-strip-unsafe-html="response"
													></p>
												</div>
											</template>

											<!-- No content available -->
											<template v-else>
												<p :class="cn('noContent')">
													{{ t('openReview.noCommentsAvailable') }}
												</p>
											</template>
										</div>
									</PkpAccordionContent>
								</PkpAccordionItem>
							</PkpAccordionRoot>
						</PkpAccordionContent>
					</PkpAccordionItem>
				</PkpAccordionRoot>
			</PkpTabContent>

			<!-- By Reviewer View -->
			<PkpTabContent value="byReviewer">
				<PkpAccordionRoot v-model="store.expandedRoundIds" type="multiple">
					<PkpAccordionItem
						v-for="reviewer in store.reviewerGroups"
						:key="reviewer.reviewerId"
						:value="reviewer.reviewerId"
						:class="cn('accordionItem')"
					>
						<PkpAccordionHeader>
							<slot
								name="reviewerHeader"
								:reviewer="reviewer"
								:review-count="reviewer.reviews?.length || 0"
							>
								<div :class="cn('reviewerHeader')">
									<span :class="cn('reviewerTitle')">
										{{ reviewer.reviewerFullName }}
									</span>
									<span :class="cn('reviewerAffiliation')">
										{{ reviewer.reviewerAffiliation }}
									</span>
									<span :class="cn('reviewerMeta')">
										{{
											t('openReview.reviewCount', {
												count: reviewer.reviews?.length || 0,
											})
										}}
									</span>
								</div>
							</slot>
						</PkpAccordionHeader>
						<PkpAccordionContent :class="cn('accordionContent')">
							<!-- Nested review accordion for reviewer view -->
							<PkpAccordionRoot
								v-model="store.expandedReviewIds"
								type="multiple"
								:class="cn('reviewsAccordion')"
							>
								<PkpAccordionItem
									v-for="review in reviewer.reviews"
									:key="review.id"
									:value="review.id"
									:data-review-id="review.id"
									:class="cn('reviewItem')"
								>
									<PkpAccordionHeader :class="cn('reviewHeaderWrapper')">
										<slot
											name="reviewerItem"
											:review="review"
											:reviewer="reviewer"
										>
											<div :class="cn('reviewHeader')">
												<span
													:class="cn('status')"
													:data-recommendation="
														review.reviewerRecommendationTypeKey
													"
												>
													<PkpIcon
														:icon="review.reviewerRecommendationTypeIcon"
														aria-hidden="true"
													/>
													{{ review.reviewerRecommendationDisplayText }}
												</span>
												<span :class="cn('version')">
													{{ review.round.displayText }}
												</span>
												<span :class="cn('date')">
													— {{ formatShortDate(review.round.date) }}
												</span>
											</div>
										</slot>
									</PkpAccordionHeader>
									<PkpAccordionContent :class="cn('reviewContentWrapper')">
										<div :class="cn('reviewLabel')">
											{{ t('submission.review') }}
										</div>
										<div :class="cn('reviewContent')">
											<!-- Review comments (plain text reviews) -->
											<template v-if="review.reviewerComments?.length">
												<p
													v-for="(comment, i) in review.reviewerComments"
													:key="i"
													v-strip-unsafe-html="comment"
													:class="cn('comment')"
												></p>
											</template>

											<!-- Review form responses -->
											<template v-else-if="review.reviewForm">
												<div
													v-for="(question, i) in review.reviewForm.questions"
													:key="i"
													:class="cn('formQuestion')"
												>
													<strong
														v-strip-unsafe-html="question.question"
													></strong>
													<p
														v-for="(response, j) in question.responses"
														:key="j"
														v-strip-unsafe-html="response"
													></p>
												</div>
											</template>

											<!-- No content available -->
											<template v-else>
												<p :class="cn('noContent')">
													{{ t('openReview.noCommentsAvailable') }}
												</p>
											</template>
										</div>
									</PkpAccordionContent>
								</PkpAccordionItem>
							</PkpAccordionRoot>
						</PkpAccordionContent>
					</PkpAccordionItem>
				</PkpAccordionRoot>
			</PkpTabContent>
		</PkpTabRoot>
	</div>
</template>

<script setup>
import PkpTabRoot from '@/frontend/components/PkpTab/PkpTabRoot.vue';
import PkpTabList from '@/frontend/components/PkpTab/PkpTabList.vue';
import PkpTabTrigger from '@/frontend/components/PkpTab/PkpTabTrigger.vue';
import PkpTabContent from '@/frontend/components/PkpTab/PkpTabContent.vue';
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {onMounted, useId} from 'vue';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publicationsPeerReviews: {type: Array, required: true},
	submissionPeerReviewSummary: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReview', props.styles);
const sortLabelId = useId();

const store = usePkpOpenReviewStore();
store.initialize({
	publicationsPeerReviews: props.publicationsPeerReviews,
	submissionPeerReviewSummary: props.submissionPeerReviewSummary,
});

onMounted(() => {
	store.scrollToReviewFromUrl();
});

const {formatShortDate} = usePkpDate();
const {t} = usePkpLocalize();
</script>
