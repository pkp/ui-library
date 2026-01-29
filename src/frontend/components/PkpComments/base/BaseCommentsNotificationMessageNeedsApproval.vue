<template>
	<div
		v-if="
			commentsStore.getCurrentUser() &&
			message.userId === commentsStore.getCurrentUser().id &&
			!message.isApproved
		"
		:class="cn('notificationMessageNeedsApproval')"
	>
		<PkpIcon icon="Help" />
		{{ t('userComment.awaitingApprovalNotice') }}
	</div>
</template>
<script setup>
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

defineProps({
	message: {type: Object, required: true},
});

const {cn} = usePkpStyles();

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>

<style>
.PkpComments__notificationMessageNeedsApproval {
	display: flex;
	align-items: center;
}
</style>
