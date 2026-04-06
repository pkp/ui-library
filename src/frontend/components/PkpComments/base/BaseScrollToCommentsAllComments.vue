<template>
	<a :class="cn('allComments')" href="#public-comments">
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

const {cn} = usePkpStyles('PkpScrollToComments');

const commentsStore = usePkpCommentsStore();

const {t} = usePkpLocalize();
</script>
