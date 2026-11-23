<template>
	<a :class="cn('root')" href="#public-comments">
		{{
			t('userComment.allComments', {
				commentCount: commentsStore.allCommentsCount,
			})
		}}
	</a>
</template>

<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpScrollToCommentsAllComments', props.styles);

const commentsStore = usePkpCommentsStore();

const {t} = usePkpLocalize();
</script>
