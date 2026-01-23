<template>
	<a
		class="pkpScrollToComments__all-comments"
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
	const commentsContainer = document.querySelector('#public-comments');
	if (commentsContainer) {
		commentsContainer.scrollIntoView({behavior: 'smooth'});
	}
};
</script>
