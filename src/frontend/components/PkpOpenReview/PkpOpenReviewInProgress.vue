<template>
	<div :class="cn('root')">
		<h3 :class="cn('title')">
			{{ t('openReview.inProgressTitle') }}
		</h3>
		<p :class="cn('description')">
			{{ t('openReview.inProgressDescription') }}
		</p>
	</div>
</template>

<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewInProgress', props.styles);
const {t} = usePkpLocalize();
</script>
