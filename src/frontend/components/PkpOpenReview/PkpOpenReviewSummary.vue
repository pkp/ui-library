<template>
	<section :class="cn('root')">
		<!-- Header -->
		<h2 :class="cn('heading')">
			{{ t('openReview.title') }}
		</h2>

		<!-- Not Available State -->
		<p
			v-if="store.reviewState === ReviewState.NOT_AVAILABLE"
			:class="cn('notAvailable')"
		>
			{{ t('openReview.dataNotAvailable') }}
		</p>

		<!-- Completed / In Progress States -->
		<template v-else>
			<!-- Status -->
			<div :class="cn('statusSection')">
				<h3 :class="cn('statusLabel')">
					{{ t('openReview.status') }}
				</h3>
				<p :class="cn('statusValue')">
					<template v-if="store.reviewState === ReviewState.COMPLETED">
						{{
							t('openReview.statusCompleted', {
								date: formatLongDate(summary?.reviewStatus?.dateCompleted),
							})
						}}
					</template>
					<template v-else>
						{{
							t('openReview.statusInProgress', {
								date: formatLongDate(summary?.reviewStatus?.dateInProgress),
							})
						}}
					</template>
				</p>
			</div>

			<!-- Current Version -->
			<div
				v-if="summary?.submissionCurrentVersion"
				:class="cn('currentVersionSection')"
			>
				<h3 :class="cn('currentVersionLabel')">
					{{ t('openReview.currentVersion') }}
				</h3>
				<p :class="cn('currentVersionValue')">
					<span :class="cn('currentVersionTitle')">
						{{ summary.submissionCurrentVersion.versionString }}
					</span>
					<span :class="cn('currentVersionDate')">
						{{
							t('common.inParenthesis', {
								text: formatLongDate(
									summary.submissionCurrentVersion.datePublished,
								),
							})
						}}
					</span>
				</p>
			</div>

			<!-- Review Summary -->
			<div v-if="store.hasRecommendations" :class="cn('reviewSummary')">
				<h3 :class="cn('reviewSummaryHeading')">
					{{
						t('openReview.reviewersContributed', {
							count: summary?.reviewerCount ?? 0,
						})
					}}
				</h3>
				<div :class="cn('recommendations')">
					<div
						v-for="rec in summary?.reviewerRecommendations"
						:key="rec.recommendationTypeId"
						:class="cn('recommendation')"
						:data-recommendation="
							store.getRecommendationTypeInfo(rec.recommendationTypeId)?.key
						"
					>
						<PkpIcon
							:icon="
								store.getRecommendationTypeInfo(rec.recommendationTypeId)
									?.iconName
							"
							aria-hidden="true"
						/>
						<span :class="cn('recommendationLabel')">
							{{ rec.recommendationTypeLabel }}
						</span>
						<span :class="cn('recommendationSeparator')" aria-hidden="true">
							{{ t('openReview.recommendationItemSeparator') }}
						</span>
						<span :class="cn('recommendationCount')">{{ rec.count }}</span>
					</div>
				</div>
			</div>

			<!-- No Reports Placeholder (In Progress with no recommendations) -->
			<div
				v-else-if="store.reviewState === ReviewState.IN_PROGRESS"
				:class="cn('reviewSummary')"
			>
				<h3 :class="cn('reviewSummaryHeading')">
					{{ t('openReview.noReportsCompleted') }}
				</h3>
				<div :class="cn('recommendations')">
					<p :class="cn('recommendationsEmpty')">
						{{ t('openReview.noReportsDescription') }}
					</p>
				</div>
			</div>

			<!-- How decisions summarized -->
			<PkpAccordionRoot type="single" collapsible>
				<PkpAccordionItem value="how-summarized">
					<PkpAccordionHeader as="h3">
						{{ t('openReview.howDecisionsSummarized') }}
					</PkpAccordionHeader>
					<PkpAccordionContent>
						<div :class="cn('summaryExplanation')">
							<p>{{ t('openReview.howDecisionsSummarizedDescription') }}</p>
						</div>
					</PkpAccordionContent>
				</PkpAccordionItem>
			</PkpAccordionRoot>

			<!-- Button -->
			<PkpButton :class="cn('button')" @click="store.viewFullRecord">
				{{ t('openReview.seeFullRecord') }}
			</PkpButton>
		</template>
	</section>
</template>

<script setup>
import {computed} from 'vue';
import {usePkpOpenReviewStore, ReviewState} from './usePkpOpenReviewStore';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publicationsPeerReviews: {type: Array, required: true},
	submissionPeerReviewSummary: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewSummary', props.styles);

const store = usePkpOpenReviewStore();
store.initialize({
	publicationsPeerReviews: props.publicationsPeerReviews,
	submissionPeerReviewSummary: props.submissionPeerReviewSummary,
});

const summary = computed(() => store.submissionSummary);

const {t} = usePkpLocalize();
const {formatLongDate} = usePkpDate();
</script>
