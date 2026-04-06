<template>
	<div :class="cn('root')">
		<component :is="'h' + store.headingLevel" :class="cn('title')">
			{{ t('openReview.inProgressTitle') }}
		</component>
		<p :class="cn('description')">
			{{ t('openReview.inProgressDescription') }}
		</p>
	</div>
</template>

<script setup>
import {usePkpOpenReviewStore} from './usePkpOpenReviewStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const store = usePkpOpenReviewStore();
const {cn} = usePkpStyles('PkpOpenReviewInProgress', props.styles);
const {t} = usePkpLocalize();
</script>
