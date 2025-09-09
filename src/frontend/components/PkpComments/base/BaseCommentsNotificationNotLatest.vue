<template>
	<div
		v-if="!commentsVersionStore.isLatestPublication"
		class="BaseCommentsNotificationNotLatest"
	>
		<PkpIcon icon="Error" />
		{{ t('userComment.discussionClosed') }}
	</div>
</template>
<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpCommentsVersionStore} from '../usePkpCommentsVersionStore';

const {t} = usePkpLocalize();
const commentsVersionStore = usePkpCommentsVersionStore();
</script>
