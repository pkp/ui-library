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

					<!-- Round info -->
					<span :class="cn('version')">{{ review.round.displayText }}</span>
					<span :class="cn('date')">
						— {{ formatShortDate(review.round.date) }}
					</span>
				</div>
			</slot>
		</PkpAccordionHeader>

		<PkpAccordionContent>
			<slot name="content" :review="review">
				<PkpOpenReviewContent :review="review" :styles="styles" />
			</slot>
		</PkpAccordionContent>
	</PkpAccordionItem>
</template>

<script setup>
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpOpenReviewContent from './PkpOpenReviewContent.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpDate} from '@/frontend/composables/usePkpDate';

const props = defineProps({
	review: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewItem', props.styles);
const {formatShortDate} = usePkpDate();
</script>
