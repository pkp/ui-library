<template>
	<PkpAccordionItem :value="String(review.id)" :class="cn('root')">
		<article :class="cn('wrapper')">
			<PkpOpenReviewAccordianHeader
				:title="
					review?.reviewerRecommendationDisplayText ?? t('common.inProgress')
				"
				:subtitle="
					showRound
						? t('openReview.roundNumber', {number: review.round.roundNumber})
						: (review.reviewerFullName ??
							t('submission.submit.contributorType.anonymous'))
				"
				:open-label="t('openReview.readReview')"
				:close-label="t('openReview.hideReview')"
				:-review-icon="ReviewIcon"
			/>
			<PkpAccordionContent>
				<div :class="cn('content')">
					<time v-if="review.dateCompleted" :class="cn('date')">
						{{ formatLongDate(review.dateCompleted) }}
					</time>
					<div :class="cn('reviewer')">
						<h3 :class="cn('reviewer-name')">
							{{ review.reviewerFullName }}
							<PkpOrcidDisplay
								:class="cn('reviewer-orcid')"
								:orcid-url="review.reviewerOrcid"
								:is-verified="review.reviewerHasVerifiedOrcid"
								variant="icon"
							/>
						</h3>
						<div
							v-if="review.reviewerAffiliation"
							:class="cn('reviewer-affiliation')"
						>
							{{ review.reviewerAffiliation }}
						</div>
					</div>

					<section
						v-if="review.competingInterestsDeclared"
						:class="cn('competing-interests')"
						:aria-label="t('reviewer.submission.competingInterests')"
					>
						<h4 :class="cn('competing-interests-title')">
							{{ t('reviewer.submission.competingInterests') }}
						</h4>
						<div
							v-if="review.competingInterests"
							v-strip-unsafe-html="review.competingInterests"
							:class="cn('competing-interests-statement')"
						/>
						<div v-else :class="cn('competing-interests-statement')">
							{{ t('reviewer.submission.competingInterests.declaredNone') }}
						</div>
					</section>

					<section
						:class="cn('comments')"
						:aria-label="t('manager.userComment.comments')"
					>
						<h4 class="sr-only">
							{{ t('manager.userComment.comments') }}
						</h4>
						<div
							v-for="(comment, i) in review.reviewerComments"
							:key="i"
							v-strip-unsafe-html="comment"
							:class="cn('comment')"
						/>
						<template v-if="review.reviewForm?.questions?.length">
							<ul :class="cn('questions')">
								<li
									v-for="(question, i) in review.reviewForm.questions"
									:key="i"
									:class="cn('question')"
								>
									<h5
										v-strip-unsafe-html="question.question"
										:class="cn('question-text')"
									/>
									<p
										v-for="(response, j) in question.responses"
										:key="j"
										v-strip-unsafe-html="response"
										:class="cn('response')"
									></p>
								</li>
							</ul>
						</template>
						<template
							v-if="
								!review.reviewerComments?.length &&
								!review.reviewForm?.questions?.length
							"
						>
							<p :class="cn('no-comments')">
								{{ t('openReview.noCommentsAvailable') }}
							</p>
						</template>
					</section>

					<section :class="cn('metadata')">
						<div
							v-if="review.doi"
							v-strip-unsafe-html="t('openReview.citeDoi', {doi: review.doi})"
							:class="cn('doi')"
						/>
					</section>
				</div>
			</PkpAccordionContent>
		</article>
	</PkpAccordionItem>
</template>

<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import PkpAccordionItem from '../PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionContent from '../PkpAccordion/PkpAccordionContent.vue';
import {computed} from 'vue';
import Approved from './icons/Approved.vue';
import NotApproved from './icons/NotApproved.vue';
import RevisionsRequested from './icons/RevisionsRequested.vue';
import Comments from './icons/Comments.vue';
import InProgress from './icons/InProgress.vue';
import {formatLongDate} from '@/utils/dateUtils';
import PkpOrcidDisplay from '../PkpOrcidDisplay/PkpOrcidDisplay.vue';
import PkpOpenReviewAccordianHeader from './PkpOpenReviewAccordianHeader.vue';

const props = defineProps({
	review: {type: Object, required: true},
	showRound: {type: Boolean, default: () => false},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReview', props.styles);
const {t} = usePkpLocalize();

// Matches the ReviewerRecommendationType constants
const icons = {
	1: Approved,
	2: NotApproved,
	3: RevisionsRequested,
	4: Comments,
};

const ReviewIcon = computed(() => {
	if (!props.review?.dateCompleted) {
		return InProgress;
	}
	return icons[props.review.reviewerRecommendationTypeId];
});
</script>
