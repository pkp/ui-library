<template>
	<div :class="cn('root')">
		<section
			v-for="reviewer in store.reviewerGroups"
			:key="reviewer.reviewerId"
			:class="cn('reviewerItem')"
		>
			<div :class="cn('reviewerHeader')">
				<slot
					name="reviewerHeader"
					:reviewer="reviewer"
					:review-count="reviewer.reviews?.length || 0"
					:heading-level="store.headingLevel"
				>
					<component
						:is="`h${store.headingLevel}`"
						:class="cn('reviewerHeading')"
					>
						{{ reviewer.reviewerFullName }}
					</component>
					<span
						v-if="reviewer.reviewerAffiliation"
						:class="cn('reviewerAffiliation')"
					>
						{{ reviewer.reviewerAffiliation }}
					</span>
				</slot>
			</div>

			<!-- Reviews Accordion -->
			<PkpAccordionRoot
				:model-value="store.expandedContentIds"
				type="multiple"
				:class="cn('reviewerContent')"
				@update:model-value="store.setExpandedContent"
			>
				<PkpAccordionItem
					v-for="review in reviewer.reviews"
					:key="review.id"
					:value="String(review.id)"
					:data-review-id="review.id"
					:class="cn('reviewItem')"
				>
					<PkpAccordionHeader :as="`h${store.headingLevel + 1}`">
						<slot name="reviewHeader" :review="review" :reviewer="reviewer">
							<span :class="cn('reviewHeader')">
								<span
									:class="cn('reviewStatus')"
									:data-recommendation="review.reviewerRecommendationTypeKey"
								>
									<PkpIcon
										:icon="review.reviewerRecommendationTypeIcon"
										:class="cn('reviewStatusIcon')"
										aria-hidden="true"
									/>
								</span>
								<span :class="cn('reviewHeaderText')">
									<span :class="cn('reviewStatusText')">
										{{ review.reviewerRecommendationDisplayText }}
									</span>
									<span :class="cn('reviewHeaderMeta')">
										<span :class="cn('version')">
											{{ versionLabel(review) }}
										</span>
										<template v-if="review.dateCompleted">
											<span :class="cn('metaSeparator')" aria-hidden="true">
												|
											</span>
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
									{{
										open
											? t('openReview.hideReview')
											: t('openReview.readReview')
									}}
								</span>
							</span>
						</template>
					</PkpAccordionHeader>

					<PkpAccordionContent>
						<slot name="reviewContent" :review="review" :reviewer="reviewer">
							<PkpOpenReviewReviewContent :review="review" />
						</slot>
					</PkpAccordionContent>
				</PkpAccordionItem>
			</PkpAccordionRoot>
		</section>
	</div>
</template>

<script setup>
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpOpenReviewReviewContent from './PkpOpenReviewReviewContent.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpDate} from '@/frontend/composables/usePkpDate';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewByReviewer', props.styles);
const store = usePkpOpenReviewStore();
const {t} = usePkpLocalize();
const {formatLongDate} = usePkpDate();

/**
 * "Round N - Version of Record X" — mirrors the By Record heading labelling
 * @param {Object} review - The review object (round info attached in initialize)
 * @returns {string}
 */
function versionLabel(review) {
	const round = review.round || {};
	const roundPart = round.roundNumber
		? t('openReview.roundNumber', {number: round.roundNumber})
		: '';
	const versionPart = round.versionString || round.displayText || '';
	return [roundPart, versionPart].filter(Boolean).join(' - ');
}
</script>
