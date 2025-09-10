<template>
	<div
		v-if="
			commentsStore.getCurrentUser() &&
			messageProps.message.userId === commentsStore.getCurrentUser().id &&
			!messageProps.message.isApproved
		"
		class="BaseCommentsNotificationMessageApproved"
	>
		<PkpIcon icon="Help" class="pkpUserCommentsList__item--helpIcon"></PkpIcon>
		{{ t('userComment.awaitingApprovalNotice') }}
	</div>
</template>
<script setup>
import {inject} from 'vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const messageProps = inject('messageProps');
const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>
