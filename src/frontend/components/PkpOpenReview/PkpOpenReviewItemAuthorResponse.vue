<template>
	<PkpAccordionItem :value="`response-${roundId}`" :class="cn('root')">
		<PkpAccordionHeader :as="`h${store.headingLevel + 1}`">
			<slot name="header" :round-id="roundId" :author-response="authorResponse">
				<span :class="cn('header')">
					<span :class="cn('label')">
						{{ t('submission.reviewRound.authorResponse') }}
					</span>
				</span>
			</slot>
			<template #indicator="{open}">
				<span :class="cn('readButton')">
					{{
						open ? t('openReview.hideResponse') : t('openReview.readResponse')
					}}
				</span>
			</template>
		</PkpAccordionHeader>
		<PkpAccordionContent>
			<slot
				name="content"
				:round-id="roundId"
				:author-response="authorResponse"
			>
				<div :class="cn('content')">
					<p v-strip-unsafe-html="localize(authorResponse.response)"></p>
				</div>
			</slot>
		</PkpAccordionContent>
	</PkpAccordionItem>
</template>

<script setup>
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';

const props = defineProps({
	roundId: {type: [String, Number], required: true},
	authorResponse: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewItemAuthorResponse', props.styles);
const {t, localize} = usePkpLocalize();
const store = usePkpOpenReviewStore();
</script>
