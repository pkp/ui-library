<template>
	<div :class="cn('root')">
		<slot>
			<BaseScrollToCommentsAllComments />
			<BaseScrollToCommentsLogInto />
		</slot>
	</div>
</template>

<script setup>
import BaseScrollToCommentsAllComments from './BaseScrollToCommentsAllComments.vue';
import BaseScrollToCommentsLogInto from './BaseScrollToCommentsLogInto.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpScrollToComments', props.styles);
</script>
