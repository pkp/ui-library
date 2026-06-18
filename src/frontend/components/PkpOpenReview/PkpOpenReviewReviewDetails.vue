<template>
	<div :class="cn('reviewerDetails')">
		<span :class="cn('reviewerDetailName')">
			{{ review.reviewerFullName }}
		</span>
		<span
			v-if="review.reviewerAffiliation"
			:class="cn('reviewerDetailAffiliation')"
		>
			{{ review.reviewerAffiliation }}
		</span>
		<PkpOrcidDisplay
			v-if="review.reviewerOrcid"
			:class="cn('reviewerDetailOrcid')"
			:orcid-url="review.reviewerOrcid"
			:is-verified="review.reviewerHasVerifiedOrcid"
		/>
	</div>
</template>

<script setup>
import PkpOrcidDisplay from '@/frontend/components/PkpOrcidDisplay/PkpOrcidDisplay.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	review: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewReviewDetails', props.styles);
</script>
