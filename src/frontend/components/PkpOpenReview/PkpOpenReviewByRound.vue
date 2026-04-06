<template>
	<PkpAccordionRoot
		v-model="store.expandedRoundIds"
		type="multiple"
		:class="cn('root')"
	>
		<PkpAccordionItem
			v-for="round in store.reviewRounds"
			:key="round.roundId"
			:value="round.roundId"
			:class="cn('roundItem')"
		>
			<PkpAccordionHeader :as="`h${store.headingLevel}`">
				<slot
					name="roundHeader"
					:round="round"
					:summary="store.getRoundSummary(round)"
					:review-count="round.reviews?.length || 0"
				>
					<span :class="cn('roundHeader')">
						<span :class="cn('roundTitle')">{{ round.displayText }}</span>
						<span :class="cn('roundSummary')">
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
								<span :class="cn('roundSummaryLabel')">{{ item.label }}</span>
								<span :class="cn('roundSummarySeparator')" aria-hidden="true">
									{{ t('openReview.recommendationItemSeparator') }}
								</span>
								<span :class="cn('roundSummaryCount')">{{ item.count }}</span>
							</span>
						</span>
						<span v-if="round.date" :class="cn('roundDate')">
							{{ formatShortDate(round.date) }}
						</span>
						<PkpIcon
							v-if="round.authorResponse"
							icon="ReviewAuthorResponse"
							:class="cn('roundResponseIndicator')"
							:aria-label="t('submission.reviewRound.authorResponse')"
						/>
					</span>
				</slot>
			</PkpAccordionHeader>

			<PkpAccordionContent :class="cn('roundContent')">
				<!-- Unified accordion for author response + reviews -->
				<PkpAccordionRoot v-model="store.expandedContentIds" type="multiple">
					<!-- Author Response (first item when present) -->
					<PkpOpenReviewItemAuthorResponse
						v-if="round.authorResponse"
						:round-id="round.roundId"
						:author-response="round.authorResponse"
					>
						<template #header="slotProps">
							<slot name="authorResponseHeader" v-bind="slotProps" />
						</template>
						<template #content="slotProps">
							<slot name="authorResponseContent" v-bind="slotProps" />
						</template>
					</PkpOpenReviewItemAuthorResponse>

					<!-- Review Items -->
					<PkpOpenReviewItemByRound
						v-for="review in round.reviews"
						:key="review.id"
						:review="review"
					>
						<template #header="{review: r}">
							<slot name="reviewHeader" :review="r" :round="round" />
						</template>
						<template #content="{review: r}">
							<slot name="reviewContent" :review="r" :round="round" />
						</template>
					</PkpOpenReviewItemByRound>
				</PkpAccordionRoot>
			</PkpAccordionContent>
		</PkpAccordionItem>
	</PkpAccordionRoot>
</template>

<script setup>
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpOpenReviewItemAuthorResponse from './PkpOpenReviewItemAuthorResponse.vue';
import PkpOpenReviewItemByRound from './PkpOpenReviewItemByRound.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewByRound', props.styles);
const store = usePkpOpenReviewStore();
const {formatShortDate} = usePkpDate();
const {t} = usePkpLocalize();
</script>
