<template>
	<PkpAccordionItem
		:value="review.id"
		:data-review-id="review.id"
		:class="cn('root')"
	>
		<PkpAccordionHeader :as="`h${store.headingLevel + 1}`">
			<slot name="header" :review="review">
				<span :class="cn('header')">
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
					<span :class="cn('reviewer')">{{ review.reviewerFullName }}</span>
					<span :class="cn('affiliationSeparator')" aria-hidden="true">
						{{ t('openReview.authorAffiliationSeparator') }}
					</span>
					<span :class="cn('affiliation')">
						{{ review.reviewerAffiliation }}
					</span>
					<span v-if="review.dateCompleted" :class="cn('date')">
						{{ formatShortDate(review.dateCompleted) }}
					</span>
				</span>
			</slot>
		</PkpAccordionHeader>

		<PkpAccordionContent>
			<slot name="content" :review="review">
				<PkpOpenReviewItemContent :review="review" :styles="styles" />
			</slot>
		</PkpAccordionContent>
	</PkpAccordionItem>
</template>

<script setup>
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpOpenReviewItemContent from './PkpOpenReviewItemContent.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';

const props = defineProps({
	review: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewItemByRound', props.styles);
const {formatShortDate} = usePkpDate();
const {t} = usePkpLocalize();
const store = usePkpOpenReviewStore();
</script>
