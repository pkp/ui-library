<template>
	<div :class="cn('root')">
		<section
			v-for="round in store.reviewRoundsDisplay"
			:key="round.roundId"
			:class="cn('roundItem')"
		>
			<component :is="`h${store.headingLevel}`" :class="cn('roundHeading')">
				<slot
					name="roundHeader"
					:round="round"
					:review-count="round.reviews?.length || 0"
				>
					<span :class="cn('roundHeader')">
						<span :class="cn('roundTitleGroup')">
							<span :class="cn('roundNumber')">
								{{ t('openReview.roundNumber', {number: round.roundNumber}) }}
							</span>
							<span :class="cn('roundVersion')">
								{{ round.versionString || round.displayText }}
							</span>
						</span>
						<span :class="cn('roundStatus')" :data-status="round.status">
							<span :class="cn('roundStatusLabel')">
								{{ t('openReview.status') }}
							</span>
							<span :class="cn('roundStatusValue')">
								{{ roundStatusLabel(round) }}
							</span>
						</span>
					</span>
				</slot>
			</component>

			<!-- Unified accordion for author response + reviews -->
			<PkpAccordionRoot
				v-model="store.expandedContentIds"
				type="multiple"
				:class="cn('roundContent')"
			>
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

				<!-- Author Response (last item when present) -->
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
			</PkpAccordionRoot>
		</section>
	</div>
</template>

<script setup>
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpOpenReviewItemAuthorResponse from './PkpOpenReviewItemAuthorResponse.vue';
import PkpOpenReviewItemByRound from './PkpOpenReviewItemByRound.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewByRound', props.styles);
const store = usePkpOpenReviewStore();
const {t} = usePkpLocalize();

/**
 * Localized label for a round's public review status
 * @param {Object} round - The round object (status: 'complete' | 'inProgress' | 'notStarted')
 * @returns {string}
 */
function roundStatusLabel(round) {
	if (round.status === 'complete') {
		return t('openReview.roundStatusCompleted');
	}
	return t('openReview.roundStatusInProgress');
}
</script>
