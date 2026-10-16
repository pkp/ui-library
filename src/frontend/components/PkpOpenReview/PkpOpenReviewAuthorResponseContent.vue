<template>
	<div :class="cn('root')">
		<p v-strip-unsafe-html="authorResponse.response"></p>
	</div>
</template>

<script setup>
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	authorResponse: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewAuthorResponseContent', props.styles);
</script>
