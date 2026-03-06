<template>
	<pkp-button
		v-if="commentsStore.hasMoreComments(publication.id)"
		:class="cn('showMore')"
		@click="() => commentsStore.loadComments(publication.id)"
	>
		{{
			t('userComment.showMore', {
				count: commentsStore.getShowMoreCommentsCount(publication.id),
			})
		}}
	</pkp-button>
</template>

<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const {t} = usePkpLocalize();
const {cn} = usePkpStyles('PkpComments');
const commentsStore = usePkpCommentsStore();

defineProps({
	publication: {type: Object, required: true},
});
</script>
