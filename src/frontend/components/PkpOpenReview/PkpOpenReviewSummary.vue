<template>
	<section :class="cn('root')">
		<!-- Header -->
		<h2 :class="cn('heading')">
			{{ t('openReview.title') }}
		</h2>

		<!-- Status (hardcoded for now) -->
		<div :class="cn('statusSection')">
			<h3 :class="cn('sectionLabel')">
				{{ t('openReview.status') }}
			</h3>
			<p :class="cn('sectionValue')">In progress since Dec 12, 2025</p>
		</div>

		<!-- Current Version -->
		<div
			v-if="summary?.submissionCurrentVersion"
			:class="cn('currentVersionSection')"
		>
			<h3 :class="cn('sectionLabel')">
				{{ t('openReview.currentVersion') }}
			</h3>
			<p :class="cn('sectionValue')">
				{{ summary.submissionCurrentVersion.title }}
				({{ formatShortDate(summary.submissionCurrentVersion.datePublished) }})
			</p>
		</div>

		<!-- Reviewer Box -->
		<div :class="cn('reviewerBox')">
			<h3 :class="cn('reviewerBoxHeading')">
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
					<span aria-hidden="true" :class="cn('recommendationSeparator')">
						-
					</span>
					<span :class="cn('recommendationCount')">
						{{ rec.count }}
					</span>
				</div>
			</div>
		</div>

		<!-- How decisions summarized -->
		<PkpAccordionRoot type="single" collapsible :class="cn('accordion')">
			<PkpAccordionItem value="how-summarized">
				<PkpAccordionHeader as="h3">
					{{ t('openReview.howDecisionsSummarized') }}
				</PkpAccordionHeader>
				<PkpAccordionContent>
					<div :class="cn('accordionBody')">
						<p>{{ t('openReview.howDecisionsSummarizedDescription') }}</p>
					</div>
				</PkpAccordionContent>
			</PkpAccordionItem>
		</PkpAccordionRoot>

		<!-- Button -->
		<PkpButton :class="cn('button')" @click="store.viewFullRecord">
			{{ t('openReview.seeFullRecord') }}
		</PkpButton>
	</section>
</template>

<script setup>
import {computed} from 'vue';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
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
const {formatShortDate} = usePkpDate();
</script>
