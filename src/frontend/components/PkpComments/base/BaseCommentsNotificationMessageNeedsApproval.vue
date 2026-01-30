<template>
	<div
		v-if="
			commentsStore.getCurrentUser() &&
			message.userId === commentsStore.getCurrentUser().id &&
			!message.isApproved
		"
		:class="cn('notificationNeedsApproval')"
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

const {cn} = usePkpStyles('PkpComments');

const commentsStore = usePkpCommentsStore();
const {t} = usePkpLocalize();
</script>
