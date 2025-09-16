<template>
	<a
		class="BaseScrollToCommentsAllComments"
		style="cursor: pointer"
		@click.prevent="scrollToComments"
	>
		{{
			t('userComment.allComments', {
				commentCount: commentsStore.allCommentsCount,
			})
		}}
	</a>
</template>

<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsStore} from '../usePkpCommentsStore';
const commentsStore = usePkpCommentsStore();

const {t} = usePkpLocalize();
const scrollToComments = () => {
	const commentsContainer = document.querySelector('.BaseComments');
	if (commentsContainer) {
		commentsContainer.scrollIntoView({behavior: 'smooth'});
	}
};
</script>
