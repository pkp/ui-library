<template>
	<div
		v-if="!commentsVersionStore.isLatestPublication"
		class="pkpUserCommentsList__commentNotAllowed"
	>
		<PkpIcon class="pkpUserCommentsList__errorIcon" icon="Error" />
		<span>{{ t('userComment.discussionClosed') }}</span>
	</div>
</template>
<script setup>
import {usePkpLocalize} from '../composables/usePkpLocalize';
import {usePkpCommentsVersionStore} from './usePkpCommentsVersionStore';

const {t} = usePkpLocalize();
const commentsVersionStore = usePkpCommentsVersionStore();
</script>
../../composables/usePkpLocalize../usePkpCommentsVersionStore
