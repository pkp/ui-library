<template>
	<a
		:class="cn('allComments')"
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
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const {cn} = usePkpStyles();

const commentsStore = usePkpCommentsStore();

const {t} = usePkpLocalize();
const scrollToComments = () => {
	const commentsContainer = document.querySelector('#public-comments');
	if (commentsContainer) {
		commentsContainer.scrollIntoView({behavior: 'smooth'});
	}
};
</script>
