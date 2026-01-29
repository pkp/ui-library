<template>
	<div :class="cn('root')">
		<PkpTabRoot default-value="byRecord">
			<header :class="cn('tabsHeader')">
				<span :class="cn('tabsLabel')">
					{{ t('openReview.sortBy') }}
				</span>
				<PkpTabList :class="cn('tabsList')">
					<PkpTabTrigger value="byRecord">
						{{ t('publication.versionStage.versionOfRecord') }}
					</PkpTabTrigger>
					<PkpTabTrigger value="byReviewer">
						{{ t('openReview.sortByReviewerName') }}
					</PkpTabTrigger>
				</PkpTabList>
			</header>

			<!-- By Record View -->
			<PkpTabContent value="byRecord">
				<h2 :class="cn('heading')">
					{{ t('openReview.reportsByRecord') }}
				</h2>
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
								<div :class="cn('header')">
									<span :class="cn('title')">
										{{ round.displayText }}
										<template v-if="round.date">
											• {{ formatShortDate(round.date) }}
										</template>
									</span>
									<p>
										({{
											t('openReview.reviewerCount', {
												count: round.reviews?.length || 0,
											})
										}})
									</p>
									<div :class="cn('summary')">
										<span
											v-for="item in store.getRoundSummary(round)"
											:key="item.typeCss"
											:class="cn('summaryItem')"
											:data-recommendation="item.typeCss"
										>
											<PkpIcon :icon="item.typeIcon" aria-hidden="true" />
											{{ item.count }} {{ item.label }}
										</span>
									</div>
								</div>
							</slot>
						</PkpAccordionHeader>
						<PkpAccordionContent :class="cn('accordionContent')">
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
														review.reviewerRecommendationTypeCss
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
				<h2 :class="cn('heading')">
					{{ t('openReview.reportsByReviewer') }}
				</h2>
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
								<div :class="cn('headerTitle')">
									<span :class="cn('title')">
										{{ reviewer.reviewerFullName }}
									</span>
									<p>{{ reviewer.reviewerAffiliation }}</p>
								</div>
								<p :class="cn('reviewCount')">
									{{
										t('openReview.reviewCount', {
											count: reviewer.reviews?.length || 0,
										})
									}}
								</p>
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
														review.reviewerRecommendationTypeCss
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
import {onMounted} from 'vue';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publicationsPeerReviews: {type: Array, required: true},
	submissionPeerReviewSummary: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles(props.styles);

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

<style>
.pkpOpenReview {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.pkpOpenReview__tabs-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid #e5e7eb;
}

.pkpOpenReview__tabs-label {
	font-size: 0.875rem;
	color: #666;
}

.pkpOpenReview__tabs-list {
	display: flex;
	background: #f3f4f6;
	border-radius: 0.375rem;
	padding: 0.25rem;
}

.pkpOpenReview__tabs-list .pkpTabTrigger {
	padding: 0.5rem 1rem;
	font-size: 0.875rem;
	font-weight: 500;
	background: transparent;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
	color: #374151;
}

.pkpOpenReview__tabs-list .pkpTabTrigger:hover {
	background: #e5e7eb;
}

.pkpOpenReview__tabs-list .pkpTabTrigger[data-state='active'] {
	background: #fff;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.pkpOpenReview__tabs-list .pkpTabTrigger[data-state='active']::after {
	display: none;
}

.pkpOpenReview__heading {
	font-size: 1.125rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
}

/* Accordion */
.pkpOpenReview__accordion-item {
	border: 1px solid #e0e0e0;
	border-radius: 0.5rem;
	background: #fff;
	overflow: hidden;
	margin-top: 1rem;
}

.pkpOpenReview__accordion-item:first-child {
	margin-top: 0;
}

.pkpOpenReview__accordion-item .pkpAccordionHeader__trigger {
	padding: 1rem 1.25rem;
	background: #fff;
	border: none;
	cursor: pointer;
}

.pkpOpenReview__accordion-item .pkpAccordionHeader__trigger:hover {
	background: #f8f9fa;
}

/* Header wrapper */
.pkpOpenReview__header {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.25rem;
	width: 100%;
}

.pkpOpenReview__title {
	font-size: 1rem;
	font-weight: 600;
	color: #1a1a1a;
	margin: 0;
}

.pkpOpenReview__header p {
	font-size: 0.875rem;
	color: #666;
	margin: 0;
}

.pkpOpenReview__accordion-content {
	padding: 0 1.25rem 1.25rem 1.25rem;
}

/* Header title group */
.pkpOpenReview__header-title {
	margin: 0;
}

.pkpOpenReview__header-title p {
	font-size: 0.875rem;
	color: #666;
	margin: 0.125rem 0 0;
}

.pkpOpenReview__review-count {
	font-size: 0.875rem;
	color: #666;
	margin: 0.25rem 0 0;
}

/* Summary list */
.pkpOpenReview__summary {
	display: flex;
	gap: 1rem;
	margin: 0.25rem 0 0;
	padding: 0;
}

.pkpOpenReview__summary-item {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.8125rem;
}

.pkpOpenReview__summary .pkpIcon {
	width: 1rem;
	height: 1rem;
}

.pkpOpenReview__summary [data-recommendation='approved'] .pkpIcon {
	color: #0d6d3d;
}

.pkpOpenReview__summary [data-recommendation='revisions_requested'] .pkpIcon {
	color: #b45309;
}

.pkpOpenReview__summary [data-recommendation='not_approved'] .pkpIcon {
	color: #dc2626;
}

.pkpOpenReview__summary [data-recommendation='with_comments'] .pkpIcon {
	color: #2563eb;
}

/* Nested reviews accordion */
.pkpOpenReview__reviews-accordion {
	display: flex;
	flex-direction: column;
	gap: 0;
}

.pkpOpenReview__review-item {
	border-top: 1px solid #e5e7eb;
}

.pkpOpenReview__review-item:first-child {
	border-top: none;
}

.pkpOpenReview__review-header-wrapper .pkpAccordionHeader__trigger {
	padding: 0.875rem 0;
	background: transparent;
	border: none;
	cursor: pointer;
	width: 100%;
}

.pkpOpenReview__review-header-wrapper .pkpAccordionHeader__trigger:hover {
	background: #f8f9fa;
}

.pkpOpenReview__review-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
}

/* Status badge */
.pkpOpenReview__status {
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.8125rem;
	padding-right: 0.75rem;
	border-right: 1px solid #e5e7eb;
	white-space: nowrap;
}

.pkpOpenReview__status .pkpIcon {
	width: 1.125rem;
	height: 1.125rem;
}

.pkpOpenReview__status[data-recommendation='approved'] .pkpIcon {
	color: #0d6d3d;
}

.pkpOpenReview__status[data-recommendation='revisions_requested'] .pkpIcon {
	color: #b45309;
}

.pkpOpenReview__status[data-recommendation='not_approved'] .pkpIcon {
	color: #dc2626;
}

.pkpOpenReview__status[data-recommendation='with_comments'] .pkpIcon {
	color: #2563eb;
}

/* Reviewer info */
.pkpOpenReview__reviewer,
.pkpOpenReview__version {
	font-weight: 600;
	font-size: 0.9375rem;
	color: #1a1a1a;
}

.pkpOpenReview__affiliation,
.pkpOpenReview__date {
	flex: 1;
	font-size: 0.875rem;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* Review content (expanded) */
.pkpOpenReview__review-content-wrapper {
	padding: 0 0 1rem 0;
}

.pkpOpenReview__review-label {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: #6b7280;
	margin-bottom: 0.75rem;
}

.pkpOpenReview__review-content {
	background: #f9fafb;
	border-radius: 0.375rem;
	padding: 1rem 1.25rem;
	line-height: 1.6;
}

.pkpOpenReview__comment {
	margin: 0 0 1rem;
	color: #374151;
}

.pkpOpenReview__comment:last-child {
	margin-bottom: 0;
}

.pkpOpenReview__form-question {
	margin-bottom: 1.5rem;
}

.pkpOpenReview__form-question:last-child {
	margin-bottom: 0;
}

.pkpOpenReview__form-question strong {
	display: block;
	margin-bottom: 0.5rem;
	color: #1a1a1a;
}

.pkpOpenReview__form-question p {
	margin: 0 0 0.5rem;
	color: #374151;
}

.pkpOpenReview__no-content {
	color: #6b7280;
	font-style: italic;
	margin: 0;
}
</style>
