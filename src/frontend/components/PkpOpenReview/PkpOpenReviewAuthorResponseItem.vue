<template>
	<PkpAccordionItem :value="`response-${roundId}`">
		<PkpAccordionHeader>
			<div :class="cn('header')">
				<span :class="cn('label')">
					{{ t('submission.reviewRound.authorResponse') }}
				</span>
			</div>
			<template #indicator>
				<span :class="cn('readButton')">
					{{ t('openReview.readResponse') }}
				</span>
			</template>
		</PkpAccordionHeader>
		<PkpAccordionContent>
			<div :class="cn('content')">
				<p v-strip-unsafe-html="authorResponse.response"></p>
			</div>
		</PkpAccordionContent>
	</PkpAccordionItem>
</template>

<script setup>
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	roundId: {type: [String, Number], required: true},
	authorResponse: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewAuthorResponseItem', props.styles);
const {t} = usePkpLocalize();
</script>
