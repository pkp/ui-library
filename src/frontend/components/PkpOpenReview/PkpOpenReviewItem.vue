<template>
	<PkpAccordionItem
		:value="review.id"
		:data-review-id="review.id"
		:class="cn('root')"
	>
		<PkpAccordionHeader>
			<slot name="header" :review="review">
				<div :class="cn('header')">
					<!-- Status badge -->
					<span
						:class="cn('status')"
						:data-recommendation="review.reviewerRecommendationTypeKey"
					>
						<PkpIcon
							:icon="review.reviewerRecommendationTypeIcon"
							:class="cn('statusIcon')"
							aria-hidden="true"
						/>
						<span :class="cn('statusText')">
							{{ review.reviewerRecommendationDisplayText }}
						</span>
					</span>

					<!-- By Round: reviewer info -->
					<template v-if="variant === 'byRound'">
						<span :class="cn('reviewer')">{{ review.reviewerFullName }}</span>
						<span :class="cn('affiliation')">
							— {{ review.reviewerAffiliation }}
						</span>
					</template>

					<!-- By Reviewer: round info -->
					<template v-else>
						<span :class="cn('version')">{{ review.round.displayText }}</span>
						<span :class="cn('date')">
							— {{ formatShortDate(review.round.date) }}
						</span>
					</template>
				</div>
			</slot>
		</PkpAccordionHeader>

		<PkpAccordionContent>
			<slot name="content" :review="review">
				<div :class="cn('label')">{{ t('submission.review') }}</div>
				<div :class="cn('content')">
					<!-- Comments -->
					<template v-if="review.reviewerComments?.length">
						<p
							v-for="(comment, i) in review.reviewerComments"
							:key="i"
							v-strip-unsafe-html="comment"
							:class="cn('comment')"
						></p>
					</template>

					<!-- Form responses -->
					<template v-else-if="review.reviewForm">
						<div
							v-for="(question, i) in review.reviewForm.questions"
							:key="i"
							:class="cn('formQuestion')"
						>
							<strong
								v-strip-unsafe-html="question.question"
								:class="cn('questionText')"
							></strong>
							<p
								v-for="(response, j) in question.responses"
								:key="j"
								v-strip-unsafe-html="response"
								:class="cn('responseText')"
							></p>
						</div>
					</template>

					<!-- No content -->
					<template v-else>
						<p :class="cn('noContent')">
							{{ t('openReview.noCommentsAvailable') }}
						</p>
					</template>
				</div>
			</slot>
		</PkpAccordionContent>
	</PkpAccordionItem>
</template>

<script setup>
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	review: {type: Object, required: true},
	variant: {type: String, default: 'byRound'},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewItem', props.styles);
const {formatShortDate} = usePkpDate();
const {t} = usePkpLocalize();
</script>
