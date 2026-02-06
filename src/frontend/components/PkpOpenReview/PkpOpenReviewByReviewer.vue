<template>
	<PkpAccordionRoot
		v-model="store.expandedRoundIds"
		type="multiple"
		:class="cn('root')"
	>
		<PkpAccordionItem
			v-for="reviewer in store.reviewerGroups"
			:key="reviewer.reviewerId"
			:value="reviewer.reviewerId"
			:class="cn('reviewerItem')"
		>
			<PkpAccordionHeader :as="`h${store.headingLevel}`">
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
							{{ reviewer.reviewerAffiliation }}
						</span>
					</span>
				</slot>
			</PkpAccordionHeader>

			<PkpAccordionContent :class="cn('reviewerContent')">
				<!-- Reviews Accordion -->
				<PkpAccordionRoot
					v-model="store.expandedContentIds"
					type="multiple"
					:class="cn('contentAccordion')"
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
			</PkpAccordionContent>
		</PkpAccordionItem>
	</PkpAccordionRoot>
</template>

<script setup>
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import PkpOpenReviewItemByReviewer from './PkpOpenReviewItemByReviewer.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewByReviewer', props.styles);
const store = usePkpOpenReviewStore();
</script>
