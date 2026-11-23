<template>
	<PkpButton
		v-if="commentsStore.hasMoreComments(publication.id)"
		:class="cn('root')"
		@click="() => commentsStore.loadComments(publication.id)"
	>
		{{
			t('userComment.showMore', {
				count: commentsStore.getShowMoreCommentsCount(publication.id),
			})
		}}
	</PkpButton>
</template>

<script setup>
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	publication: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {t} = usePkpLocalize();
const {cn} = usePkpStyles('PkpCommentsShowMore', props.styles);
const commentsStore = usePkpCommentsStore();
</script>
