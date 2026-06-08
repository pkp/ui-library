<template>
	<div :class="cn('root')">
		<section
			v-for="reviewer in store.reviewerGroups"
			:key="reviewer.reviewerId"
			:class="cn('reviewerItem')"
		>
			<component :is="`h${store.headingLevel}`" :class="cn('reviewerHeading')">
				<slot
					name="reviewerHeader"
					:reviewer="reviewer"
					:review-count="reviewer.reviews?.length || 0"
				>
					<span :class="cn('reviewerHeader')">
						<span :class="cn('reviewerTitle')">
							{{ reviewer.reviewerFullName }}
						</span>
						<span :class="cn('reviewerAffiliation')">
							<template v-if="reviewer.reviewerAffiliation">
								{{ reviewer.reviewerAffiliation }}
							</template>
						</span>
					</span>
				</slot>
			</component>

			<!-- Reviews Accordion -->
			<PkpAccordionRoot
				v-model="store.expandedContentIds"
				type="multiple"
				:class="cn('reviewerContent')"
			>
				<PkpOpenReviewItemByReviewer
					v-for="review in reviewer.reviews"
					:key="review.id"
					:review="review"
				>
					<template #header="{review: r}">
						<slot name="reviewHeader" :review="r" :reviewer="reviewer" />
					</template>
					<template #content="{review: r}">
						<slot name="reviewContent" :review="r" :reviewer="reviewer" />
					</template>
				</PkpOpenReviewItemByReviewer>
			</PkpAccordionRoot>
		</section>
	</div>
</template>

<script setup>
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpOpenReviewItemByReviewer from './PkpOpenReviewItemByReviewer.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewByReviewer', props.styles);
const store = usePkpOpenReviewStore();
</script>
