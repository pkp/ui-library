<template>
	<PkpAccordionItem
		:value="String(review.id)"
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
					</span>
					<span :class="cn('headerText')">
						<span :class="cn('statusText')">
							{{ review.reviewerRecommendationDisplayText }}
						</span>
						<span :class="cn('headerMeta')">
							<span :class="cn('version')">{{ versionLabel }}</span>
							<template v-if="review.dateCompleted">
								<span :class="cn('metaSeparator')" aria-hidden="true">|</span>
								<span :class="cn('reviewDate')">
									{{
										t('openReview.reviewDate', {
											date: formatLongDate(review.dateCompleted),
										})
									}}
								</span>
							</template>
						</span>
					</span>
				</span>
			</slot>
			<template #indicator="{open}">
				<span :class="cn('metaRight')">
					<span :class="cn('readButton')">
						{{ open ? t('openReview.hideReview') : t('openReview.readReview') }}
					</span>
				</span>
			</template>
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
import {computed} from 'vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';

const props = defineProps({
	review: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewItemByReviewer', props.styles);
const {t} = usePkpLocalize();
const {formatLongDate} = usePkpDate();
const store = usePkpOpenReviewStore();

// "Round N - Version of Record X" — mirrors the By Record heading labelling
const versionLabel = computed(() => {
	const round = props.review.round || {};
	const roundPart = round.roundNumber
		? t('openReview.roundNumber', {number: round.roundNumber})
		: '';
	const versionPart = round.versionString || round.displayText || '';
	return [roundPart, versionPart].filter(Boolean).join(' - ');
});
</script>
